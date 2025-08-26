const express = require("express");
const { route, post } = require("./ticket.router");
const router = express.Router();
const mongoose = require("mongoose");
const { User } = require("../model/user/User.schema");

const {
  insertUser,
  getUserByEmail,
  getUserById,
  storeUserRefreshJWT,
  updatePassword,
  verifyUser,
} = require("../model/user/User.model");

const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");

const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");
const {
  setPasswordRestPin,
  getPinByEmailPin,
  deletePin,
} = require("../model/restPin/RestPin.model");
const { emailProcessor } = require("../helpers/email.helper");
const {
  resetPassReqValidation,
  updatePassValidation,
  newUserValidation,
} = require("../middlewares/formValidation.middleware");
const { verify } = require("jsonwebtoken");

const { deleteJWT } = require("../helpers/redis.helper");

const { updateUserVerification } = require("../model/user/User.model");

router.all("/", (req, res, next) => {
  // res.json({ message: "return form user router" });

  next();
});

// Get user profile router
router.get("/", userAuthorization, async (req, res) => {
  //this data coming form database
  const _id = req.userId;

  const userProf = await getUserById(_id);
  const { name, email } = userProf;
  res.json({
    user: {
      _id,
      name,
      email,
    },
  });
});

///very user after user is sign up
router.get("/verify/:_id/:email", async (req, res) => {
  try {
    const { _id, email } = req.params;
    const decodedEmail = decodeURIComponent(email);

    const user = await verifyUser(_id, decodedEmail);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or already verified link",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Account successfully verified!",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error during verification",
    });
  }
});

// Create new user router
router.post("/", newUserValidation, async (req, res) => {
  const { name, company, address, phone, email, password } = req.body;

  try {
    // Check if user already exists first
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "This email already has an account",
      });
    }

    // Hash password
    const hashedPass = await hashPassword(password);

    const newUserObj = {
      name,
      company,
      address,
      phone,
      email: email.toLowerCase(), // Ensure consistent case
      password: hashedPass,
      isVerified: false, // Explicitly set verification status
    };

    const result = await insertUser(newUserObj);

    // IMPORTANT: Update the verification link to match your route!
    const verificationLink = `http://${req.headers.host}/v1/user/verify/${
      result._id
    }/${encodeURIComponent(result.email)}`;

    console.log("Generated verification link:", verificationLink);

    // Send verification email to the actual user with the correct link
    try {
      await emailProcessor({
        email: result.email,
        type: "new-user-confirmation-required",
        verificationLink,
      });

      console.log(`Verification email sent to ${result.email}`);
    } catch (emailError) {
      console.error("Email send failed:", emailError);
      // Continue even if email fails - user can request resend
    }

    // Return response without sensitive data
    const userResponse = {
      _id: result._id,
      name: result.name,
      email: result.email,
      company: result.company,
    };

    return res.status(201).json({
      status: "success",
      message:
        "Registration successful! Please check your email to verify your account.",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      status: "error",
      message: "Unable to complete registration. Please try again later.",
    });
  }
});

//User sign in Router
router.post("/login", async (req, res) => {
  try {
    console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ status: "error", message: "Invalid form submission!" });
    }

    const user = await getUserByEmail(email.toLowerCase());
    console.log("Login attempt for:", email.toLowerCase());
    console.log("User found:", user);
    if (user) {
      console.log(
        "User isVerified:",
        user.isVerified,
        "Type:",
        typeof user.isVerified
      );
    }

    if (!user) {
      return res.json({
        status: "error",
        message: "Invalid email or password!",
      });
    }

    // Improved verification check
    if (user.isVerified !== true) {
      return res.json({
        status: "error",
        message:
          "Your account has not been verified. Please check your email and verify your account before you are able to login!",
      });
    }

    const passFromDb = user.password;
    const result = await comparePassword(password, passFromDb);

    if (!result) {
      return res.json({
        status: "error",
        message: "Invalid email or password!",
      });
    }

    const accessJWT = await createAccessJWT(user.email, `${user._id}`);
    const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);

    res.json({
      status: "success",
      message: "Login Successfully!",
      accessJWT,
      refreshJWT,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Internal server error!" });
  }
});


router.post("/reset-password", resetPassReqValidation, async (req, res) => {
  const { email } = req.body;

  const user = await getUserByEmail(email.toLowerCase());

  if (user && user._id) {
    /// crate// 2. create unique 6 digit pin
    const setPin = await setPasswordRestPin(email);
    await emailProcessor({
      email,
      pin: setPin.pin,
      type: "request-new-password",
    });
  }

  res.json({
    status: "success",
    message:
      "If the email is exist in our database, the password reset pin will be sent shortly.",
  });
});

router.patch("/reset-password", updatePassValidation, async (req, res) => {
  const { email, pin, newPassword } = req.body;

  const getPin = await getPinByEmailPin(email, pin);
  // 2. validate pin
  if (getPin?._id) {
    const dbDate = getPin.addedAt;
    const expiresIn = 1;

    let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);

    const today = new Date();

    if (today > expDate) {
      return res.json({ status: "error", message: "Invalid or expired pin." });
    }

    // encrypt new password
    const hashedPass = await hashPassword(newPassword);

    const user = await updatePassword(email, hashedPass);

    if (user._id) {
      // send email notification
      await emailProcessor({ email, type: "update-password-success" });

      ////delete pin from db
      deletePin(email, pin);

      return res.json({
        status: "success",
        message: "Your password has been updated",
      });
    }
  }
  res.json({
    status: "error",
    message: "Unable to update your password. plz try again later",
  });
});

// User logout and invalidate jwts

router.delete("/logout", userAuthorization, async (req, res) => {
  const { authorization } = req.headers;
  //this data coming form database
  const _id = req.userId;

  // 2. delete accessJWT from redis database
  deleteJWT(authorization);

  // 3. delete refreshJWT from mongodb
  const result = await storeUserRefreshJWT(_id, "");

  if (result._id) {
    return res.json({ status: "success", message: "Loged out successfully" });
  }

  res.json({
    status: "error",
    message: "Unable to logg you out, plz try again later",
  });
});

module.exports = router;

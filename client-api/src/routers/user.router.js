const express = require("express");
const router = express.Router();

const {
  insertUser,
  getUserByEmail,
  getUserById,
  storeUserRefreshJWT,
  updatePassword,
  verifyUser,
} = require("../model/user/User.model");

const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.redis.helper");

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
const { deleteJWT } = require("../helpers/redis.helper");

router.all("/", (req, res, next) => {
  // res.json({ message: "return form user router" });

  next();
});

// Get user profile router
router.get("/", userAuthorization, async (req, res) => {
  try {
    const _id = req.userId;

    const userProf = await getUserById(_id);
    
    if (!userProf) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const { name, email } = userProf;
    res.json({
      status: "success",
      user: {
        _id,
        name,
        email,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to fetch user profile",
    });
  }
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ status: "error", message: "Invalid form submission!" });
    }

    const user = await getUserByEmail(email.toLowerCase());

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

    // Create both JWTs in parallel for better performance
    const [accessJWT, refreshJWT] = await Promise.all([
      createAccessJWT(user.email, `${user._id}`),
      createRefreshJWT(user.email, `${user._id}`)
    ]);

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
  try {
    const { email } = req.body;

    const user = await getUserByEmail(email.toLowerCase());   

    if (user && user._id) {
      try {
        // Create unique 6 digit pin
        const setPin = await setPasswordRestPin(email);
        
        if (!setPin || !setPin.pin) {
          console.error("Failed to generate reset pin");
          return res.status(500).json({
            status: "error",
            message: "Unable to generate reset pin. Please try again later.",
          });
        }

        // Send email with pin
        await emailProcessor({
          email: email.toLowerCase(),
          pin: setPin.pin,
          type: "request-new-password",
        });
      } catch (error) {
        console.error("Error in password reset process:", error);
        // Still return success to prevent email enumeration
      }
    }

    // Always return success message to prevent email enumeration
    res.json({
      status: "success",
      message:
        "If the email exists in our database, the password reset pin will be sent shortly.",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to process password reset request. Please try again later.",
    });
  }
});

router.patch("/reset-password", updatePassValidation, async (req, res) => {
  try {
    const { email, pin, newPassword } = req.body;

    if (!email || !pin || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Email, pin, and new password are required",
      });
    }

    const getPin = await getPinByEmailPin(email.toLowerCase(), pin);
    
    // Validate pin exists
    if (!getPin || !getPin._id) {
      return res.status(400).json({
        status: "error",
        message: "Invalid pin. Please check and try again.",
      });
    }

    // Validate pin expiration (1 day)
    const dbDate = getPin.addedAt;
    const expiresIn = 1; // 1 day
    const expDate = new Date(dbDate.getTime() + (expiresIn * 24 * 60 * 60 * 1000));
    const today = new Date();

    if (today > expDate) {
      // Delete expired pin
      try {
        await deletePin(email.toLowerCase(), pin);
      } catch (err) {
        console.error("Error deleting expired pin:", err);
      }
      return res.status(400).json({
        status: "error",
        message: "Pin has expired. Please request a new password reset.",
      });
    }

    // Encrypt new password
    const hashedPass = await hashPassword(newPassword);

    // Update password
    const user = await updatePassword(email.toLowerCase(), hashedPass);

    if (!user || !user._id) {
      return res.status(500).json({
        status: "error",
        message: "Unable to update your password. Please try again later.",
      });
    }

    // Send email notification (non-blocking)
    try {
      await emailProcessor({
        email: email.toLowerCase(),
        type: "update-password-success",
      });
    } catch (emailError) {
      console.error("Error sending password update email:", emailError);
      // Continue even if email fails
    }

    // Delete pin from db
    try {
      await deletePin(email.toLowerCase(), pin);
    } catch (deleteError) {
      console.error("Error deleting pin after password update:", deleteError);
      // Continue even if pin deletion fails
    }

    return res.json({
      status: "success",
      message: "Your password has been updated successfully.",
    });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error. Please try again later",
    });
  }
});

// User logout and invalidate jwts
router.delete("/logout", userAuthorization, async (req, res) => {
  try {
    const { authorization } = req.headers;
    const _id = req.userId;

    // Delete accessJWT from redis database
    await deleteJWT(authorization);

    // Delete refreshJWT from mongodb
    const result = await storeUserRefreshJWT(_id, "");

    if (result && result._id) {
      return res.json({ 
        status: "success", 
        message: "Logged out successfully" 
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Unable to log you out, please try again later",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({
      status: "error",
      message: "Unable to log you out, please try again later",
    });
  }
});

module.exports = router;

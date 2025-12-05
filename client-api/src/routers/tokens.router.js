const express = require("express");
const router = express.Router();

const { verifyRefreshJWT, createAccessJWT } = require("../helpers/jwt.redis.helper");
const { getUserByEmail } = require("../model/user/User.model");

//return refresh jwt
router.get("/", async (req, res) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(403).json({ 
        status: "error",
        message: "Forbidden: No token provided" 
      });
    }

    const decoded = verifyRefreshJWT(authorization);
    
    if (!decoded || !decoded.email) {
      return res.status(403).json({ 
        status: "error",
        message: "Forbidden: Invalid or expired token" 
      });
    }

    const userProf = await getUserByEmail(decoded.email);

    if (!userProf || !userProf._id) {
      return res.status(403).json({ 
        status: "error",
        message: "Forbidden: User not found" 
      });
    }

    // Check if refresh token matches and is not expired
    const dBrefreshToken = userProf.refreshJWT?.token;
    const tokenAddedAt = userProf.refreshJWT?.addedAt;

    if (!tokenAddedAt || !dBrefreshToken) {
      return res.status(403).json({ 
        status: "error",
        message: "Forbidden: Invalid refresh token" 
      });
    }

    // Calculate expiration date
    const expDays = parseInt(process.env.JWT_REFRESH_SECRET_EXP_DAY || 30);
    const tokenExp = new Date(tokenAddedAt);
    tokenExp.setDate(tokenExp.getDate() + expDays);

    const today = new Date();

    // Check if token matches and is not expired
    if (dBrefreshToken !== authorization || tokenExp < today) {
      return res.status(403).json({ 
        status: "error",
        message: "Forbidden: Token expired or invalid" 
      });
    }

    const accessJWT = await createAccessJWT(
      decoded.email,
      userProf._id.toString()
    );

    return res.json({ status: "success", accessJWT });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ 
      status: "error",
      message: "Internal server error" 
    });
  }
});

module.exports = router;
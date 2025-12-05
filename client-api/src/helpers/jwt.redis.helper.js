const jwt = require("jsonwebtoken");
const { setJWT } = require("./redis.helper");
const { storeUserRefreshJWT } = require("../model/user/User.model");

// Create Access Token and store in Redis
const createAccessJWT = async (email, _id) => {
  try {
    const accessJWT = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m", // Access token valid for 15 minutes
    });

    // Store in Redis with same expiry (900 seconds = 15 minutes)
    await setJWT(accessJWT, _id, 900);

    return accessJWT;
  } catch (error) {
    throw error;
  }
};

// Create Refresh Token and store in MongoDB
const createRefreshJWT = async (email, _id) => {
  try {
    const refreshJWT = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });

    await storeUserRefreshJWT(_id, refreshJWT);

    return refreshJWT;
  } catch (error) {
    throw error;
  }
};

// Verify Access Token
const verifyAccessJWT = (userJWT) => {
  try {
    return jwt.verify(userJWT, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    return null; // Return null if invalid or expired
  }
};

// Verify Refresh Token
const verifyRefreshJWT = (userJWT) => {
  try {
    return jwt.verify(userJWT, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  createAccessJWT,
  createRefreshJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
};

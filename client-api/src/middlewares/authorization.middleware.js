const { verifyAccessJWT } = require("../helpers/jwt.redis.helper");
const { getJWT, deleteJWT } = require("../helpers/redis.helper");

const userAuthorization = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(403).json({ message: "Forbidden: No token provided" });
    }

    // Verify JWT
    const decoded = await verifyAccessJWT(authorization);

    if (decoded && decoded.email) {
      // Check Redis for active session
      const userId = await getJWT(authorization);
      if (!userId) {
        return res.status(403).json({ message: "Forbidden: Session expired" });
      }

      req.userId = userId;
      return next();
    }

    // If token is invalid or email not present
    await deleteJWT(authorization);
    return res.status(403).json({ message: "Forbidden: Invalid token" });

  } catch (error) {
    // Clean up and deny access on any error (invalid token, etc.)
    if (req.headers.authorization) {
      await deleteJWT(req.headers.authorization);
    }
    return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
};

module.exports = {
  userAuthorization,
};

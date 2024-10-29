const jwt = require("jsonwebtoken");
const userModal = require("../schema/userSchema");

//Authentication Middleware:which verifies users by checking the validity of their JWTs.
const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModal.findById(decoded.id);

    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
//Authorization Middleware:which checks whether authenticated users have the necessary permissions (admin role) to access certain routes
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};
module.exports = { authMiddleware, adminMiddleware };

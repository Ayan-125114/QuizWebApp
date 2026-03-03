const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

exports.adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.teacherOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not authorized"
    });
  }

  if (req.user.role !== "teacher") {
    return res.status(403).json({
      message: "Teacher access only"
    });
  }

  next();
};
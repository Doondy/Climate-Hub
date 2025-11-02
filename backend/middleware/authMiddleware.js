import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  // Check if token is null, undefined, empty, or malformed
  if (!token || 
      token === "null" || 
      token === "undefined" || 
      token.trim() === "" ||
      token.length < 10) { // Basic JWT format check (should be longer)
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded; // Add decoded data (userId, etc.) to request object
    next();
  } catch (error) {
    // Suppress "jwt malformed" errors in logs as they're handled above
    // Only log other types of JWT errors (expired, invalid signature, etc.)
    if (error.name === "JsonWebTokenError" && error.message === "jwt malformed") {
      // Already handled by pre-check, don't log
    } else if (error.name === "TokenExpiredError") {
      // Token expired - this is expected behavior
    } else {
      console.error("JWT verify error:", error.name, error.message);
    }
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

export default authMiddleware;



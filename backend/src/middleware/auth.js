import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authRequired = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Server configuration error",
      });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token is required",
      });
    }

    const token = authHeader.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        message: "Invalid authorization token",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload?.userId) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    // Fetch only required fields
    const user = await User.findById(payload.userId).select(
      "_id email fullName phone isAdmin"
    );

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export const adminRequired = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};
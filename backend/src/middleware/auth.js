import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authRequired = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not configured" });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload?.userId) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
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
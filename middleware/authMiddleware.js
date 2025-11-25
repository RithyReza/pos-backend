import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_KEY";

export async function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ success: false, message: "No token" });

  const token = auth.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    // optionally load user
    req.userDoc = await User.findById(payload.id).select("-password");
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admins only" });
  }
  next();
}

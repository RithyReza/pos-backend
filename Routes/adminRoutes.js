import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { verifyToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// List staff + admins (admin only)
router.get("/staff", verifyToken, requireAdmin, async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ success: true, users });
});

// Create staff account (admin only)
router.post("/staff", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ success: false, message: "Username exists" });

    const hashed = await bcrypt.hash(password, 10);
    const u = await User.create({ username, password: hashed, role: role || "staff" });
    res.json({ success: true, user: { id: u._id, username: u.username, role: u.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Admin resets a staff password (admin only)
router.put("/staff/:id/reset", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.params.id, { password: hashed });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Delete staff (admin only)
router.delete("/staff/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;

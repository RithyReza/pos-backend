import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// ONLY RUN ONCE then delete
router.get("/create-admin", async (req, res) => {
  try {
    const hashed = await bcrypt.hash("admin123", 10); // change your password here

    const admin = await User.create({
      username: "admin", // change your username here
      email: "admin@example.com",
      password: hashed,
      role: "admin"
    });

    res.json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;


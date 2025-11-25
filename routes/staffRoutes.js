import express from "express";
import Staff from "../models/Staff.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// ======================
// ADD STAFF
// ======================
router.post("/add", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.json({ success: false, message: "Name and password required" });
    }

    const exists = await Staff.findOne({ name });
    if (exists) {
      return res.json({ success: false, message: "Name already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const staff = await Staff.create({
      name,
      password: hashed,
      role: "staff",
    });

    res.json({ success: true, staff });
  } catch (err) {
    console.log("Staff add error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ======================
// STAFF LOGIN
// ======================
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    const staff = await Staff.findOne({ name });
    if (!staff) {
      return res.json({ success: false, message: "Staff not found" });
    }

    const match = await bcrypt.compare(password, staff.password);
    if (!match) {
      return res.json({ success: false, message: "Invalid password" });
    }

    return res.json({
      success: true,
      user: {
        name: staff.name,
        role: staff.role,
      },
    });
  } catch (err) {
    console.log("Staff login error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// ======================
// LIST STAFF
// ======================
router.get("/list", async (req, res) => {
  try {
    const staff = await Staff.find({ role: "staff" });
    res.json({ success: true, staff });
  } catch (err) {
    console.log("Staff list error:", err);
    res.status(500).json({ success: false, message: "Failed to load staff" });
  }
});

// ======================
// DELETE STAFF
// ======================
router.delete("/delete/:id", async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.log("Staff delete error:", err);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

export default router;

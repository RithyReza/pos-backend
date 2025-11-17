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

    const exists = await Staff.findOne({ name });
    if (exists) return res.json({ success: false, message: "Name already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const staff = await Staff.create({
      name,
      password: hashed,
      role: "staff",
    });

    res.json({ success: true, staff });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// ======================
// STAFF LOGIN
// ======================
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  // Check if user exists
  const staff = await Staff.findOne({ name });
  if (!staff) {
    return res.json({ success: false, message: "Staff not found" });
  }

  // Compare password
  const match = await bcrypt.compare(password, staff.password);
  if (!match) {
    return res.json({ success: false, message: "Invalid password" });
  }

  // Success
  return res.json({
    success: true,
    user: {
      name: staff.name,
      role: "staff",
    },
  });
});

// ======================
// LIST STAFF
// ======================
router.get("/list", async (req, res) => {
  const staff = await Staff.find({ role: "staff" });
  res.json({ success: true, staff });
});

// ======================
// DELETE STAFF
// ======================
router.delete("/delete/:id", async (req, res) => {
  await Staff.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;

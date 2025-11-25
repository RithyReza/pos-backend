import express from "express";
import Staff from "../models/staff.js";

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    const staff = await Staff.findOne({ name });
    if (!staff) return res.json({ success: false, msg: "Staff not found" });

    if (staff.password !== password)
      return res.json({ success: false, msg: "Incorrect password" });

    res.json({
      success: true,
      staff: {
        id: staff._id,
        name: staff.name,
        role: staff.role, // SEND ROLE TO FRONTEND
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ADD STAFF (ADMIN ONLY)
router.post("/add-staff", async (req, res) => {
  try {
    const { name, password, role } = req.body;

    const exists = await Staff.findOne({ name });
    if (exists) return res.json({ success: false, msg: "Name already used" });

    const staff = await Staff.create({ name, password, role });

    res.json({ success: true, staff });
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

// DELETE STAFF
router.delete("/:id", async (req, res) => {
  await Staff.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// GET ALL STAFF
router.get("/", async (req, res) => {
  const staff = await Staff.find();
  res.json(staff);
});

export default router;

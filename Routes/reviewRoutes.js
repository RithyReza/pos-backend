import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// GET ALL ORDERS FOR REVIEW PAGE
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    const formatted = orders.map((o) => ({
      id: o._id,
      date: o.createdAt,
      total: o.total,
      itemCount: o.products.length,
      items: o.products,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("REVIEW ROUTE ERROR:", err);
    res.status(500).json([]);
  }
});

export default router;

import express from "express";
import Order from "../models/order.js";

const router = express.Router();

// GET /api/analytics
router.get("/", async (req, res) => {
  try {
    // get all orders
    const orders = await Order.find().lean();

    // ---- TOTAL SALES ----
    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    // ---- TOTAL ORDERS ----
    const totalOrders = orders.length;

    // ---- PRODUCTS SOLD (sum of all qty in all orders) ----
    const totalProductsSold = orders.reduce(
      (sum, o) =>
        sum + (o.items?.reduce((s, p) => s + (p.qty || 0), 0) || 0),
      0
    );

    // ---- WEEKLY SALES ----
    const weeklySales = [
      { day: "Sun", sales: 0 },
      { day: "Mon", sales: 0 },
      { day: "Tue", sales: 0 },
      { day: "Wed", sales: 0 },
      { day: "Thu", sales: 0 },
      { day: "Fri", sales: 0 },
      { day: "Sat", sales: 0 },
    ];

    orders.forEach((o) => {
      // prefer "date" (your schema) then fallback to createdAt
      const dateValue = o.date || o.createdAt;
      if (!dateValue) return;

      const d = new Date(dateValue);
      if (Number.isNaN(d.getTime())) return;

      const dayIndex = d.getDay(); // 0-6
      const bucket = weeklySales[dayIndex];
      if (bucket) bucket.sales += (o.total || 0);
    });

    return res.json({
      success: true,
      totalSales,
      totalOrders,
      totalProductsSold,
      weeklySales,
    });
  } catch (err) {
    console.log("Analytics error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load analytics" });
  }
});

export default router;

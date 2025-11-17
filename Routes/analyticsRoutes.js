import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();

    // TOTAL SALES
    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    // TOTAL ORDERS
    const totalOrders = orders.length;

    // FIXED: PRODUCTS SOLD
    const totalProductsSold = orders.reduce(
      (sum, o) =>
        sum + (o.items?.reduce((s, p) => s + p.qty, 0) || 0),
      0
    );

    // WEEKLY SALES
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
      const dayIndex = new Date(o.createdAt).getDay();
      const dayName = dayNames[dayIndex];
      const bucket = weeklySales.find((d) => d.day === dayName);
      if (bucket) bucket.sales += (o.total || 0);
    });

    res.json({
      totalSales,
      totalOrders,
      totalProductsSold,
      weeklySales,
    });

  } catch (err) {
    console.log("Analytics error:", err);
    res.status(500).json({ error: "Failed" });
  }
});

export default router;

import express from "express";
import Order from "../models/Order.js";
import shortid from "shortid";

const router = express.Router();

/* ============================================================
   SAVE ORDER (STAFF)
   Expects:
   {
     staffName: "Dara",
     items: [ { name, price, qty, img } ],
     total: 12000,
     cashGiven: 20000
   }
   ============================================================ */
router.post("/save", async (req, res) => {
  try {
    const { staffName, items, total, cashGiven } = req.body;

    const order = await Order.create({
      invoiceId: shortid.generate(),
      staffName,
      items,
      total,
      cashGiven,
      date: new Date()
    });

    res.json({ success: true, order });
  } catch (err) {
    console.log("Order save error:", err);
    res.json({ success: false, error: err.message });
  }
});

/* ============================================================
   GET ORDERS (ADMIN REVIEW PAGE)
   Filters:
   - date: YYYY-MM-DD
   - staff: staff name
   ============================================================ */
router.get("/", async (req, res) => {
  try {
    const { date, staff } = req.query;

    const query = {};

    // DATE FILTER (matches only that specific day)
    if (date) {
      const start = new Date(date + "T00:00:00");
      const end = new Date(date + "T23:59:59");
      query.date = { $gte: start, $lte: end };
    }

    // STAFF FILTER
    if (staff) {
      query.staffName = staff;
    }

    const orders = await Order.find(query).sort({ date: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.log("Order fetch error:", err);
    res.json({ success: false, error: err.message });
  }
});

export default router;

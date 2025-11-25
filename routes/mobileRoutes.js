import express from "express";
import Product from "../models/product.js";

const router = express.Router();

router.post("/add-to-order", async (req, res) => {
  const { barcode } = req.body;

  const product = await Product.findOne({ barcode });
  if (!product) return res.json({ success: false });

  // send product to all POS PCs
  req.app.locals.io.emit("cart:add", product);

  res.json({ success: true });
});

export default router;

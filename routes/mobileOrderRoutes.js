import express from "express";
import Product from "../models/product.js";

const router = express.Router();

router.post("/add-to-order", async (req, res) => {
  try {
    const { barcode } = req.body;

    const product = await Product.findOne({ barcode });

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    req.app.locals.io.emit("order:add", {
      _id: product._id,
      name: product.name,
      price: product.price,
      img: product.img,
    });

    return res.json({ success: true, product });
  } catch (err) {
    console.error("Mobile order error:", err);
    return res.json({ success: false, error: err.message });
  }
});

export default router;

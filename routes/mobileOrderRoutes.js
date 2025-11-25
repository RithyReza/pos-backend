import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// POST: add product to POS order via barcode scan
router.post("/add-to-order", async (req, res) => {
  try {
    const { barcode } = req.body;

    if (!barcode)
      return res.json({ success: false, message: "No barcode provided" });

    // Find product
    const product = await Product.findOne({ barcode });

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // Emit to POS via socket.io
    req.app.locals.io.emit("cart:add", {
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

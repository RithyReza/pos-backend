import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Product from "../models/product.js";

const router = express.Router();

// ===== Multer Setup =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, unique);
  },
});

const upload = multer({ storage });

// ===== Handle phone upload =====
router.post("/", upload.single("img"), async (req, res) => {
  try {
    const { barcode, name, price, category } = req.body;

    const img = req.file ? `/uploads/${req.file.filename}` : "";

    const product = await Product.create({
      barcode,
      name,
      price: Number(price),
      category,
      img,
    });

    // Send live update to all PCs
    req.app.locals.io.emit("product:added", product);

    res.json({ success: true, product });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

export default router;

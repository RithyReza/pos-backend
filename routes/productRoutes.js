import express from "express";
import Product from "../models/product.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Multer setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, name);
  },
});
const upload = multer({ storage });

// ===================
// GET ALL PRODUCTS
// ===================
router.get("/", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// ===================
// FIND PRODUCT BY BARCODE
// ===================
router.get("/barcode/:code", async (req, res) => {
  const code = req.params.code;
  const product = await Product.findOne({ barcode: code });

  if (!product)
    return res.json({ success: false, message: "Not found" });

  res.json({ success: true, product });
});

// ===================
// ADD PRODUCT
// (Duplicate barcode protection)
// ===================
router.post("/add", upload.single("img"), async (req, res) => {
  try {
    const { name, price, category, barcode, stock } = req.body;
    const img = req.file ? `/uploads/${req.file.filename}` : "";

    // 🔥 CHECK DUPLICATE BARCODE
    const exists = await Product.findOne({ barcode });
    if (exists) {
      return res.json({
        success: false,
        duplicate: true,
        product: exists,
        message: "This barcode already exists!",
      });
    }

    // CREATE PRODUCT
    const product = await Product.create({
      name,
      price: Number(price),
      category,
      barcode,
      img,
      stock: Number(stock || 0)
    });

    res.json({ success: true, product });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// ===================
// EDIT PRODUCT
// ===================
router.put("/edit/:id", upload.single("img"), async (req, res) => {
  const id = req.params.id;
  const updates = { ...req.body };

  if (req.file)
    updates.img = `/uploads/${req.file.filename}`;

  const product = await Product.findByIdAndUpdate(id, updates, {
    new: true,
  });

  res.json({ success: true, product });
});

// ===================
// DELETE PRODUCT
// ===================
router.delete("/delete/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;

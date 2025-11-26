import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    qty: Number,
    img: String,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    invoiceId: String,
    staffName: String,
    items: [ItemSchema],
    total: Number,
    cashGiven: Number,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("order", OrderSchema, "orders");

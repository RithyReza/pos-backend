import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  invoiceId: String,
  staffName: String,
  items: [
    {
      name: String,
      price: Number,
      qty: Number,
      img: String
    }
  ],
  total: Number,
  cashGiven: Number,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Order", OrderSchema);

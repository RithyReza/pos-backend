import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "staff" },
  },
  { timestamps: true }
);

// 👇 force collection name = "staffs"
export default mongoose.model("Staff", StaffSchema, "staffs");

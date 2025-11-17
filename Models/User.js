import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String, // hashed
  role: { type: String, enum: ["admin","staff"], default: "staff" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);

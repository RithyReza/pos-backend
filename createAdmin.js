import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(async ()=>{
  const hashed = await bcrypt.hash("admin068", 10);
  const u = await User.create({ username: "admin", password: hashed, role: "admin" });
  console.log("Admin created:", u.username);
  process.exit();
}).catch(console.error);

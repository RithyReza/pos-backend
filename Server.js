import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server as IOServer } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import setupAdmin from "./routes/setupAdmin.js";
import mobileRoutes from "./routes/mobileRoutes.js";
import mobileUpload from "./routes/mobileUpload.js";
import mobileOrderRoutes from "./routes/mobileOrderRoutes.js";
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: "*" }
});

// make io available to routes via app.locals
app.locals.io = io;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✔"))
  .catch(err => console.error(err));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/mobile", mobileOrderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/setup", setupAdmin);

// mobile routes (scan uploads etc)
app.use("/api/mobile", mobileRoutes);
app.use("/api/mobile-upload", mobileUpload);

app.get("/", (req, res) => res.send("Backend running ✔"));

// Socket connection log
io.on("connection", socket => {
  console.log("Socket connected:", socket.id);
  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server on ${process.env.PORT || 5000}`)
);

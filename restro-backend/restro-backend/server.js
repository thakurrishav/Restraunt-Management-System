require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const authRoutes  = require("./routes/authRoutes");
const tableRoutes = require("./routes/tableRoutes");
const orderRoutes = require("./routes/orderRoutes").default;

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth",   authRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "🍽️ Restro Backend is running!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 MongoDB: ${process.env.MONGO_URI}`);
});
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/payments", paymentRoutes);

const recommendationRoutes =
    require("./routes/recommendationRoutes");
app.use(
    "/api/recommendations",
    recommendationRoutes
);
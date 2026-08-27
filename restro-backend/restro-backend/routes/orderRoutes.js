const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Table = require("../models/Table");
const { protect } = require("../middleware/authMiddleware");

// GET /api/orders — get all orders
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/orders — place a new order
router.post("/", protect, async (req, res) => {
  try {
    const { customerName, tableNo, items, subtotal, tax, total, paymentMethod } = req.body;

    // Create the order
    const order = await Order.create({
      customerName, tableNo, items,
      subtotal, tax, total, paymentMethod,
    });

    // Update the table to Booked
    await Table.findOneAndUpdate(
      { tableNo },
      { status: "Booked", currentOrder: order._id }
    );

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/orders/:id — update order status
router.put("/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    // If completed, free up the table
    if (status === "Completed") {
      await Table.findOneAndUpdate(
        { tableNo: order.tableNo },
        { status: "Available", currentOrder: null }
      );
    }

    res.json({ message: "Order updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/orders/:id — delete an order
router.delete("/:id", protect, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

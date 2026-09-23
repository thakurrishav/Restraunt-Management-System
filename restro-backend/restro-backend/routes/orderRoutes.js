import express from "express";
import Order from "../models/Order.js";
import Table from "../models/Table.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

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
    const {
      customerName,
      phone,
      tableNo,
      items,
      subtotal,
      tax,
      total,
      paymentMethod,
    } = req.body;
    const order = await Order.create({
      customerName,
      phone,
      tableNo,
      items,
      subtotal,
      tax,
      total,
      paymentMethod,
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
// GET customer purchase history by phone number
router.get("/customer/:phone", protect, async (req, res) => {
  try {
    const orders = await Order.find({
      phone: req.params.phone,
    }).sort({ createdAt: -1 });

    const totalSpent = orders.reduce(
        (sum, order) => sum + order.total,
        0
    );

    const itemFrequency = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        itemFrequency[item.name] =
            (itemFrequency[item.name] || 0) + item.qty;
      });
    });

    const favoriteItems = Object.entries(itemFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    res.json({
      customerName:
          orders.length > 0
              ? orders[0].customerName
              : "",

      phone: req.params.phone,

      visitCount: orders.length,

      totalSpent,

      favoriteItems,

      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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

export default router;

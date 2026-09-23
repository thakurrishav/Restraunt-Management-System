const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },

  phone: {
    type: String,
    required: true,
  },

  tableNo: { type: Number, required: true },

  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      qty: { type: Number, required: true },
    },
  ],

  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },

  paymentMethod: {
    type: String,
    enum: ["Cash", "Online"],
    default: "Cash",
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },

  razorpayOrderId: {
    type: String,
  },

  razorpayPaymentId: {
    type: String,
  },

  status: {
    type: String,
    enum: ["In Progress", "Ready", "Completed"],
    default: "In Progress",
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);

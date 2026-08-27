// Run this once to add sample data: node seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Table = require("./models/Table");
const Order = require("./models/Order");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB...");

  // Clear existing data
  await User.deleteMany();
  await Table.deleteMany();
  await Order.deleteMany();
  console.log("Cleared existing data...");

  // Create Users
  await User.create([
    { name: "Admin User", email: "admin@restro.com", password: "admin123", role: "Admin", phone: "9999999999" },
    { name: "Raj Waiter", email: "waiter@restro.com", password: "waiter123", role: "Waiter", phone: "8888888888" },
    { name: "Priya Cashier", email: "cashier@restro.com", password: "cashier123", role: "Cashier", phone: "7777777777" },
  ]);
  console.log("✅ Users created");

  // Create Tables
  await Table.create([
    { tableNo: 1, seats: 4, status: "Available" },
    { tableNo: 2, seats: 6, status: "Available" },
    { tableNo: 3, seats: 2, status: "Available" },
    { tableNo: 4, seats: 4, status: "Available" },
    { tableNo: 5, seats: 6, status: "Available" },
    { tableNo: 6, seats: 3, status: "Available" },
    { tableNo: 7, seats: 4, status: "Available" },
    { tableNo: 8, seats: 5, status: "Available" },
  ]);
  console.log("✅ Tables created");

  // Create sample Orders
  await Order.create([
    {
      customerName: "Rahul Shah",
      tableNo: 2,
      items: [
        { name: "Butter Chicken", price: 400, qty: 1 },
        { name: "Mango Lassi", price: 120, qty: 2 },
      ],
      subtotal: 640,
      tax: 34,
      total: 674,
      paymentMethod: "Cash",
      status: "In Progress",
    },
    {
      customerName: "Priya Mehta",
      tableNo: 4,
      items: [
        { name: "Paneer Tikka", price: 250, qty: 1 },
        { name: "Gulab Jamun", price: 100, qty: 2 },
      ],
      subtotal: 450,
      tax: 24,
      total: 474,
      paymentMethod: "Online",
      status: "Ready",
    },
  ]);
  console.log("✅ Orders created");

  console.log("\n🎉 Database seeded successfully!");
  console.log("─────────────────────────────");
  console.log("Login credentials:");
  console.log("  Admin:   admin@restro.com   / admin123");
  console.log("  Waiter:  waiter@restro.com  / waiter123");
  console.log("  Cashier: cashier@restro.com / cashier123");
  console.log("─────────────────────────────");

  process.exit();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

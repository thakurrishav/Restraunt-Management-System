const express = require("express");
const router = express.Router();
const Table = require("../models/Table");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// GET /api/tables — get all tables
router.get("/", protect, async (req, res) => {
  try {
    const tables = await Table.find().populate("currentOrder");
    res.json({ tables });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/tables — add a new table (Admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { tableNo, seats } = req.body;

    const exists = await Table.findOne({ tableNo });
    if (exists) return res.status(400).json({ message: "Table number already exists" });

    const table = await Table.create({ tableNo, seats });
    res.status(201).json({ message: "Table added successfully", table });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/tables/:id — update table status
router.put("/:id", protect, async (req, res) => {
  try {
    const { status, currentOrder } = req.body;
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { status, currentOrder },
      { new: true }
    );
    if (!table) return res.status(404).json({ message: "Table not found" });
    res.json({ message: "Table updated", table });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/tables/:id — delete a table (Admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: "Table deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

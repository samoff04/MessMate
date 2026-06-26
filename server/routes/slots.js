import express from "express";
import Slot from "../models/Slot.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const { date } = req.query;
    const query = date ? { date, isActive: true } : { isActive: true };
    const slots = await Slot.find(query).sort({ mealType: 1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/heatmap", protect, async (req, res) => {
  try {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split("T")[0]);
    }
    const heatmapData = await Promise.all(
      last7Days.map(async (date) => {
        const slots = await Slot.find({ date });
        const dayData = { date, meals: {} };
        for (const slot of slots) {
          dayData.meals[slot.mealType] = {
            booked: slot.bookedCount,
            total: slot.totalCapacity,
            density: Math.round((slot.bookedCount / slot.totalCapacity) * 100),
          };
        }
        return dayData;
      })
    );
    res.json(heatmapData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { mealType, date, timeRange, totalCapacity, menu } = req.body;
    const existing = await Slot.findOne({ mealType, date });
    if (existing)
      return res
        .status(400)
        .json({ message: "Slot already exists for this meal and date" });
    const slot = await Slot.create({ mealType, date, timeRange, totalCapacity, menu });
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const slot = await Slot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
import express from "express";
import Feedback from "../models/Feedback.js";
import Booking from "../models/Booking.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { bookingId, ratings, comment } = req.body;
    const booking = await Booking.findById(bookingId).populate("slot");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const existingFeedback = await Feedback.findOne({ booking: bookingId });
    if (existingFeedback)
      return res.status(400).json({ message: "Feedback already submitted" });

    const feedback = await Feedback.create({
      user: req.user._id,
      slot: booking.slot._id,
      booking: bookingId,
      ratings,
      comment,
      mealType: booking.slot.mealType,
      date: booking.slot.date,
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/admin/stats", protect, adminOnly, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(100);
    const stats = {
      totalFeedbacks: feedbacks.length,
      averages: { taste: 0, hygiene: 0, quantity: 0, service: 0 },
      recent: feedbacks.slice(0, 10),
    };

    if (feedbacks.length > 0) {
      const sum = feedbacks.reduce(
        (acc, f) => {
          acc.taste += f.ratings.taste;
          acc.hygiene += f.ratings.hygiene;
          acc.quantity += f.ratings.quantity;
          acc.service += f.ratings.service;
          return acc;
        },
        { taste: 0, hygiene: 0, quantity: 0, service: 0 }
      );
      Object.keys(stats.averages).forEach((key) => {
        stats.averages[key] = (sum[key] / feedbacks.length).toFixed(1);
      });
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user._id })
      .populate("slot")
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
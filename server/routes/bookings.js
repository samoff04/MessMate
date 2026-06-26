import express from "express";
import Booking from "../models/Booking.js";
import Slot from "../models/Slot.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

const generateToken = (userId, slotId) => {
  const hash = (userId.toString() + slotId.toString())
    .split("")
    .reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  return `MM${Math.abs(hash).toString().slice(0, 4)}`;
};

router.post("/", protect, async (req, res) => {
  try {
    const { slotId } = req.body;
    const slot = await Slot.findById(slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    const existing = await Booking.findOne({
      user: req.user._id,
      slot: slotId,
      status: { $in: ["confirmed", "waitlisted"] },
    });
    if (existing)
      return res.status(400).json({ message: "Already booked this slot" });

    let status = "confirmed";
    let queuePosition = 0;

    if (slot.bookedCount >= slot.totalCapacity) {
      status = "waitlisted";
      const waitlistCount = await Booking.countDocuments({
        slot: slotId,
        status: "waitlisted",
      });
      queuePosition = waitlistCount + 1;
    } else {
      slot.bookedCount += 1;
      await slot.save();
    }

    const booking = await Booking.create({
      user: req.user._id,
      slot: slotId,
      status,
      queuePosition,
      tokenNumber: generateToken(req.user._id, slotId),
    });

    await booking.populate("slot");
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("slot")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    const wasConfirmed = booking.status === "confirmed";
    booking.status = "cancelled";
    await booking.save();

    if (wasConfirmed) {
      const slot = await Slot.findById(booking.slot);
      if (slot && slot.bookedCount > 0) {
        slot.bookedCount -= 1;
        await slot.save();
      }
      const nextWaitlisted = await Booking.findOne({
        slot: booking.slot,
        status: "waitlisted",
      }).sort({ queuePosition: 1 });

      if (nextWaitlisted) {
        nextWaitlisted.status = "confirmed";
        nextWaitlisted.queuePosition = 0;
        await nextWaitlisted.save();
        if (slot) {
          slot.bookedCount += 1;
          await slot.save();
        }
      }
    }

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/checkin", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { checkedIn: true, checkInTime: new Date(), status: "completed" },
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    const { date } = req.query;
    let matchStage = {};
    if (date) {
      const slots = await Slot.find({ date }).select("_id");
      const slotIds = slots.map((s) => s._id);
      matchStage = { slot: { $in: slotIds } };
    }
    const bookings = await Booking.find(matchStage)
      .populate("user", "name email roomNumber")
      .populate("slot")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
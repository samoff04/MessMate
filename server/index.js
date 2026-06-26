import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import slotRoutes from "./routes/slots.js";
import bookingRoutes from "./routes/bookings.js";
import feedbackRoutes from "./routes/feedback.js";
import Booking from "./models/Booking.js";
import Slot from "./models/Slot.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/feedback", feedbackRoutes);

cron.schedule("*/30 * * * *", async () => {
  const now = new Date();
  const cutoffTime = new Date(now.getTime() - 30 * 60 * 1000);
  const today = now.toISOString().split("T")[0];

  const todaySlots = await Slot.find({ date: today, isActive: true });

  for (const slot of todaySlots) {
    const noShows = await Booking.find({
      slot: slot._id,
      status: "confirmed",
      checkedIn: false,
      createdAt: { $lt: cutoffTime },
    });

    for (const booking of noShows) {
      booking.status = "no-show";
      await booking.save();

      const nextWaitlisted = await Booking.findOne({
        slot: slot._id,
        status: "waitlisted",
      }).sort({ queuePosition: 1 });

      if (nextWaitlisted) {
        nextWaitlisted.status = "confirmed";
        nextWaitlisted.queuePosition = 0;
        await nextWaitlisted.save();
      }
    }
  }
});

app.get("/", (req, res) => res.json({ message: "MessMate API Running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
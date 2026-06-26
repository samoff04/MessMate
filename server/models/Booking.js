import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },
    status: {
      type: String,
      enum: ["confirmed", "waitlisted", "cancelled", "completed", "no-show"],
      default: "confirmed",
    },
    queuePosition: { type: Number, default: 0 },
    checkedIn: { type: Boolean, default: false },
    checkInTime: { type: Date },
    tokenNumber: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
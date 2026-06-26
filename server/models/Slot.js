import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true,
    },
    date: { type: String, required: true },
    timeRange: { type: String, required: true },
    totalCapacity: { type: Number, required: true, default: 50 },
    bookedCount: { type: Number, default: 0 },
    menu: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Slot", slotSchema);
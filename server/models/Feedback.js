import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    ratings: {
      taste: { type: Number, min: 1, max: 5, required: true },
      hygiene: { type: Number, min: 1, max: 5, required: true },
      quantity: { type: Number, min: 1, max: 5, required: true },
      service: { type: Number, min: 1, max: 5, required: true },
    },
    comment: { type: String, default: "", maxlength: 500 },
    mealType: { type: String },
    date: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
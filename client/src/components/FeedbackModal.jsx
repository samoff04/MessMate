import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RiStarFill, RiStarLine, RiCloseLine } from "react-icons/ri";
import api from "../api/axios";
import toast from "react-hot-toast";

const categories = [
  { key: "taste", label: "Taste" },
  { key: "hygiene", label: "Hygiene" },
  { key: "quantity", label: "Quantity" },
  { key: "service", label: "Service" },
];

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-xl transition-transform hover:scale-110"
        >
          {star <= (hovered || value) ? (
            <RiStarFill className="text-accent" />
          ) : (
            <RiStarLine className="text-slate-600" />
          )}
        </button>
      ))}
    </div>
  );
}

export default function FeedbackModal({ booking, onClose, onSuccess }) {
  const [ratings, setRatings] = useState({ taste: 0, hygiene: 0, quantity: 0, service: 0 });
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (Object.values(ratings).some((r) => r === 0)) {
      toast.error("Please rate all categories");
      return;
    }
    setLoading(true);
    try {
      await api.post("/feedback", { bookingId: booking._id, ratings, comment });
      toast.success("Feedback submitted");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-card border border-slate-700 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-100">Rate Your Meal</h3>
              <p className="text-xs text-slate-400 mt-0.5 capitalize">
                {booking.slot?.mealType} · {booking.slot?.date}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all"
            >
              <RiCloseLine size={18} />
            </button>
          </div>

          <div className="space-y-4 mb-5">
            {categories.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{label}</span>
                <StarRating
                  value={ratings[key]}
                  onChange={(v) => setRatings((r) => ({ ...r, [key]: v }))}
                />
              </div>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Any comments? (optional)"
            rows={3}
            className="w-full bg-surface border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none mb-4"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-linear-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
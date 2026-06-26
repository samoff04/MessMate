import { motion } from "motion/react";
import { RiSunLine, RiSunFoggyLine, RiMoonLine, RiUserLine, RiTimeLine } from "react-icons/ri";

const mealConfig = {
  breakfast: {
    icon: RiSunFoggyLine,
    gradient: "from-orange-500/15 to-amber-400/5",
    border: "border-orange-500/25",
    accent: "text-orange-400",
    iconBg: "bg-orange-500/15 border-orange-500/25",
    label: "Breakfast",
  },
  lunch: {
    icon: RiSunLine,
    gradient: "from-sky-500/15 to-cyan-400/5",
    border: "border-sky-500/25",
    accent: "text-sky-400",
    iconBg: "bg-sky-500/15 border-sky-500/25",
    label: "Lunch",
  },
  dinner: {
    icon: RiMoonLine,
    gradient: "from-purple-500/15 to-indigo-400/5",
    border: "border-purple-500/25",
    accent: "text-purple-400",
    iconBg: "bg-purple-500/15 border-purple-500/25",
    label: "Dinner",
  },
};

export default function SlotCard({ slot, onBook, isBooked, isLoading }) {
  const config = mealConfig[slot.mealType];
  const Icon = config.icon;
  const fillPercent = Math.round((slot.bookedCount / slot.totalCapacity) * 100);
  const available = slot.totalCapacity - slot.bookedCount;
  const isFull = available <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className={`bg-gradient-to-br ${config.gradient} border ${config.border} rounded-2xl p-5 relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/[0.015] -translate-y-16 translate-x-16 pointer-events-none" />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl border ${config.iconBg} flex items-center justify-center ${config.accent}`}>
            <Icon size={21} />
          </div>
          <div>
            <h3 className={`font-semibold text-base ${config.accent}`}>{config.label}</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <RiTimeLine size={12} />
              {slot.timeRange}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-slate-300 text-sm font-medium">
            <RiUserLine size={14} />
            {slot.bookedCount}/{slot.totalCapacity}
          </div>
          <span className={`text-xs font-medium mt-0.5 block ${isFull ? "text-red-400" : available <= 10 ? "text-amber-400" : "text-emerald-400"}`}>
            {isFull ? "Full" : `${available} seats left`}
          </span>
        </div>
      </div>

      {slot.menu && (
        <div className="bg-black/20 rounded-xl px-3.5 py-2.5 mb-4">
          <p className="text-xs text-slate-400">{slot.menu}</p>
        </div>
      )}

      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Capacity</span>
          <span className="font-medium">{fillPercent}% filled</span>
        </div>
        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${fillPercent}%` }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            className={`h-full rounded-full ${fillPercent >= 90 ? "bg-red-500" : fillPercent >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: isBooked || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isBooked || isLoading ? 1 : 0.97 }}
        onClick={() => !isBooked && !isLoading && onBook(slot._id)}
        disabled={isBooked || isLoading}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
          isBooked
            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-not-allowed"
            : isFull
            ? "bg-white/5 text-slate-500 border border-slate-700/50 cursor-not-allowed"
            : "bg-gradient-to-r from-sky-600 to-sky-500 text-white hover:from-sky-500 hover:to-sky-400 shadow-lg shadow-sky-500/25"
        }`}
      >
        {isLoading ? "Booking..." : isBooked ? "Booked" : isFull ? "Join Waitlist" : "Book Slot"}
      </motion.button>
    </motion.div>
  );
}
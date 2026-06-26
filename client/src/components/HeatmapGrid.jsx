import { motion } from "motion/react";

const getColor = (density) => {
  if (density === null || density === undefined) return "bg-slate-700/40";
  if (density === 0) return "bg-slate-700/40";
  if (density < 30) return "bg-emerald-500/40";
  if (density < 60) return "bg-yellow-500/50";
  if (density < 85) return "bg-orange-500/60";
  return "bg-red-500/70";
};

const getDayLabel = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en", { weekday: "short" });
};

export default function HeatmapGrid({ data }) {
  const meals = ["breakfast", "lunch", "dinner"];

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-white">7-Day Crowd Heatmap</h3>
        <span className="text-xs text-slate-500">Hover cells for details</span>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[360px]">
          <div className="grid grid-cols-8 gap-1.5 mb-2">
            <div />
            {data.map((d) => (
              <div key={d.date} className="text-center text-xs text-slate-500 font-medium">
                {getDayLabel(d.date)}
              </div>
            ))}
          </div>
          {meals.map((meal) => (
            <div key={meal} className="grid grid-cols-8 gap-1.5 mb-1.5">
              <div className="text-xs text-slate-500 capitalize flex items-center font-medium">
                {meal.slice(0, 3)}
              </div>
              {data.map((d, i) => {
                const mealData = d.meals[meal];
                const density = mealData?.density ?? null;
                return (
                  <motion.div
                    key={d.date}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    title={mealData ? `${density}% filled (${mealData.booked}/${mealData.total})` : "No data"}
                    className={`h-9 rounded-lg ${getColor(density)} border border-white/5 cursor-default hover:opacity-75 hover:scale-105 transition-all`}
                  />
                );
              })}
            </div>
          ))}
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            {[
              { color: "bg-slate-700/40", label: "No data" },
              { color: "bg-emerald-500/40", label: "Low" },
              { color: "bg-yellow-500/50", label: "Medium" },
              { color: "bg-orange-500/60", label: "High" },
              { color: "bg-red-500/70", label: "Full" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${color}`} />
                <span className="text-xs text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
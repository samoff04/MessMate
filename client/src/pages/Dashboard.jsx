import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { RiCalendarCheckLine, RiBookmarkLine, RiArrowRightLine, RiFlashlightLine, RiUserLine } from "react-icons/ri";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const getHeatColor = (density) => {
  if (density === null || density === undefined || density === 0) return "rgba(51,65,85,0.4)";
  if (density < 30) return "rgba(34,197,94,0.4)";
  if (density < 60) return "rgba(234,179,8,0.5)";
  if (density < 85) return "rgba(249,115,22,0.6)";
  return "rgba(239,68,68,0.7)";
};

const getDayLabel = (dateStr) => new Date(dateStr).toLocaleDateString("en", { weekday: "short" });

export default function Dashboard() {
  const { user } = useAuth();
  const [heatmap, setHeatmap] = useState([]);
  const [todaySlots, setTodaySlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [heatmapRes, slotsRes, bookingsRes] = await Promise.all([
          api.get("/slots/heatmap"),
          api.get(`/slots?date=${today}`),
          api.get("/bookings/my"),
        ]);
        setHeatmap(heatmapRes.data);
        setTodaySlots(slotsRes.data);
        setMyBookings(bookingsRes.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid rgba(14,165,233,0.2)", borderTop: "3px solid #0ea5e9", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", paddingTop: "80px", paddingBottom: "48px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 20px" }}>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: "800", color: "white", marginBottom: "4px", letterSpacing: "-0.5px" }}>
                {getGreeting()}, {user?.name.split(" ")[0]}
              </h1>
              <p style={{ fontSize: "14px", color: "#64748b" }}>
                {new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
            <div style={{
              background: "rgba(30,41,59,0.8)", border: "1px solid rgba(148,163,184,0.12)",
              borderRadius: "16px", padding: "12px 20px", textAlign: "center",
              boxShadow: "0 4px 24px rgba(0,0,0,0.2)"
            }}>
              <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Room</div>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "#38bdf8" }}>{user?.roomNumber}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            {[
              {
                to: "/book",
                icon: RiCalendarCheckLine,
                label: "Book a Slot",
                sub: `${todaySlots.length} available today`,
                cta: "Book now",
                grad: "linear-gradient(135deg, rgba(14,165,233,0.15), rgba(6,182,212,0.05))",
                border: "rgba(14,165,233,0.25)",
                color: "#38bdf8",
                shadow: "rgba(14,165,233,0.1)",
              },
              {
                to: "/my-bookings",
                icon: RiBookmarkLine,
                label: "My Bookings",
                sub: `${myBookings.length} recent slots`,
                cta: "View all",
                grad: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,191,36,0.05))",
                border: "rgba(245,158,11,0.25)",
                color: "#f59e0b",
                shadow: "rgba(245,158,11,0.1)",
              },
            ].map(({ to, icon: Icon, label, sub, cta, grad, border, color, shadow }) => (
              <Link key={to} to={to} style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: grad, border: `1px solid ${border}`,
                    borderRadius: "20px", padding: "24px", cursor: "pointer",
                    boxShadow: `0 8px 32px ${shadow}`, transition: "box-shadow 0.2s",
                  }}
                >
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "14px",
                    background: `rgba(${color === "#38bdf8" ? "14,165,233" : "245,158,11"},0.15)`,
                    border: `1px solid ${border}`, display: "flex", alignItems: "center",
                    justifyContent: "center", marginBottom: "16px",
                  }}>
                    <Icon size={22} color={color} />
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "white", marginBottom: "4px" }}>{label}</div>
                  <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>{sub}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: "600", color }}>
                    {cta} <RiArrowRightLine size={14} />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {todaySlots.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                background: "rgba(30,41,59,0.6)", border: "1px solid rgba(148,163,184,0.1)",
                borderRadius: "20px", padding: "24px", marginBottom: "24px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "10px",
                  background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <RiFlashlightLine size={16} color="#22c55e" />
                </div>
                <span style={{ fontSize: "15px", fontWeight: "700", color: "white" }}>Today's Meal Slots</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {todaySlots.map((slot) => {
                  const fill = Math.round((slot.bookedCount / slot.totalCapacity) * 100);
                  const barColor = fill > 85 ? "#ef4444" : fill > 60 ? "#f59e0b" : "#22c55e";
                  return (
                    <div key={slot._id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "rgba(15,23,42,0.5)", borderRadius: "14px", padding: "14px 18px",
                      border: "1px solid rgba(148,163,184,0.08)",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: barColor, boxShadow: `0 0 8px ${barColor}` }} />
                        <div>
                          <span style={{ fontSize: "14px", fontWeight: "600", color: "#e2e8f0", textTransform: "capitalize" }}>{slot.mealType}</span>
                          <span style={{ fontSize: "12px", color: "#475569", marginLeft: "10px" }}>{slot.timeRange}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "100px", height: "6px", background: "rgba(51,65,85,0.8)", borderRadius: "999px", overflow: "hidden" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${fill}%` }}
                            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                            style={{ height: "100%", background: barColor, borderRadius: "999px" }}
                          />
                        </div>
                        <span style={{ fontSize: "12px", color: "#64748b", minWidth: "32px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fill}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{
              background: "rgba(30,41,59,0.6)", border: "1px solid rgba(148,163,184,0.1)",
              borderRadius: "20px", padding: "24px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <span style={{ fontSize: "15px", fontWeight: "700", color: "white" }}>7-Day Crowd Heatmap</span>
              <span style={{ fontSize: "12px", color: "#475569" }}>Hover for details</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <div style={{ minWidth: "380px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "48px repeat(7, 1fr)", gap: "6px", marginBottom: "6px" }}>
                  <div />
                  {heatmap.map((d) => (
                    <div key={d.date} style={{ textAlign: "center", fontSize: "11px", color: "#475569", fontWeight: "600" }}>
                      {getDayLabel(d.date)}
                    </div>
                  ))}
                </div>
                {["breakfast", "lunch", "dinner"].map((meal) => (
                  <div key={meal} style={{ display: "grid", gridTemplateColumns: "48px repeat(7, 1fr)", gap: "6px", marginBottom: "6px" }}>
                    <div style={{ fontSize: "11px", color: "#475569", display: "flex", alignItems: "center", fontWeight: "600", textTransform: "capitalize" }}>
                      {meal.slice(0, 3)}
                    </div>
                    {heatmap.map((d, i) => {
                      const mealData = d.meals[meal];
                      const density = mealData?.density ?? null;
                      return (
                        <motion.div
                          key={d.date}
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.04 }}
                          title={mealData ? `${density}% filled (${mealData.booked}/${mealData.total})` : "No data"}
                          style={{
                            height: "36px", borderRadius: "8px",
                            background: getHeatColor(density),
                            border: "1px solid rgba(255,255,255,0.05)",
                            cursor: "default", transition: "transform 0.15s, opacity 0.15s",
                          }}
                          whileHover={{ scale: 1.1, opacity: 0.85 }}
                        />
                      );
                    })}
                  </div>
                ))}
                <div style={{ display: "flex", gap: "16px", marginTop: "16px", flexWrap: "wrap" }}>
                  {[
                    { color: "rgba(51,65,85,0.4)", label: "No data" },
                    { color: "rgba(34,197,94,0.4)", label: "Low" },
                    { color: "rgba(234,179,8,0.5)", label: "Medium" },
                    { color: "rgba(249,115,22,0.6)", label: "High" },
                    { color: "rgba(239,68,68,0.7)", label: "Full" },
                  ].map(({ color, label }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "4px", background: color }} />
                      <span style={{ fontSize: "11px", color: "#475569" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
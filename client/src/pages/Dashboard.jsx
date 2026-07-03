import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { RiCalendarCheckLine, RiBookmarkLine, RiArrowRightLine, RiFlashlightLine, RiMapPinLine } from "react-icons/ri";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const getHeatColor = (density) => {
  if (!density) return "rgba(253,186,116,0.25)";
  if (density < 30) return "rgba(34,197,94,0.5)";
  if (density < 60) return "rgba(234,179,8,0.6)";
  if (density < 85) return "rgba(249,115,22,0.7)";
  return "rgba(239,68,68,0.8)";
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

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "36px", height: "36px", border: "3px solid #fed7aa", borderTop: "3px solid #f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#fff7ed" }}>

      <div style={{ position: "relative", height: "280px", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/mess.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.5) saturate(1.1)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(124,45,18,0.5) 0%, rgba(154,52,18,0.3) 40%, rgba(255,247,237,1) 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.15) 0%, transparent 60%)",
        }} />

        <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 0 40px 0", maxWidth: "760px", margin: "0 auto", paddingLeft: "20px", paddingRight: "20px" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.75)", marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>{getGreeting()}</p>
            <h1 style={{ fontSize: "38px", fontWeight: "900", color: "white", letterSpacing: "-1px", marginBottom: "6px", lineHeight: "1.1" }}>{user?.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)" }}>
                {new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}
              </span>
              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,255,255,0.4)", display: "inline-block" }} />
              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: "#fb923c", fontWeight: "600" }}>
                <RiMapPinLine size={13} /> Room {user?.roomNumber}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 20px 48px" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
            {[
              {
                to: "/book",
                icon: RiCalendarCheckLine,
                label: "Book a Slot",
                sub: `${todaySlots.length} available today`,
                cta: "Book now",
                bg: "linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #f97316 100%)",
                shadow: "0 12px 40px rgba(194,65,12,0.45)",
              },
              {
                to: "/my-bookings",
                icon: RiBookmarkLine,
                label: "My Bookings",
                sub: `${myBookings.length} recent slots`,
                cta: "View all",
                bg: "linear-gradient(135deg, #78350f 0%, #92400e 50%, #b45309 100%)",
                shadow: "0 12px 40px rgba(120,53,15,0.45)",
              },
            ].map(({ to, icon: Icon, label, sub, cta, bg, shadow }) => (
              <Link key={to} to={to} style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ background: bg, borderRadius: "22px", padding: "26px", cursor: "pointer", boxShadow: shadow, position: "relative", overflow: "hidden" }}
                >
                  <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", bottom: "-30px", left: "-10px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
                  <div style={{ width: "44px", height: "44px", borderRadius: "13px", background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", backdropFilter: "blur(4px)" }}>
                    <Icon size={22} color="white" />
                  </div>
                  <div style={{ fontSize: "17px", fontWeight: "800", color: "white", marginBottom: "4px", letterSpacing: "-0.3px" }}>{label}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", marginBottom: "18px" }}>{sub}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", fontWeight: "700", color: "rgba(255,255,255,0.9)", background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "7px 12px", display: "inline-flex" }}>
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
              transition={{ delay: 0.25 }}
              style={{ background: "white", border: "1px solid #fed7aa", borderRadius: "22px", padding: "24px", marginBottom: "16px", boxShadow: "0 4px 24px rgba(234,88,12,0.08)" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "linear-gradient(135deg, #ea580c, #f97316)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(234,88,12,0.35)" }}>
                  <RiFlashlightLine size={16} color="white" />
                </div>
                <div>
                  <span style={{ fontSize: "15px", fontWeight: "800", color: "#1c1917", letterSpacing: "-0.2px" }}>Today's Meal Slots</span>
                  <div style={{ fontSize: "12px", color: "#a8a29e" }}>{new Date().toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {todaySlots.map((slot) => {
                  const fill = Math.round((slot.bookedCount / slot.totalCapacity) * 100);
                  const barColor = fill > 85 ? "#ef4444" : fill > 60 ? "#f97316" : "#22c55e";
                  const mealIcon = slot.mealType === "breakfast" ? "🌅" : slot.mealType === "lunch" ? "☀️" : "🌙";
                  return (
                    <div key={slot._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff7ed", borderRadius: "14px", padding: "14px 18px", border: "1px solid #fed7aa" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "18px" }}>{mealIcon}</span>
                        <div>
                          <span style={{ fontSize: "14px", fontWeight: "700", color: "#1c1917", textTransform: "capitalize" }}>{slot.mealType}</span>
                          <div style={{ fontSize: "11px", color: "#a8a29e", marginTop: "1px" }}>{slot.timeRange}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "90px", height: "6px", background: "#fed7aa", borderRadius: "999px", overflow: "hidden" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${fill}%` }}
                            transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
                            style={{ height: "100%", background: barColor, borderRadius: "999px" }}
                          />
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: barColor, minWidth: "32px", textAlign: "right" }}>{fill}%</span>
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
            transition={{ delay: 0.35 }}
            style={{ background: "white", border: "1px solid #fed7aa", borderRadius: "22px", padding: "24px", boxShadow: "0 4px 24px rgba(234,88,12,0.08)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div>
                <span style={{ fontSize: "15px", fontWeight: "800", color: "#1c1917", letterSpacing: "-0.2px" }}>7-Day Crowd Heatmap</span>
                <div style={{ fontSize: "12px", color: "#a8a29e", marginTop: "2px" }}>Historical booking density</div>
              </div>
              <span style={{ fontSize: "11px", color: "#a8a29e", background: "#fff7ed", border: "1px solid #fed7aa", padding: "4px 10px", borderRadius: "6px", fontWeight: "500" }}>Hover cells</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <div style={{ minWidth: "380px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "44px repeat(7, 1fr)", gap: "6px", marginBottom: "8px" }}>
                  <div />
                  {heatmap.map((d) => (
                    <div key={d.date} style={{ textAlign: "center", fontSize: "11px", color: "#a8a29e", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.3px" }}>
                      {getDayLabel(d.date)}
                    </div>
                  ))}
                </div>
                {["breakfast", "lunch", "dinner"].map((meal) => (
                  <div key={meal} style={{ display: "grid", gridTemplateColumns: "44px repeat(7, 1fr)", gap: "6px", marginBottom: "7px" }}>
                    <div style={{ fontSize: "11px", color: "#a8a29e", display: "flex", alignItems: "center", fontWeight: "700", textTransform: "capitalize" }}>
                      {meal === "breakfast" ? "🌅" : meal === "lunch" ? "☀️" : "🌙"}
                    </div>
                    {heatmap.map((d, i) => {
                      const mealData = d.meals[meal];
                      const density = mealData?.density ?? null;
                      return (
                        <motion.div
                          key={d.date}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.04 }}
                          title={mealData ? `${density}% filled (${mealData.booked}/${mealData.total})` : "No data"}
                          whileHover={{ scale: 1.15, zIndex: 1 }}
                          style={{ height: "36px", borderRadius: "9px", background: getHeatColor(density), border: "1px solid rgba(234,88,12,0.12)", cursor: "default", position: "relative" }}
                        />
                      );
                    })}
                  </div>
                ))}
                <div style={{ display: "flex", gap: "16px", marginTop: "16px", flexWrap: "wrap", paddingTop: "16px", borderTop: "1px solid #fff7ed" }}>
                  {[
                    { color: "rgba(253,186,116,0.25)", label: "No data" },
                    { color: "rgba(34,197,94,0.5)", label: "Low" },
                    { color: "rgba(234,179,8,0.6)", label: "Medium" },
                    { color: "rgba(249,115,22,0.7)", label: "High" },
                    { color: "rgba(239,68,68,0.8)", label: "Full" },
                  ].map(({ color, label }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "4px", background: color, border: "1px solid rgba(234,88,12,0.15)" }} />
                      <span style={{ fontSize: "11px", color: "#a8a29e", fontWeight: "600" }}>{label}</span>
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
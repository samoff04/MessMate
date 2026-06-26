import { useEffect, useState } from "react";
import { motion } from "motion/react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { RiSunFoggyLine, RiSunLine, RiMoonLine, RiUserLine, RiTimeLine } from "react-icons/ri";

const mealConfig = {
  breakfast: { icon: RiSunFoggyLine, color: "#fb923c", bg: "rgba(251,146,60,0.12)", border: "rgba(251,146,60,0.25)", label: "Breakfast" },
  lunch: { icon: RiSunLine, color: "#38bdf8", bg: "rgba(56,189,248,0.12)", border: "rgba(56,189,248,0.25)", label: "Lunch" },
  dinner: { icon: RiMoonLine, color: "#a78bfa", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.25)", label: "Dinner" },
};

function SlotCard({ slot, onBook, isBooked, isLoading }) {
  const config = mealConfig[slot.mealType];
  const Icon = config.icon;
  const fill = Math.round((slot.bookedCount / slot.totalCapacity) * 100);
  const available = slot.totalCapacity - slot.bookedCount;
  const isFull = available <= 0;
  const barColor = fill >= 90 ? "#ef4444" : fill >= 70 ? "#f59e0b" : "#22c55e";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      style={{
        background: config.bg, border: `1px solid ${config.border}`,
        borderRadius: "20px", padding: "24px", position: "relative", overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.02)", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: `rgba(${config.color === "#fb923c" ? "251,146,60" : config.color === "#38bdf8" ? "56,189,248" : "167,139,250"},0.15)`, border: `1px solid ${config.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={22} color={config.color} />
          </div>
          <div>
            <div style={{ fontSize: "17px", fontWeight: "700", color: config.color, marginBottom: "3px" }}>{config.label}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#64748b" }}>
              <RiTimeLine size={12} /> {slot.timeRange}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "14px", color: "#cbd5e1", fontWeight: "600", marginBottom: "2px" }}>
            <RiUserLine size={14} /> {slot.bookedCount}/{slot.totalCapacity}
          </div>
          <div style={{ fontSize: "12px", fontWeight: "600", color: isFull ? "#ef4444" : available <= 10 ? "#f59e0b" : "#22c55e" }}>
            {isFull ? "Full" : `${available} seats left`}
          </div>
        </div>
      </div>

      {slot.menu && (
        <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "12px", padding: "10px 14px", marginBottom: "18px" }}>
          <p style={{ fontSize: "13px", color: "#94a3b8" }}>{slot.menu}</p>
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#475569", marginBottom: "8px" }}>
          <span>Capacity</span>
          <span style={{ fontWeight: "600" }}>{fill}% filled</span>
        </div>
        <div style={{ height: "6px", background: "rgba(0,0,0,0.3)", borderRadius: "999px", overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${fill}%` }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            style={{ height: "100%", background: barColor, borderRadius: "999px" }}
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: isBooked || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isBooked || isLoading ? 1 : 0.97 }}
        onClick={() => !isBooked && !isLoading && onBook(slot._id)}
        disabled={isBooked || isLoading}
        style={{
          width: "100%", padding: "13px", borderRadius: "12px", fontSize: "14px",
          fontWeight: "600", border: "none", cursor: isBooked || isLoading ? "not-allowed" : "pointer",
          fontFamily: "Inter, system-ui, sans-serif", transition: "all 0.2s",
          background: isBooked ? "rgba(34,197,94,0.15)" : isFull ? "rgba(51,65,85,0.5)" : "linear-gradient(135deg, #0284c7, #0ea5e9)",
          color: isBooked ? "#22c55e" : isFull ? "#475569" : "white",
          boxShadow: isBooked || isFull ? "none" : "0 4px 16px rgba(14,165,233,0.3)",
        }}
      >
        {isLoading ? "Booking..." : isBooked ? "Booked" : isFull ? "Join Waitlist" : "Book Slot"}
      </motion.button>
    </motion.div>
  );
}

export default function BookSlot() {
  const [slots, setSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [slotsRes, bookingsRes] = await Promise.all([
        api.get(`/slots?date=${selectedDate}`),
        api.get("/bookings/my"),
      ]);
      setSlots(slotsRes.data);
      setMyBookings(bookingsRes.data);
    } catch {
      toast.error("Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [selectedDate]);

  const handleBook = async (slotId) => {
    setBookingId(slotId);
    try {
      const { data } = await api.post("/bookings", { slotId });
      toast.success(data.status === "waitlisted" ? `Waitlisted at position ${data.queuePosition}` : `Booked! Token: ${data.tokenNumber}`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingId(null);
    }
  };

  const bookedSlotIds = new Set(myBookings.filter((b) => ["confirmed", "waitlisted"].includes(b.status)).map((b) => b.slot?._id));
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", paddingTop: "80px", paddingBottom: "48px" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 20px" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "white", marginBottom: "6px", letterSpacing: "-0.5px" }}>Book a Slot</h1>
            <p style={{ fontSize: "14px", color: "#64748b" }}>Reserve your mess seat in advance</p>
          </div>

          <div style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(148,163,184,0.1)", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "#94a3b8", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Select Date</label>
            <input
              type="date"
              value={selectedDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ width: "100%", background: "rgba(15,23,42,0.6)", border: "1px solid rgba(148,163,184,0.15)", borderRadius: "12px", padding: "12px 14px", fontSize: "14px", color: "#e2e8f0", outline: "none", fontFamily: "Inter, system-ui, sans-serif" }}
            />
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
              <div style={{ width: "32px", height: "32px", border: "3px solid rgba(14,165,233,0.2)", borderTop: "3px solid #0ea5e9", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : slots.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#475569" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>--</div>
              <div style={{ fontSize: "15px" }}>No slots available for this date</div>
              <div style={{ fontSize: "13px", marginTop: "4px", color: "#334155" }}>Ask admin to create slots</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {slots.map((slot, i) => (
                <motion.div key={slot._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <SlotCard slot={slot} onBook={handleBook} isBooked={bookedSlotIds.has(slot._id)} isLoading={bookingId === slot._id} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
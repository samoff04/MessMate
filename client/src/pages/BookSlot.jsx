import { useEffect, useState } from "react";
import { motion } from "motion/react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { RiSunFoggyLine, RiSunLine, RiMoonLine, RiUserLine, RiTimeLine } from "react-icons/ri";

const mealConfig = {
  breakfast: { icon: RiSunFoggyLine, color: "#ea580c", bg: "rgba(234,88,12,0.08)", border: "#fed7aa", label: "Breakfast", accent: "#fff7ed" },
  lunch: { icon: RiSunLine, color: "#b45309", bg: "rgba(180,83,9,0.08)", border: "#fde68a", label: "Lunch", accent: "#fffbeb" },
  dinner: { icon: RiMoonLine, color: "#7c3aed", bg: "rgba(124,58,237,0.08)", border: "#ddd6fe", label: "Dinner", accent: "#f5f3ff" },
};

function SlotCard({ slot, onBook, isBooked, isLoading }) {
  const config = mealConfig[slot.mealType];
  const Icon = config.icon;
  const fill = Math.round((slot.bookedCount / slot.totalCapacity) * 100);
  const available = slot.totalCapacity - slot.bookedCount;
  const isFull = available <= 0;
  const barColor = fill >= 90 ? "#ef4444" : fill >= 70 ? "#f97316" : "#22c55e";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(234,88,12,0.15)" }}
      style={{ background: "white", border: `1px solid ${config.border}`, borderRadius: "20px", padding: "24px", boxShadow: "0 4px 16px rgba(234,88,12,0.06)", transition: "box-shadow 0.2s" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "50px", height: "50px", borderRadius: "14px", background: config.accent, border: `1px solid ${config.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={24} color={config.color} />
          </div>
          <div>
            <div style={{ fontSize: "17px", fontWeight: "700", color: "#1c1917", marginBottom: "3px" }}>{config.label}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#a8a29e" }}>
              <RiTimeLine size={12} /> {slot.timeRange}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "14px", color: "#57534e", fontWeight: "600", marginBottom: "2px" }}>
            <RiUserLine size={14} /> {slot.bookedCount}/{slot.totalCapacity}
          </div>
          <div style={{ fontSize: "12px", fontWeight: "600", color: isFull ? "#ef4444" : available <= 10 ? "#f97316" : "#22c55e" }}>
            {isFull ? "Full" : `${available} seats left`}
          </div>
        </div>
      </div>

      {slot.menu && (
        <div style={{ background: "#fff7ed", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", border: "1px solid #fed7aa" }}>
          <p style={{ fontSize: "13px", color: "#78716c" }}>{slot.menu}</p>
        </div>
      )}

      <div style={{ marginBottom: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#a8a29e", marginBottom: "7px" }}>
          <span>Capacity</span>
          <span style={{ fontWeight: "600", color: "#78716c" }}>{fill}% filled</span>
        </div>
        <div style={{ height: "6px", background: "#f5f5f4", borderRadius: "999px", overflow: "hidden" }}>
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
        style={{ width: "100%", padding: "13px", borderRadius: "12px", fontSize: "14px", fontWeight: "700", border: "none", cursor: isBooked || isLoading ? "not-allowed" : "pointer", fontFamily: "Inter, system-ui, sans-serif", transition: "all 0.2s", background: isBooked ? "#f0fdf4" : isFull ? "#fafaf9" : "linear-gradient(135deg, #ea580c, #f97316)", color: isBooked ? "#22c55e" : isFull ? "#a8a29e" : "white", boxShadow: isBooked || isFull ? "none" : "0 4px 16px rgba(234,88,12,0.35)", border: isBooked ? "1px solid #bbf7d0" : isFull ? "1px solid #e7e5e4" : "none" }}
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
      const [slotsRes, bookingsRes] = await Promise.all([api.get(`/slots?date=${selectedDate}`), api.get("/bookings/my")]);
      setSlots(slotsRes.data);
      setMyBookings(bookingsRes.data);
    } catch { toast.error("Failed to load slots"); }
    finally { setLoading(false); }
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
    } finally { setBookingId(null); }
  };

  const bookedSlotIds = new Set(myBookings.filter((b) => ["confirmed", "waitlisted"].includes(b.status)).map((b) => b.slot?._id));
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

  return (
    <div style={{ minHeight: "100vh", background: "#fff7ed", paddingTop: "80px", paddingBottom: "48px" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 20px" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#1c1917", marginBottom: "4px", letterSpacing: "-0.5px" }}>Book a Slot</h1>
            <p style={{ fontSize: "14px", color: "#a8a29e" }}>Reserve your mess seat in advance</p>
          </div>

          <div style={{ background: "white", border: "1px solid #fed7aa", borderRadius: "16px", padding: "18px", marginBottom: "24px", boxShadow: "0 2px 12px rgba(234,88,12,0.06)" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#78716c", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Select Date</label>
            <input type="date" value={selectedDate} min={minDate} max={maxDate} onChange={(e) => setSelectedDate(e.target.value)}
              style={{ width: "100%", background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: "12px", padding: "11px 14px", fontSize: "14px", color: "#1c1917", outline: "none", fontFamily: "Inter, system-ui, sans-serif" }} />
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <div style={{ width: "32px", height: "32px", border: "3px solid #fed7aa", borderTop: "3px solid #f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : slots.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🍽</div>
              <div style={{ fontSize: "15px", color: "#78716c", fontWeight: "600" }}>No slots available</div>
              <div style={{ fontSize: "13px", color: "#a8a29e", marginTop: "4px" }}>Ask admin to create slots for this date</div>
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
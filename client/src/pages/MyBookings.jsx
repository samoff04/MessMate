import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { RiTimeLine, RiCheckboxCircleLine, RiCloseCircleLine, RiAlertLine, RiQrCodeLine, RiStarLine } from "react-icons/ri";

const statusConfig = {
  confirmed: { label: "Confirmed", color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)", icon: RiCheckboxCircleLine },
  waitlisted: { label: "Waitlisted", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", icon: RiTimeLine },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", icon: RiCloseCircleLine },
  completed: { label: "Completed", color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.2)", icon: RiCheckboxCircleLine },
  "no-show": { label: "No-show", color: "#64748b", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)", icon: RiAlertLine },
};

function FeedbackModal({ booking, onClose, onSuccess }) {
  const [ratings, setRatings] = useState({ taste: 0, hygiene: 0, quantity: 0, service: 0 });
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const categories = ["taste", "hygiene", "quantity", "service"];

  const handleSubmit = async () => {
    if (Object.values(ratings).some((r) => r === 0)) { toast.error("Please rate all categories"); return; }
    setLoading(true);
    try {
      await api.post("/feedback", { bookingId: booking._id, ratings, comment });
      toast.success("Feedback submitted");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: "400px", background: "#1e293b", border: "1px solid rgba(148,163,184,0.12)", borderRadius: "24px", padding: "28px", boxShadow: "0 32px 64px rgba(0,0,0,0.5)" }}
      >
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "17px", fontWeight: "700", color: "white", marginBottom: "4px" }}>Rate Your Meal</h3>
          <p style={{ fontSize: "13px", color: "#64748b", textTransform: "capitalize" }}>{booking.slot?.mealType} · {booking.slot?.date}</p>
        </div>
        {categories.map((cat) => (
          <div key={cat} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ fontSize: "14px", color: "#cbd5e1", textTransform: "capitalize" }}>{cat}</span>
            <div style={{ display: "flex", gap: "6px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRatings((r) => ({ ...r, [cat]: s }))}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: s <= ratings[cat] ? "#f59e0b" : "#334155", transition: "color 0.15s, transform 0.1s", transform: s <= ratings[cat] ? "scale(1.1)" : "scale(1)" }}>
                  ★
                </button>
              ))}
            </div>
          </div>
        ))}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Any comments? (optional)"
          rows={3}
          style={{ width: "100%", background: "rgba(15,23,42,0.6)", border: "1px solid rgba(148,163,184,0.15)", borderRadius: "12px", padding: "12px 14px", fontSize: "13px", color: "#e2e8f0", outline: "none", resize: "none", marginBottom: "20px", fontFamily: "Inter, system-ui, sans-serif" }}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: "12px", background: "rgba(51,65,85,0.5)", border: "1px solid rgba(148,163,184,0.1)", color: "#94a3b8", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: "12px", borderRadius: "12px", background: "linear-gradient(135deg, #0284c7, #0ea5e9)", border: "none", color: "white", fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter, system-ui, sans-serif", boxShadow: "0 4px 16px rgba(14,165,233,0.3)" }}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackBooking, setFeedbackBooking] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchData = async () => {
    try {
      const [bookingsRes, feedbacksRes] = await Promise.all([api.get("/bookings/my"), api.get("/feedback/my")]);
      setBookings(bookingsRes.data);
      setFeedbacks(feedbacksRes.data);
    } catch { toast.error("Failed to load bookings"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCancel = async (bookingId) => {
    setCancellingId(bookingId);
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      toast.success("Booking cancelled");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    } finally { setCancellingId(null); }
  };

  const feedbackedIds = new Set(feedbacks.map((f) => f.booking));

  if (loading) return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "36px", height: "36px", border: "3px solid rgba(14,165,233,0.2)", borderTop: "3px solid #0ea5e9", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", paddingTop: "80px", paddingBottom: "48px" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 20px" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "white", marginBottom: "6px", letterSpacing: "-0.5px" }}>My Bookings</h1>
            <p style={{ fontSize: "14px", color: "#64748b" }}>{bookings.length} total bookings</p>
          </div>

          {bookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#475569" }}>
              <div style={{ fontSize: "15px" }}>No bookings yet</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <AnimatePresence>
                {bookings.map((booking, i) => {
                  const cfg = statusConfig[booking.status] || statusConfig.confirmed;
                  const StatusIcon = cfg.icon;
                  const canFeedback = booking.status === "completed" && !feedbackedIds.has(booking._id);
                  return (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.04 }}
                      style={{ background: "rgba(30,41,59,0.6)", border: `1px solid ${cfg.border}`, borderRadius: "18px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "16px", fontWeight: "700", color: "white", textTransform: "capitalize" }}>{booking.slot?.mealType}</span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", padding: "3px 10px", borderRadius: "999px", background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontWeight: "600" }}>
                              <StatusIcon size={10} /> {cfg.label}
                            </span>
                            {booking.status === "waitlisted" && (
                              <span style={{ fontSize: "12px", color: "#f59e0b", fontWeight: "600" }}>#{booking.queuePosition}</span>
                            )}
                          </div>
                          <div style={{ fontSize: "13px", color: "#64748b", display: "flex", flexDirection: "column", gap: "3px" }}>
                            <span>{booking.slot?.date}</span>
                            <span>{booking.slot?.timeRange}</span>
                            {booking.tokenNumber && (
                              <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "#38bdf8", fontFamily: "monospace", fontWeight: "600", marginTop: "2px" }}>
                                <RiQrCodeLine size={13} /> {booking.tokenNumber}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginLeft: "16px" }}>
                          {["confirmed", "waitlisted"].includes(booking.status) && (
                            <button
                              onClick={() => handleCancel(booking._id)}
                              disabled={cancellingId === booking._id}
                              style={{ padding: "8px 14px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" }}
                            >
                              {cancellingId === booking._id ? "..." : "Cancel"}
                            </button>
                          )}
                          {canFeedback && (
                            <button
                              onClick={() => setFeedbackBooking(booking)}
                              style={{ padding: "8px 14px", borderRadius: "10px", background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.2)", color: "#38bdf8", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif", display: "flex", alignItems: "center", gap: "4px" }}
                            >
                              <RiStarLine size={12} /> Rate
                            </button>
                          )}
                          {feedbackedIds.has(booking._id) && (
                            <span style={{ fontSize: "11px", color: "#475569", textAlign: "center" }}>Rated</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
      <AnimatePresence>
        {feedbackBooking && <FeedbackModal booking={feedbackBooking} onClose={() => setFeedbackBooking(null)} onSuccess={fetchData} />}
      </AnimatePresence>
    </div>
  );
}
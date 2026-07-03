import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { RiTimeLine, RiCheckboxCircleLine, RiCloseCircleLine, RiAlertLine, RiQrCodeLine, RiStarLine, RiCloseLine } from "react-icons/ri";

const statusConfig = {
  confirmed: { label: "Confirmed", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: RiCheckboxCircleLine },
  waitlisted: { label: "Waitlisted", color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: RiTimeLine },
  cancelled: { label: "Cancelled", color: "#dc2626", bg: "#fef2f2", border: "#fecaca", icon: RiCloseCircleLine },
  completed: { label: "Completed", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", icon: RiCheckboxCircleLine },
  "no-show": { label: "No-show", color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", icon: RiAlertLine },
};

function FeedbackModal({ booking, onClose, onSuccess }) {
  const [ratings, setRatings] = useState({ taste: 0, hygiene: 0, quantity: 0, service: 0 });
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

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
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: "400px", background: "white", borderRadius: "24px", padding: "32px", boxShadow: "0 40px 80px rgba(0,0,0,0.25)", border: "1px solid #fed7aa" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#1c1917" }}>Rate Your Meal</h3>
            <p style={{ fontSize: "13px", color: "#a8a29e", textTransform: "capitalize" }}>{booking.slot?.mealType} · {booking.slot?.date}</p>
          </div>
          <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fff7ed", border: "1px solid #fed7aa", color: "#78716c", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <RiCloseLine size={16} />
          </button>
        </div>
        {["taste", "hygiene", "quantity", "service"].map((cat) => (
          <div key={cat} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ fontSize: "14px", color: "#57534e", fontWeight: "600", textTransform: "capitalize" }}>{cat}</span>
            <div style={{ display: "flex", gap: "4px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRatings((r) => ({ ...r, [cat]: s }))}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "22px", color: s <= ratings[cat] ? "#f97316" : "#e7e5e4", transition: "all 0.15s", transform: s <= ratings[cat] ? "scale(1.15)" : "scale(1)" }}>★</button>
              ))}
            </div>
          </div>
        ))}
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Any comments? (optional)" rows={3}
          style={{ width: "100%", background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: "12px", padding: "12px 14px", fontSize: "13px", color: "#1c1917", outline: "none", resize: "none", marginBottom: "20px", fontFamily: "Inter, system-ui, sans-serif" }} />
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: "12px", background: "#fafaf9", border: "1px solid #e7e5e4", color: "#78716c", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: "12px", borderRadius: "12px", background: "linear-gradient(135deg, #ea580c, #f97316)", border: "none", color: "white", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter, system-ui, sans-serif", boxShadow: "0 4px 16px rgba(234,88,12,0.35)" }}>
            {loading ? "Submitting..." : "Submit Feedback"}
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
      const [b, f] = await Promise.all([api.get("/bookings/my"), api.get("/feedback/my")]);
      setBookings(b.data);
      setFeedbacks(f.data);
    } catch { toast.error("Failed to load"); }
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
      toast.error(err.response?.data?.message || "Failed");
    } finally { setCancellingId(null); }
  };

  const feedbackedIds = new Set(feedbacks.map((f) => f.booking));

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "36px", height: "36px", border: "3px solid #fed7aa", borderTop: "3px solid #f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#fff7ed", paddingTop: "80px", paddingBottom: "48px" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 20px" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#1c1917", marginBottom: "4px", letterSpacing: "-0.5px" }}>My Bookings</h1>
            <p style={{ fontSize: "14px", color: "#a8a29e" }}>{bookings.length} total bookings</p>
          </div>

          {bookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>📋</div>
              <div style={{ fontSize: "15px", color: "#78716c", fontWeight: "600" }}>No bookings yet</div>
              <div style={{ fontSize: "13px", color: "#a8a29e", marginTop: "4px" }}>Book your first mess slot</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <AnimatePresence>
                {bookings.map((booking, i) => {
                  const cfg = statusConfig[booking.status] || statusConfig.confirmed;
                  const StatusIcon = cfg.icon;
                  const canFeedback = booking.status === "completed" && !feedbackedIds.has(booking._id);
                  return (
                    <motion.div key={booking._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.04 }}
                      style={{ background: "white", border: `1px solid ${cfg.border}`, borderRadius: "18px", padding: "20px", boxShadow: "0 2px 12px rgba(234,88,12,0.06)" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "16px", fontWeight: "700", color: "#1c1917", textTransform: "capitalize" }}>{booking.slot?.mealType}</span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", padding: "3px 10px", borderRadius: "999px", background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontWeight: "600" }}>
                              <StatusIcon size={10} /> {cfg.label}
                            </span>
                            {booking.status === "waitlisted" && <span style={{ fontSize: "12px", color: "#d97706", fontWeight: "700" }}>#{booking.queuePosition}</span>}
                          </div>
                          <div style={{ fontSize: "13px", color: "#a8a29e", display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span>{booking.slot?.date} · {booking.slot?.timeRange}</span>
                            {booking.tokenNumber && (
                              <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "#ea580c", fontFamily: "monospace", fontWeight: "700", marginTop: "2px" }}>
                                <RiQrCodeLine size={13} /> {booking.tokenNumber}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginLeft: "14px" }}>
                          {["confirmed", "waitlisted"].includes(booking.status) && (
                            <button onClick={() => handleCancel(booking._id)} disabled={cancellingId === booking._id}
                              style={{ padding: "8px 14px", borderRadius: "10px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" }}>
                              {cancellingId === booking._id ? "..." : "Cancel"}
                            </button>
                          )}
                          {canFeedback && (
                            <button onClick={() => setFeedbackBooking(booking)}
                              style={{ padding: "8px 14px", borderRadius: "10px", background: "#fff7ed", border: "1px solid #fed7aa", color: "#ea580c", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif", display: "flex", alignItems: "center", gap: "4px" }}>
                              <RiStarLine size={12} /> Rate
                            </button>
                          )}
                          {feedbackedIds.has(booking._id) && <span style={{ fontSize: "11px", color: "#a8a29e", textAlign: "center" }}>Rated</span>}
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
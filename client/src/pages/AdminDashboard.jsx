import { useEffect, useState } from "react";
import { motion } from "motion/react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { RiAddLine, RiUserLine, RiCheckLine } from "react-icons/ri";

const tabs = ["bookings", "create slot", "feedback stats"];

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings");
  const [newSlot, setNewSlot] = useState({ mealType: "breakfast", date: new Date().toISOString().split("T")[0], timeRange: "7:00 AM - 9:00 AM", totalCapacity: 50, menu: "" });
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [b, s] = await Promise.all([api.get(`/bookings/admin/all?date=${selectedDate}`), api.get("/feedback/admin/stats")]);
      setBookings(b.data);
      setFeedbackStats(s.data);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [selectedDate]);

  const handleCheckin = async (bookingId) => {
    try { await api.put(`/bookings/${bookingId}/checkin`); toast.success("Checked in"); fetchData(); }
    catch { toast.error("Failed"); }
  };

  const handleCreateSlot = async () => {
    setCreating(true);
    try { await api.post("/slots", newSlot); toast.success("Slot created"); fetchData(); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setCreating(false); }
  };

  const inputStyle = { width: "100%", background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: "12px", padding: "12px 14px", fontSize: "14px", color: "#1c1917", outline: "none", fontFamily: "Inter, system-ui, sans-serif" };
  const labelStyle = { display: "block", fontSize: "12px", fontWeight: "600", color: "#78716c", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" };

  return (
    <div style={{ minHeight: "100vh", background: "#fff7ed", paddingTop: "80px", paddingBottom: "48px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 20px" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#1c1917", marginBottom: "4px", letterSpacing: "-0.5px" }}>Admin Panel</h1>
            <p style={{ fontSize: "14px", color: "#a8a29e" }}>Manage slots and bookings</p>
          </div>

          <div style={{ display: "flex", gap: "6px", background: "white", border: "1px solid #fed7aa", borderRadius: "16px", padding: "6px", marginBottom: "24px", boxShadow: "0 2px 12px rgba(234,88,12,0.06)" }}>
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ flex: 1, padding: "10px 12px", borderRadius: "12px", fontSize: "13px", fontWeight: "600", textTransform: "capitalize", cursor: "pointer", border: "none", fontFamily: "Inter, system-ui, sans-serif", transition: "all 0.2s", background: activeTab === tab ? "linear-gradient(135deg, #ea580c, #f97316)" : "transparent", color: activeTab === tab ? "white" : "#a8a29e", boxShadow: activeTab === tab ? "0 4px 12px rgba(234,88,12,0.35)" : "none" }}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "bookings" && (
            <div>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ ...inputStyle, marginBottom: "16px" }} />
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                  <div style={{ width: "32px", height: "32px", border: "3px solid #fed7aa", borderTop: "3px solid #f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: "13px", color: "#a8a29e", marginBottom: "12px", fontWeight: "500" }}>{bookings.length} bookings for {selectedDate}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {bookings.map((b) => (
                      <motion.div key={b._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ background: "white", border: "1px solid #fed7aa", borderRadius: "16px", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(234,88,12,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #ea580c, #f97316)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "15px" }}>
                            {b.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: "14px", fontWeight: "700", color: "#1c1917", marginBottom: "2px" }}>{b.user?.name}</div>
                            <div style={{ fontSize: "12px", color: "#a8a29e" }}>Room {b.user?.roomNumber} · <span style={{ textTransform: "capitalize" }}>{b.slot?.mealType}</span> · #{b.tokenNumber}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "999px", fontWeight: "600", background: b.status === "confirmed" ? "#f0fdf4" : b.status === "completed" ? "#eff6ff" : b.status === "waitlisted" ? "#fffbeb" : "#fef2f2", color: b.status === "confirmed" ? "#16a34a" : b.status === "completed" ? "#2563eb" : b.status === "waitlisted" ? "#d97706" : "#dc2626", border: `1px solid ${b.status === "confirmed" ? "#bbf7d0" : b.status === "completed" ? "#bfdbfe" : b.status === "waitlisted" ? "#fde68a" : "#fecaca"}` }}>
                            {b.status}
                          </span>
                          {b.status === "confirmed" && !b.checkedIn && (
                            <button onClick={() => handleCheckin(b._id)}
                              style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                              <RiCheckLine size={16} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "create slot" && (
            <div style={{ background: "white", border: "1px solid #fed7aa", borderRadius: "20px", padding: "28px", boxShadow: "0 4px 16px rgba(234,88,12,0.08)" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#1c1917", marginBottom: "22px" }}>Create New Slot</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={labelStyle}>Meal Type</label>
                  <select value={newSlot.mealType} onChange={(e) => setNewSlot({ ...newSlot, mealType: e.target.value })} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input type="date" value={newSlot.date} onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Time Range</label>
                  <input type="text" value={newSlot.timeRange} onChange={(e) => setNewSlot({ ...newSlot, timeRange: e.target.value })} placeholder="7:00 AM - 9:00 AM" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Capacity</label>
                  <input type="number" value={newSlot.totalCapacity} onChange={(e) => setNewSlot({ ...newSlot, totalCapacity: Number(e.target.value) })} style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: "22px" }}>
                <label style={labelStyle}>Menu</label>
                <input type="text" value={newSlot.menu} onChange={(e) => setNewSlot({ ...newSlot, menu: e.target.value })} placeholder="e.g. Rice, Dal, Sabzi, Roti" style={inputStyle} />
              </div>
              <button onClick={handleCreateSlot} disabled={creating}
                style={{ width: "100%", padding: "14px", borderRadius: "12px", background: creating ? "#e7e5e4" : "linear-gradient(135deg, #ea580c, #f97316)", color: creating ? "#a8a29e" : "white", fontWeight: "700", fontSize: "15px", border: "none", cursor: creating ? "not-allowed" : "pointer", fontFamily: "Inter, system-ui, sans-serif", boxShadow: creating ? "none" : "0 8px 24px rgba(234,88,12,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <RiAddLine size={18} /> {creating ? "Creating..." : "Create Slot"}
              </button>
            </div>
          )}

          {activeTab === "feedback stats" && feedbackStats && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                {Object.entries(feedbackStats.averages).map(([key, val]) => (
                  <div key={key} style={{ background: "white", border: "1px solid #fed7aa", borderRadius: "18px", padding: "20px", textAlign: "center", boxShadow: "0 2px 12px rgba(234,88,12,0.06)" }}>
                    <div style={{ fontSize: "32px", fontWeight: "800", color: "#ea580c", marginBottom: "4px" }}>{val}</div>
                    <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginBottom: "6px" }}>
                      {[1, 2, 3, 4, 5].map((s) => <span key={s} style={{ fontSize: "14px", color: s <= val ? "#f97316" : "#e7e5e4" }}>★</span>)}
                    </div>
                    <div style={{ fontSize: "13px", color: "#a8a29e", textTransform: "capitalize", fontWeight: "600" }}>{key}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "white", border: "1px solid #fed7aa", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 12px rgba(234,88,12,0.06)" }}>
                <div style={{ fontSize: "13px", color: "#78716c", fontWeight: "700", marginBottom: "16px" }}>Recent Feedback ({feedbackStats.totalFeedbacks} total)</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {feedbackStats.recent?.slice(0, 5).map((fb) => (
                    <div key={fb._id} style={{ background: "#fff7ed", borderRadius: "12px", padding: "14px 16px", border: "1px solid #fed7aa" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: fb.comment ? "8px" : "0" }}>
                        <span style={{ fontSize: "13px", color: "#78716c", fontWeight: "600", textTransform: "capitalize" }}>{fb.mealType} · {fb.date}</span>
                        <div style={{ display: "flex", gap: "3px" }}>
                          {Object.values(fb.ratings).map((r, i) => (
                            <div key={i} style={{ width: "5px", height: "20px", borderRadius: "3px", background: `rgba(234,88,12,${r / 5 * 0.8 + 0.1})` }} />
                          ))}
                        </div>
                      </div>
                      {fb.comment && <p style={{ fontSize: "12px", color: "#a8a29e", fontStyle: "italic" }}>"{fb.comment}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
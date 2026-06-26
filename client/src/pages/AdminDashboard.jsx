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
      const [bookingsRes, statsRes] = await Promise.all([
        api.get(`/bookings/admin/all?date=${selectedDate}`),
        api.get("/feedback/admin/stats"),
      ]);
      setBookings(bookingsRes.data);
      setFeedbackStats(statsRes.data);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [selectedDate]);

  const handleCheckin = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/checkin`);
      toast.success("Checked in");
      fetchData();
    } catch { toast.error("Failed"); }
  };

  const handleCreateSlot = async () => {
    setCreating(true);
    try {
      await api.post("/slots", newSlot);
      toast.success("Slot created");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setCreating(false); }
  };

  const inputStyle = { width: "100%", background: "rgba(15,23,42,0.6)", border: "1px solid rgba(148,163,184,0.15)", borderRadius: "12px", padding: "12px 14px", fontSize: "14px", color: "#e2e8f0", outline: "none", fontFamily: "Inter, system-ui, sans-serif" };
  const labelStyle = { display: "block", fontSize: "12px", fontWeight: "500", color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", paddingTop: "80px", paddingBottom: "48px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 20px" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "white", marginBottom: "6px", letterSpacing: "-0.5px" }}>Admin Panel</h1>
            <p style={{ fontSize: "14px", color: "#64748b" }}>Manage slots and bookings</p>
          </div>

          <div style={{ display: "flex", gap: "6px", background: "rgba(30,41,59,0.6)", border: "1px solid rgba(148,163,184,0.1)", borderRadius: "16px", padding: "6px", marginBottom: "24px" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ flex: 1, padding: "10px 12px", borderRadius: "12px", fontSize: "13px", fontWeight: "600", textTransform: "capitalize", cursor: "pointer", border: "none", fontFamily: "Inter, system-ui, sans-serif", transition: "all 0.2s", background: activeTab === tab ? "linear-gradient(135deg, #0284c7, #0ea5e9)" : "transparent", color: activeTab === tab ? "white" : "#64748b", boxShadow: activeTab === tab ? "0 4px 12px rgba(14,165,233,0.3)" : "none" }}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "bookings" && (
            <div>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                style={{ ...inputStyle, marginBottom: "20px" }} />
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                  <div style={{ width: "32px", height: "32px", border: "3px solid rgba(14,165,233,0.2)", borderTop: "3px solid #0ea5e9", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: "13px", color: "#475569", marginBottom: "12px" }}>{bookings.length} bookings for {selectedDate}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {bookings.map((b) => (
                      <motion.div key={b._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(148,163,184,0.1)", borderRadius: "16px", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: "rgba(51,65,85,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <RiUserLine size={16} color="#64748b" />
                          </div>
                          <div>
                            <div style={{ fontSize: "14px", fontWeight: "600", color: "#e2e8f0", marginBottom: "2px" }}>{b.user?.name}</div>
                            <div style={{ fontSize: "12px", color: "#475569" }}>Room {b.user?.roomNumber} · <span style={{ textTransform: "capitalize" }}>{b.slot?.mealType}</span> · #{b.tokenNumber}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "999px", fontWeight: "600", background: b.status === "confirmed" ? "rgba(34,197,94,0.1)" : b.status === "completed" ? "rgba(56,189,248,0.1)" : b.status === "waitlisted" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)", color: b.status === "confirmed" ? "#22c55e" : b.status === "completed" ? "#38bdf8" : b.status === "waitlisted" ? "#f59e0b" : "#ef4444" }}>
                            {b.status}
                          </span>
                          {b.status === "confirmed" && !b.checkedIn && (
                            <button onClick={() => handleCheckin(b._id)}
                              style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
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
            <div style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(148,163,184,0.1)", borderRadius: "20px", padding: "28px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "white", marginBottom: "24px" }}>Create New Slot</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
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
              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>Menu</label>
                <input type="text" value={newSlot.menu} onChange={(e) => setNewSlot({ ...newSlot, menu: e.target.value })} placeholder="e.g. Rice, Dal, Sabzi, Roti" style={inputStyle} />
              </div>
              <button onClick={handleCreateSlot} disabled={creating}
                style={{ width: "100%", padding: "14px", borderRadius: "12px", background: creating ? "#334155" : "linear-gradient(135deg, #0284c7, #0ea5e9)", color: "white", fontWeight: "600", fontSize: "15px", border: "none", cursor: creating ? "not-allowed" : "pointer", fontFamily: "Inter, system-ui, sans-serif", boxShadow: creating ? "none" : "0 8px 24px rgba(14,165,233,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <RiAddLine size={18} /> {creating ? "Creating..." : "Create Slot"}
              </button>
            </div>
          )}

          {activeTab === "feedback stats" && feedbackStats && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                {Object.entries(feedbackStats.averages).map(([key, val]) => (
                  <div key={key} style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(148,163,184,0.1)", borderRadius: "18px", padding: "20px", textAlign: "center" }}>
                    <div style={{ fontSize: "32px", fontWeight: "800", color: "#38bdf8", marginBottom: "4px" }}>{val}</div>
                    <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginBottom: "6px" }}>
                      {[1, 2, 3, 4, 5].map((s) => <span key={s} style={{ fontSize: "12px", color: s <= val ? "#f59e0b" : "#1e293b" }}>★</span>)}
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b", textTransform: "capitalize" }}>{key}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(148,163,184,0.1)", borderRadius: "20px", padding: "24px" }}>
                <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", marginBottom: "16px" }}>Recent Feedback ({feedbackStats.totalFeedbacks} total)</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {feedbackStats.recent?.slice(0, 5).map((fb) => (
                    <div key={fb._id} style={{ background: "rgba(15,23,42,0.5)", borderRadius: "12px", padding: "14px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: fb.comment ? "8px" : "0" }}>
                        <span style={{ fontSize: "13px", color: "#94a3b8", textTransform: "capitalize" }}>{fb.mealType} · {fb.date}</span>
                        <div style={{ display: "flex", gap: "3px" }}>
                          {Object.values(fb.ratings).map((r, i) => (
                            <div key={i} style={{ width: "5px", height: "18px", borderRadius: "3px", background: `rgba(14,165,233,${r / 5 * 0.8 + 0.1})` }} />
                          ))}
                        </div>
                      </div>
                      {fb.comment && <p style={{ fontSize: "12px", color: "#475569", fontStyle: "italic" }}>"{fb.comment}"</p>}
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
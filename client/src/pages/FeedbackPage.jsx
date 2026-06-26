import { useEffect, useState } from "react";
import { motion } from "motion/react";
import api from "../api/axios";

const categories = ["taste", "hygiene", "quantity", "service"];

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/feedback/my").then((r) => setFeedbacks(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const avg = (arr, key) => {
    if (!arr.length) return 0;
    return (arr.reduce((s, f) => s + f.ratings[key], 0) / arr.length).toFixed(1);
  };

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
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "white", marginBottom: "6px", letterSpacing: "-0.5px" }}>My Feedback</h1>
            <p style={{ fontSize: "14px", color: "#64748b" }}>{feedbacks.length} reviews submitted</p>
          </div>

          {feedbacks.length > 0 && (
            <div style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(148,163,184,0.1)", borderRadius: "20px", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "white", marginBottom: "16px" }}>Your Average Ratings</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {categories.map((cat) => (
                  <div key={cat} style={{ background: "rgba(15,23,42,0.5)", borderRadius: "14px", padding: "16px", textAlign: "center" }}>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "#38bdf8", marginBottom: "4px" }}>{avg(feedbacks, cat)}</div>
                    <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginBottom: "6px" }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} style={{ fontSize: "11px", color: s <= avg(feedbacks, cat) ? "#f59e0b" : "#1e293b" }}>★</span>
                      ))}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748b", textTransform: "capitalize" }}>{cat}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {feedbacks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: "15px", color: "#475569" }}>No feedback submitted yet</div>
              <div style={{ fontSize: "13px", color: "#334155", marginTop: "6px" }}>Complete a booking to rate your meal</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {feedbacks.map((fb, i) => {
                const avgRating = Object.values(fb.ratings).reduce((a, b) => a + b, 0) / 4;
                return (
                  <motion.div
                    key={fb._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(148,163,184,0.1)", borderRadius: "18px", padding: "20px" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                      <div>
                        <span style={{ fontSize: "15px", fontWeight: "700", color: "white", textTransform: "capitalize" }}>{fb.mealType}</span>
                        <span style={{ fontSize: "12px", color: "#64748b", marginLeft: "10px" }}>{fb.date}</span>
                      </div>
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} style={{ fontSize: "14px", color: s <= avgRating ? "#f59e0b" : "#1e293b" }}>★</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: fb.comment ? "14px" : "0" }}>
                      {categories.map((cat) => (
                        <div key={cat} style={{ background: "rgba(15,23,42,0.5)", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                          <div style={{ fontSize: "16px", fontWeight: "700", color: "#e2e8f0" }}>{fb.ratings[cat]}</div>
                          <div style={{ fontSize: "10px", color: "#475569", textTransform: "capitalize", marginTop: "2px" }}>{cat}</div>
                        </div>
                      ))}
                    </div>
                    {fb.comment && (
                      <div style={{ background: "rgba(15,23,42,0.4)", borderRadius: "10px", padding: "10px 14px" }}>
                        <p style={{ fontSize: "13px", color: "#94a3b8", fontStyle: "italic" }}>"{fb.comment}"</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
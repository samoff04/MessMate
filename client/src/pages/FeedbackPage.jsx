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

  const avg = (arr, key) => !arr.length ? 0 : (arr.reduce((s, f) => s + f.ratings[key], 0) / arr.length).toFixed(1);

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
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#1c1917", marginBottom: "4px", letterSpacing: "-0.5px" }}>My Feedback</h1>
            <p style={{ fontSize: "14px", color: "#a8a29e" }}>{feedbacks.length} reviews submitted</p>
          </div>

          {feedbacks.length > 0 && (
            <div style={{ background: "white", border: "1px solid #fed7aa", borderRadius: "20px", padding: "22px", marginBottom: "20px", boxShadow: "0 4px 16px rgba(234,88,12,0.08)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1c1917", marginBottom: "16px" }}>Your Average Ratings</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {categories.map((cat) => (
                  <div key={cat} style={{ background: "#fff7ed", borderRadius: "14px", padding: "16px", textAlign: "center", border: "1px solid #fed7aa" }}>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "#ea580c", marginBottom: "4px" }}>{avg(feedbacks, cat)}</div>
                    <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginBottom: "6px" }}>
                      {[1, 2, 3, 4, 5].map((s) => <span key={s} style={{ fontSize: "12px", color: s <= avg(feedbacks, cat) ? "#f97316" : "#e7e5e4" }}>★</span>)}
                    </div>
                    <div style={{ fontSize: "12px", color: "#a8a29e", textTransform: "capitalize", fontWeight: "600" }}>{cat}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {feedbacks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>⭐</div>
              <div style={{ fontSize: "15px", color: "#78716c", fontWeight: "600" }}>No feedback yet</div>
              <div style={{ fontSize: "13px", color: "#a8a29e", marginTop: "4px" }}>Complete a booking to rate your meal</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {feedbacks.map((fb, i) => {
                const avgRating = Object.values(fb.ratings).reduce((a, b) => a + b, 0) / 4;
                return (
                  <motion.div key={fb._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    style={{ background: "white", border: "1px solid #fed7aa", borderRadius: "18px", padding: "20px", boxShadow: "0 2px 12px rgba(234,88,12,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                      <div>
                        <span style={{ fontSize: "15px", fontWeight: "700", color: "#1c1917", textTransform: "capitalize" }}>{fb.mealType}</span>
                        <span style={{ fontSize: "12px", color: "#a8a29e", marginLeft: "10px" }}>{fb.date}</span>
                      </div>
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[1, 2, 3, 4, 5].map((s) => <span key={s} style={{ fontSize: "16px", color: s <= avgRating ? "#f97316" : "#e7e5e4" }}>★</span>)}
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: fb.comment ? "14px" : "0" }}>
                      {categories.map((cat) => (
                        <div key={cat} style={{ background: "#fff7ed", borderRadius: "10px", padding: "10px", textAlign: "center", border: "1px solid #fed7aa" }}>
                          <div style={{ fontSize: "16px", fontWeight: "700", color: "#ea580c" }}>{fb.ratings[cat]}</div>
                          <div style={{ fontSize: "10px", color: "#a8a29e", textTransform: "capitalize", marginTop: "2px" }}>{cat}</div>
                        </div>
                      ))}
                    </div>
                    {fb.comment && (
                      <div style={{ background: "#fff7ed", borderRadius: "10px", padding: "10px 14px", border: "1px solid #fed7aa" }}>
                        <p style={{ fontSize: "13px", color: "#78716c", fontStyle: "italic" }}>"{fb.comment}"</p>
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
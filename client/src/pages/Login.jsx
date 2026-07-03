import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiCheckLine } from "react-icons/ri";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
      toast.success(`Welcome back, ${data.name}`);
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", display: "flex", position: "relative", overflow: "hidden", backgroundColor: "#7c2d12" }}>

      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('/campus.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        opacity: 0.35,
      }} />

      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(120deg, rgba(124,45,18,0.92) 0%, rgba(154,52,18,0.75) 40%, rgba(30,10,5,0.88) 100%)",
      }} />

      <div style={{ position: "relative", zIndex: 10, display: "flex", width: "100%", minHeight: "100vh" }}>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 64px" }}
        >
          <div style={{ maxWidth: "520px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "56px" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "15px", background: "linear-gradient(135deg, #f97316, #fb923c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "800", color: "white", boxShadow: "0 8px 24px rgba(249,115,22,0.5)" }}>M</div>
              <span style={{ fontSize: "26px", fontWeight: "800", color: "white", letterSpacing: "-0.5px" }}>MessMate</span>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#fb923c", textTransform: "uppercase", letterSpacing: "2px" }}>Hostel Mess Management</span>
            </div>
            <h1 style={{ fontSize: "52px", fontWeight: "900", color: "white", lineHeight: "1.1", marginBottom: "22px", letterSpacing: "-2px" }}>
              Your Hostel<br />
              Mess,{" "}
              <span style={{ color: "#fb923c" }}>Reimagined.</span>
            </h1>
            <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.65)", lineHeight: "1.75", marginBottom: "48px", maxWidth: "420px" }}>
              Book your meal slot in advance, skip the queue, track crowd density and never miss a meal again.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { text: "Real-time seat availability across all meal slots" },
                { text: "Auto-promoted from waitlist when slots free up" },
                { text: "7-day crowd heatmap to plan your meals" },
                { text: "Post-meal ratings and mess quality analytics" },
              ].map(({ text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: "rgba(249,115,22,0.3)", border: "1px solid rgba(249,115,22,0.5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <RiCheckLine size={12} color="#fb923c" />
                  </div>
                  <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", fontWeight: "500" }}>{text}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "56px", paddingTop: "32px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.3px" }}>
                Hostel Mess Management System
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ width: "480px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px" }}
        >
          <div style={{ width: "100%" }}>
            <div style={{
              background: "white",
              borderRadius: "28px",
              padding: "48px 44px",
              boxShadow: "0 40px 120px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)",
            }}>
              <div style={{ marginBottom: "36px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "13px", background: "linear-gradient(135deg, #ea580c, #f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "19px", fontWeight: "800", color: "white", boxShadow: "0 4px 14px rgba(234,88,12,0.4)" }}>M</div>
                  <div>
                    <div style={{ fontSize: "19px", fontWeight: "800", color: "#1c1917", letterSpacing: "-0.4px" }}>Welcome back</div>
                    <div style={{ fontSize: "13px", color: "#a8a29e", marginTop: "1px" }}>Sign in to your MessMate account</div>
                  </div>
                </div>
                <div style={{ height: "1px", background: "linear-gradient(to right, #fed7aa, transparent)" }} />
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#78716c", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.8px" }}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <RiMailLine style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#d6d3d1", pointerEvents: "none" }} size={16} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      style={{ width: "100%", background: "#fafaf9", border: "1.5px solid #e7e5e4", borderRadius: "13px", padding: "14px 14px 14px 44px", fontSize: "14px", color: "#1c1917", outline: "none", fontFamily: "Inter, system-ui, sans-serif", transition: "all 0.2s", boxSizing: "border-box" }}
                      onFocus={(e) => { e.target.style.borderColor = "#f97316"; e.target.style.background = "#fffbf8"; e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.12)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "#e7e5e4"; e.target.style.background = "#fafaf9"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "32px" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#78716c", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.8px" }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <RiLockLine style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#d6d3d1", pointerEvents: "none" }} size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      style={{ width: "100%", background: "#fafaf9", border: "1.5px solid #e7e5e4", borderRadius: "13px", padding: "14px 44px 14px 44px", fontSize: "14px", color: "#1c1917", outline: "none", fontFamily: "Inter, system-ui, sans-serif", transition: "all 0.2s", boxSizing: "border-box" }}
                      onFocus={(e) => { e.target.style.borderColor = "#f97316"; e.target.style.background = "#fffbf8"; e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.12)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "#e7e5e4"; e.target.style.background = "#fafaf9"; e.target.style.boxShadow = "none"; }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#d6d3d1", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      {showPassword ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.015, boxShadow: "0 12px 32px rgba(234,88,12,0.5)" }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={loading}
                  style={{ width: "100%", padding: "15px", borderRadius: "13px", background: loading ? "#e7e5e4" : "linear-gradient(135deg, #c2410c, #ea580c, #f97316)", color: loading ? "#a8a29e" : "white", fontWeight: "700", fontSize: "15px", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter, system-ui, sans-serif", boxShadow: loading ? "none" : "0 8px 24px rgba(234,88,12,0.4)", transition: "all 0.2s", letterSpacing: "0.2px" }}>
                  {loading ? "Signing in..." : "Sign In to MessMate"}
                </motion.button>
              </form>

              <div style={{ marginTop: "28px", paddingTop: "28px", borderTop: "1px solid #f5f5f4", textAlign: "center" }}>
                <p style={{ fontSize: "14px", color: "#a8a29e" }}>
                  Don't have an account?{" "}
                  <Link to="/register" style={{ color: "#ea580c", fontWeight: "700", textDecoration: "none" }}>Create Account</Link>
                </p>
              </div>
            </div>

            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.3px" }}>
              MessMate · Secure · Fast · Reliable
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
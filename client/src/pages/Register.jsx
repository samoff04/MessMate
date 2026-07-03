import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import { RiUserLine, RiMailLine, RiLockLine, RiHomeLine, RiShieldLine } from "react-icons/ri";

const inputStyle = {
  width: "100%", background: "#fafaf9", border: "1.5px solid #e7e5e4",
  borderRadius: "12px", padding: "13px 14px 13px 42px", fontSize: "14px",
  color: "#1c1917", outline: "none", fontFamily: "Inter, system-ui, sans-serif", transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block", fontSize: "12px", fontWeight: "600", color: "#57534e",
  marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.6px",
};

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", roomNumber: "", role: "student" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      login(data);
      toast.success("Account created");
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "name", icon: RiUserLine, placeholder: "Enter your name", label: "Full Name", type: "text" },
    { key: "email", icon: RiMailLine, placeholder: "you@example.com", label: "Email Address", type: "email" },
    { key: "password", icon: RiLockLine, placeholder: "Min 6 characters", label: "Password", type: "password" },
    { key: "roomNumber", icon: RiHomeLine, placeholder: "e.g. A-204", label: "Room Number", type: "text" },
  ];

  return (
    <div style={{ minHeight: "100vh", width: "100%", display: "flex", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/campus.png')", backgroundSize: "cover", backgroundPosition: "center", filter: "blur(3px) brightness(0.4)", transform: "scale(1.05)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(234,88,12,0.85) 0%, rgba(15,15,15,0.75) 100%)" }} />

      <div style={{ position: "relative", zIndex: 10, display: "flex", width: "100%", minHeight: "100vh", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: "100%", maxWidth: "460px" }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 180 }}
              style={{ width: "68px", height: "68px", borderRadius: "20px", background: "linear-gradient(135deg, #f97316, #fb923c)", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", fontWeight: "800", color: "white", boxShadow: "0 16px 40px rgba(249,115,22,0.45)" }}
            >
              M
            </motion.div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "white", letterSpacing: "-0.5px", marginBottom: "4px" }}>Join MessMate</h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Create your MessMate account</p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: "28px", padding: "40px", boxShadow: "0 40px 80px rgba(0,0,0,0.4)" }}>
            <form onSubmit={handleSubmit}>
              {fields.map(({ key, icon: Icon, placeholder, label, type }) => (
                <div key={key} style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>{label}</label>
                  <div style={{ position: "relative" }}>
                    <Icon style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#a8a29e", pointerEvents: "none" }} size={16} />
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                      required
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#f97316")}
                      onBlur={(e) => (e.target.style.borderColor = "#e7e5e4")}
                    />
                  </div>
                </div>
              ))}

              <div style={{ marginBottom: "28px" }}>
                <label style={labelStyle}>Account Type</label>
                <div style={{ position: "relative" }}>
                  <RiShieldLine style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#a8a29e", pointerEvents: "none" }} size={16} />
                  <select
                    value={form.role}
                    onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                    style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                    onFocus={(e) => (e.target.style.borderColor = "#f97316")}
                    onBlur={(e) => (e.target.style.borderColor = "#e7e5e4")}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: "14px", borderRadius: "12px", background: loading ? "#d6d3d1" : "linear-gradient(135deg, #ea580c, #f97316)", color: "white", fontWeight: "700", fontSize: "15px", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter, system-ui, sans-serif", boxShadow: loading ? "none" : "0 8px 24px rgba(234,88,12,0.4)", transition: "all 0.2s" }}>
                {loading ? "Creating account..." : "Create Account"}
              </motion.button>
            </form>

            <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #f5f5f4", textAlign: "center" }}>
              <p style={{ fontSize: "14px", color: "#78716c" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#ea580c", fontWeight: "700", textDecoration: "none" }}>Sign in</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
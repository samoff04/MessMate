import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import { RiUserLine, RiMailLine, RiLockLine, RiHomeLine, RiShieldLine } from "react-icons/ri";

const inputStyle = {
  width: "100%",
  background: "rgba(15,23,42,0.6)",
  border: "1px solid rgba(148,163,184,0.15)",
  borderRadius: "12px",
  padding: "13px 14px 13px 42px",
  fontSize: "14px",
  color: "#e2e8f0",
  outline: "none",
  transition: "border-color 0.2s",
  fontFamily: "Inter, system-ui, sans-serif",
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: "500",
  color: "#94a3b8",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    roomNumber: "",
    role: "student",
  });
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
    { key: "name", icon: RiUserLine, placeholder: "John Doe", label: "Full Name", type: "text" },
    { key: "email", icon: RiMailLine, placeholder: "you@example.com", label: "Email Address", type: "email" },
    { key: "password", icon: RiLockLine, placeholder: "Min 6 characters", label: "Password", type: "password" },
    { key: "roomNumber", icon: RiHomeLine, placeholder: "e.g. A-204", label: "Room Number", type: "text" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backgroundColor: "#0f172a",
      }}
    >
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute", top: "-15%", right: "-10%",
            width: "500px", height: "500px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: "-15%", left: "-10%",
            width: "400px", height: "400px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: "420px", position: "relative" }}
      >
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 180 }}
            style={{
              width: "76px", height: "76px", borderRadius: "22px",
              background: "linear-gradient(135deg, #38bdf8, #f59e0b)",
              margin: "0 auto 18px", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "28px", fontWeight: "700",
              color: "white", boxShadow: "0 20px 40px rgba(14,165,233,0.25)",
            }}
          >
            M
          </motion.div>
          <h1
            style={{
              fontSize: "32px", fontWeight: "800", color: "white",
              letterSpacing: "-0.5px", marginBottom: "6px",
            }}
          >
            MessMate
          </h1>
          <p style={{ fontSize: "15px", color: "#94a3b8" }}>Create your hostel account</p>
        </div>

        <div
          style={{
            background: "rgba(30, 41, 59, 0.7)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(148, 163, 184, 0.12)",
            borderRadius: "24px",
            padding: "36px",
            boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "white", marginBottom: "28px" }}>
            Create Account
          </h2>

          <form onSubmit={handleSubmit}>
            {fields.map(({ key, icon: Icon, placeholder, label, type }) => (
              <div key={key} style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>{label}</label>
                <div style={{ position: "relative" }}>
                  <Icon
                    style={{
                      position: "absolute", left: "14px", top: "50%",
                      transform: "translateY(-50%)", color: "#475569", pointerEvents: "none",
                    }}
                    size={16}
                  />
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#0ea5e9")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(148,163,184,0.15)")}
                  />
                </div>
              </div>
            ))}

            <div style={{ marginBottom: "28px" }}>
              <label style={labelStyle}>Account Type</label>
              <div style={{ position: "relative" }}>
                <RiShieldLine
                  style={{
                    position: "absolute", left: "14px", top: "50%",
                    transform: "translateY(-50%)", color: "#475569", pointerEvents: "none",
                  }}
                  size={16}
                />
                <select
                  value={form.role}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  onFocus={(e) => (e.target.style.borderColor = "#0ea5e9")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(148,163,184,0.15)")}
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px", borderRadius: "12px",
                background: loading ? "#334155" : "linear-gradient(135deg, #0284c7, #0ea5e9)",
                color: "white", fontWeight: "600", fontSize: "15px", border: "none",
                cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s",
                boxShadow: loading ? "none" : "0 8px 24px rgba(14,165,233,0.35)",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </motion.button>
          </form>

          <div
            style={{
              marginTop: "24px", paddingTop: "24px",
              borderTop: "1px solid rgba(148,163,184,0.1)", textAlign: "center",
            }}
          >
            <p style={{ fontSize: "14px", color: "#64748b" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#38bdf8", fontWeight: "500", textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { RiHome4Line, RiHome4Fill, RiCalendarCheckLine, RiCalendarCheckFill, RiBookmarkLine, RiBookmarkFill, RiStarLine, RiStarFill, RiShieldLine, RiShieldFill, RiLogoutBoxLine } from "react-icons/ri";

const navItems = [
  { to: "/dashboard", icon: RiHome4Line, activeIcon: RiHome4Fill, label: "Home" },
  { to: "/book", icon: RiCalendarCheckLine, activeIcon: RiCalendarCheckFill, label: "Book" },
  { to: "/my-bookings", icon: RiBookmarkLine, activeIcon: RiBookmarkFill, label: "My Slots" },
  { to: "/feedback", icon: RiStarLine, activeIcon: RiStarFill, label: "Feedback" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid #fed7aa", boxShadow: "0 2px 20px rgba(234,88,12,0.08)" }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <Link to="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #ea580c, #f97316)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "16px", boxShadow: "0 4px 12px rgba(234,88,12,0.35)" }}>M</div>
          <span style={{ fontSize: "18px", fontWeight: "800", color: "#1c1917", letterSpacing: "-0.3px" }}>MessMate</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "2px", background: "#fff7ed", borderRadius: "16px", padding: "5px", border: "1px solid #fed7aa" }}>
          {navItems.map(({ to, icon: Icon, activeIcon: ActiveIcon, label }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "12px", fontSize: "13px", fontWeight: "600", transition: "all 0.2s", background: active ? "linear-gradient(135deg, #ea580c, #f97316)" : "transparent", color: active ? "white" : "#78716c", boxShadow: active ? "0 4px 12px rgba(234,88,12,0.35)" : "none" }}
                >
                  {active ? <ActiveIcon size={15} /> : <Icon size={15} />}
                  <span style={{ display: window.innerWidth < 640 ? "none" : "block" }}>{label}</span>
                </motion.div>
              </Link>
            );
          })}
          {user?.role === "admin" && (
            <Link to="/admin" style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "12px", fontSize: "13px", fontWeight: "600", transition: "all 0.2s", background: location.pathname === "/admin" ? "linear-gradient(135deg, #92400e, #b45309)" : "transparent", color: location.pathname === "/admin" ? "white" : "#78716c", boxShadow: location.pathname === "/admin" ? "0 4px 12px rgba(146,64,14,0.35)" : "none" }}
              >
                {location.pathname === "/admin" ? <RiShieldFill size={15} /> : <RiShieldLine size={15} />}
                <span style={{ display: window.innerWidth < 640 ? "none" : "block" }}>Admin</span>
              </motion.div>
            </Link>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#1c1917", lineHeight: "1.2" }}>{user?.name}</span>
            <span style={{ fontSize: "11px", color: "#a8a29e" }}>Room {user?.roomNumber}</span>
          </div>
          <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "linear-gradient(135deg, #ea580c, #f97316)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "14px" }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            style={{ width: "34px", height: "34px", borderRadius: "10px", background: "#fff1f0", border: "1px solid #fecaca", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <RiLogoutBoxLine size={16} />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
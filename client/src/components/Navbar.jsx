import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import {
  RiHome4Line,
  RiCalendarCheckLine,
  RiBookmarkLine,
  RiStarLine,
  RiShieldLine,
  RiLogoutBoxLine,
  RiHome4Fill,
  RiCalendarCheckFill,
  RiBookmarkFill,
  RiStarFill,
  RiShieldFill,
} from "react-icons/ri";

const navItems = [
  { to: "/dashboard", icon: RiHome4Line, activeIcon: RiHome4Fill, label: "Home" },
  { to: "/book", icon: RiCalendarCheckLine, activeIcon: RiCalendarCheckFill, label: "Book" },
  { to: "/my-bookings", icon: RiBookmarkLine, activeIcon: RiBookmarkFill, label: "My Slots" },
  { to: "/feedback", icon: RiStarLine, activeIcon: RiStarFill, label: "Feedback" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50"
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-amber-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-sky-500/20">
            M
          </div>
          <span className="font-bold text-lg text-white tracking-tight">MessMate</span>
        </Link>

        <div className="flex items-center gap-1 bg-slate-800/60 rounded-2xl px-2 py-1.5 border border-slate-700/50">
          {navItems.map(({ to, icon: Icon, activeIcon: ActiveIcon, label }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/60"
                  }`}
                >
                  {active ? <ActiveIcon size={16} /> : <Icon size={16} />}
                  <span className="hidden md:block">{label}</span>
                </motion.div>
              </Link>
            );
          })}
          {user?.role === "admin" && (
            <Link to="/admin">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === "/admin"
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                    : "text-slate-400 hover:text-amber-400 hover:bg-slate-700/60"
                }`}
              >
                {location.pathname === "/admin" ? <RiShieldFill size={16} /> : <RiShieldLine size={16} />}
                <span className="hidden md:block">Admin</span>
              </motion.div>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-100 leading-tight">{user?.name}</span>
            <span className="text-xs text-slate-500">Room {user?.roomNumber}</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <RiLogoutBoxLine size={17} />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
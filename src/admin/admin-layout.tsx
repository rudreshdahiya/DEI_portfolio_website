import { useState, type FormEvent } from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Settings,
  Home,
  User,
  Briefcase,
  HeartHandshake,
  Mail,
  LogOut,
  ChevronRight,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";

// ── Auth ───────────────────────────────────────────────────────────────────────

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin2024";
const SESSION_KEY = "admin_authed";

export function useAdminAuth() {
  const isAuthed = () => sessionStorage.getItem(SESSION_KEY) === "true";
  const login = (pw: string) => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      return true;
    }
    return false;
  };
  const logout = () => sessionStorage.removeItem(SESSION_KEY);
  return { isAuthed, login, logout };
}

// ── Login Page ─────────────────────────────────────────────────────────────────

export function AdminLogin() {
  const { login, isAuthed } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthed()) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const ok = login(password);
      if (!ok) {
        setError("Incorrect password. Please try again.");
        setPassword("");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1E1A24 0%, #3D1E3C 50%, #5C2A57 100%)" }}>
      <div className="w-full max-w-sm mx-4">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            Admin Panel
          </h1>
          <p className="text-white/60 text-sm mt-1">Pratik Aggarwal · DEI Portfolio</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-white/80 text-sm font-medium block mb-2" htmlFor="admin-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <p className="text-red-300 text-xs mt-2 flex items-center gap-1">
                  <span>⚠</span> {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #B84472, #5C2A57)", color: "white" }}
            >
              {loading ? "Verifying…" : "Enter Admin Panel"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          <Link to="/" className="hover:text-white/70 underline underline-offset-4 transition-colors">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

// ── Protected Route ────────────────────────────────────────────────────────────

export function AdminGuard() {
  const { isAuthed } = useAdminAuth();
  if (!isAuthed()) return <Navigate to="/admin" replace />;
  return <Outlet />;
}

// ── Admin Layout ───────────────────────────────────────────────────────────────

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/global", label: "Global Settings", icon: Settings },
  { href: "/admin/home", label: "Home Page", icon: Home },
  { href: "/admin/about", label: "About Page", icon: User },
  { href: "/admin/services", label: "Services Page", icon: Briefcase },
  { href: "/admin/work", label: "Work Page", icon: Briefcase },
  { href: "/admin/blooming-in-pain", label: "Blooming in Pain", icon: HeartHandshake },
  { href: "/admin/contact", label: "Contact Page", icon: Mail },
];

export function AdminLayout() {
  const { logout } = useAdminAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#F6F4F7" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col shrink-0 transition-all duration-300"
        style={{
          width: sidebarOpen ? 240 : 64,
          background: "#1E1A24",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs text-white"
            style={{ background: "linear-gradient(135deg, #B84472, #5C2A57)" }}
          >
            PA
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-white text-sm font-bold truncate" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                Admin Panel
              </p>
              <p className="text-white/40 text-xs truncate">Pratik Aggarwal</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {adminNavItems.map(({ href, label, icon: Icon }) => {
            const active = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                title={!sidebarOpen ? label : undefined}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
                style={{
                  background: active ? "rgba(184,68,114,0.2)" : "transparent",
                  color: active ? "#B84472" : "rgba(255,255,255,0.6)",
                }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium truncate">{label}</span>
                )}
                {sidebarOpen && active && (
                  <ChevronRight className="w-3 h-3 ml-auto shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-white/10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/70 transition-colors"
            title={!sidebarOpen ? "View Website" : undefined}
          >
            <Eye className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span className="text-xs">View Website</span>}
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-red-400 transition-colors"
            title={!sidebarOpen ? "Log out" : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span className="text-xs">Log out</span>}
          </button>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="w-full flex items-center justify-center py-2 text-white/20 hover:text-white/50 transition-colors"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronRight
              className="w-4 h-4 transition-transform duration-300"
              style={{ transform: sidebarOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

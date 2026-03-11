import { useState } from "react";

const NAV_LINKS = ["Home", "Login", "Register"];
const ROLES = [
  { id: "student", label: "Student Login", icon: "🎓" },
  { id: "company", label: "Company Login", icon: "🏢" },
  { id: "admin", label: "Admin Login", icon: "🛡️" },
];

export default function LoginPage() {
  const [activeRole, setActiveRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("Login");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      // Replace with your actual backend URL
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: activeRole }),
      });
      const data = await response.json();
      if (response.ok) {
        // Store token if needed: localStorage.setItem('token', data.token);
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background decoration */}
      <div style={styles.bgCircle1} />
      <div style={styles.bgCircle2} />

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          <div style={styles.navLogo}>🎯</div>
          <span style={styles.navTitle}>Campus Placement Portal</span>
        </div>
        <div style={styles.navLinks}>
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => setActiveNav(link)}
              style={{
                ...styles.navLink,
                ...(activeNav === link ? styles.navLinkActive : {}),
              }}
            >
              {link}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero + Card Layout */}
      <main style={styles.main}>
        {/* Left Hero Text */}
        <div style={styles.hero}>
          <div style={styles.heroBadge}>🚀 Placements 2025</div>
          <h1 style={styles.heroTitle}>
            Launch Your
            <span style={styles.heroAccent}> Career</span>
            <br />
            from Campus
          </h1>
          <p style={styles.heroSubtitle}>
            Connect with top recruiters, explore opportunities, and kickstart
            your professional journey — all in one place.
          </p>
          <div style={styles.statsRow}>
            {[["500+", "Companies"], ["12K+", "Students"], ["95%", "Placement Rate"]].map(
              ([num, label]) => (
                <div key={label} style={styles.statItem}>
                  <div style={styles.statNum}>{num}</div>
                  <div style={styles.statLabel}>{label}</div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Login Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Welcome Back</h2>
            <p style={styles.cardSubtitle}>Sign in to your account</p>
          </div>

          {/* Role Tabs */}
          <div style={styles.roleTabs}>
            {ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => { setActiveRole(role.id); setError(""); }}
                style={{
                  ...styles.roleTab,
                  ...(activeRole === role.id ? styles.roleTabActive : {}),
                }}
              >
                <span style={styles.roleIcon}>{role.icon}</span>
                <span style={styles.roleLabel}>
                  {role.label.replace(" Login", "")}
                </span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={styles.form}>
            {error && <div style={styles.errorBox}>⚠️ {error}</div>}

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>✉️</span>
                <input
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...styles.input, paddingRight: "44px" }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.loginBtn,
                ...(loading ? styles.loginBtnDisabled : {}),
              }}
            >
              {loading ? (
                <span style={styles.spinner}>⏳ Signing in...</span>
              ) : (
                `Sign In as ${ROLES.find((r) => r.id === activeRole)?.label.replace(" Login", "")}`
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div style={styles.cardFooter}>
            <a href="/forgot-password" style={styles.footerLink}>
              Forgot Password?
            </a>
            <span style={styles.divider}>|</span>
            <span style={styles.footerText}>
              New here?{" "}
              <a href="/register" style={styles.footerLinkBold}>
                Register Now
              </a>
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerNote}>
          © 2025 Campus Placement Portal · All rights reserved
        </p>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #eff6ff 100%)",
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  bgCircle1: {
    position: "fixed",
    top: "-120px",
    right: "-120px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  bgCircle2: {
    position: "fixed",
    bottom: "-100px",
    left: "-100px",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    height: "64px",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(37,99,235,0.1)",
    boxShadow: "0 1px 20px rgba(37,99,235,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  navLogo: {
    fontSize: "22px",
  },
  navTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e3a8a",
    letterSpacing: "-0.3px",
  },
  navLinks: {
    display: "flex",
    gap: "4px",
  },
  navLink: {
    padding: "8px 18px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    color: "#475569",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  navLinkActive: {
    background: "#eff6ff",
    color: "#2563eb",
    fontWeight: "600",
  },
  main: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "72px",
    padding: "48px 40px",
    maxWidth: "1100px",
    margin: "0 auto",
    width: "100%",
  },
  hero: {
    flex: 1,
    maxWidth: "440px",
  },
  heroBadge: {
    display: "inline-block",
    padding: "6px 14px",
    background: "#eff6ff",
    color: "#2563eb",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "20px",
    border: "1px solid #bfdbfe",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 1.15,
    margin: "0 0 16px",
    letterSpacing: "-1px",
  },
  heroAccent: {
    color: "#2563eb",
  },
  heroSubtitle: {
    fontSize: "16px",
    color: "#64748b",
    lineHeight: 1.7,
    margin: "0 0 32px",
  },
  statsRow: {
    display: "flex",
    gap: "32px",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  statNum: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#1e3a8a",
    letterSpacing: "-0.5px",
  },
  statLabel: {
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "36px",
    boxShadow: "0 4px 40px rgba(37,99,235,0.12), 0 1px 8px rgba(0,0,0,0.04)",
    border: "1px solid rgba(37,99,235,0.08)",
  },
  cardHeader: {
    marginBottom: "24px",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 4px",
  },
  cardSubtitle: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
  },
  roleTabs: {
    display: "flex",
    gap: "6px",
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "4px",
    marginBottom: "24px",
  },
  roleTab: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
    padding: "8px 4px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  roleTabActive: {
    background: "#ffffff",
    boxShadow: "0 1px 8px rgba(37,99,235,0.12)",
  },
  roleIcon: {
    fontSize: "18px",
  },
  roleLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#475569",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  errorBox: {
    padding: "12px 14px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    color: "#dc2626",
    fontSize: "13px",
    fontWeight: "500",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "12px",
    fontSize: "15px",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "11px 14px 11px 40px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    padding: "0",
  },
  loginBtn: {
    marginTop: "4px",
    padding: "13px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
    transition: "all 0.2s",
    letterSpacing: "0.2px",
  },
  loginBtnDisabled: {
    background: "#93c5fd",
    boxShadow: "none",
    cursor: "not-allowed",
  },
  spinner: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
    fontSize: "13px",
  },
  footerLink: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
  },
  divider: {
    color: "#e2e8f0",
  },
  footerText: {
    color: "#64748b",
  },
  footerLinkBold: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "700",
  },
  footer: {
    textAlign: "center",
    padding: "20px",
    borderTop: "1px solid #f1f5f9",
  },
  footerNote: {
    fontSize: "12px",
    color: "#cbd5e1",
    margin: 0,
  },
};

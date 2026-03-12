import { useState } from "react";

const ROLES = [
  { id: "student", label: "Student", icon: "🎓" },
  { id: "company", label: "Company", icon: "🏢" },
  { id: "admin", label: "Admin", icon: "🛡️" },
];

export default function LoginPage() {
  const [activeRole, setActiveRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: activeRole }),
      });
      const data = await response.json();
      if (response.ok) {
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh",width: "100vw", background: "#f0f4ff", display: "flex", flexDirection: "column" }}>

      {/* Navbar */}
      <nav style={{ background: "#fff", padding: "0 32px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <span style={{ fontWeight: "700", fontSize: "18px", color: "#1e3a8a" }}>🎯 Campus Placement Portal</span>
        <div style={{ display: "flex", gap: "8px" }}>
          {["Home", "Login", "Register"].map((link) => (
            <a key={link} href="#" style={{ padding: "6px 14px", borderRadius: "6px", textDecoration: "none", color: "#475569", fontSize: "14px", fontWeight: "500" }}>
              {link}
            </a>
          ))}
        </div>
      </nav>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ background: "#fff", borderRadius: "0px", padding: "36px", width: "100%", maxWidth: "380px", boxShadow: "0 4px 24px rgba(37,99,235,0.1)", border: "1px solid #e2e8f0" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h2 style={{ margin: "0 0 4px", fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>Welcome Back</h2>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>Sign in to your account</p>
          </div>

          {/* Role Tabs */}
          <div style={{ display: "flex", background: "#f8fafc", borderRadius: "10px", padding: "4px", marginBottom: "20px" }}>
            {ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => { setActiveRole(role.id); setError(""); }}
                style={{
                  flex: 1, padding: "8px 4px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "#475569",
                  background: activeRole === role.id ? "#fff" : "transparent",
                  boxShadow: activeRole === role.id ? "0 1px 6px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {role.icon} {role.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {error && (
              <div style={{ padding: "10px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#dc2626", fontSize: "13px" }}>
                ⚠️ {error}
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Email Address</label>
              <input
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box", background: "#dadada" ,color: "black"}}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", padding: "10px 40px 10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box", background: "#f8fafc" ,color: "black"

                   }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px", background: loading ? "#93c5fd" : "#2563eb", color: "#fff", border: "none",
                borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
                marginTop: "4px",
              }}
            >
              {loading ? "Signing in..." : `Sign In as ${ROLES.find((r) => r.id === activeRole)?.label}`}
            </button>
          </form>

          {/* Footer Links */}
          <div style={{ textAlign: "center", marginTop: "18px", fontSize: "13px", color: "#64748b" }}>
            <a href="/forgot-password" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "500" }}>Forgot Password?</a>
            <span style={{ margin: "0 8px", color: "#e2e8f0" }}>|</span>
            New here? <a href="/register" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "700" }}>Register Now</a>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "16px", borderTop: "1px solid #f1f5f9" }}>
        <p style={{ margin: 0, fontSize: "12px", color: "#cbd5e1" }}>© 2026 Campus Placement Portal · All rights reserved</p>
      </footer>

    </div>
  );
}
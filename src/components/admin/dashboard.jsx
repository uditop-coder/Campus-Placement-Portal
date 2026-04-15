import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const role = localStorage.getItem("role");

  const [active, setActive] = useState("companies");
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/pending-companies");
    setCompanies(res.data);
  };

  const fetchDrives = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/pending-drives");
    setDrives(res.data);
  };

  const approveCompany = async (id) => {
    await axios.put(`http://localhost:5000/api/admin/approve-company/${id}`);
    fetchCompanies();
  };

  const approveDrive = async (id) => {
    await axios.put(`http://localhost:5000/api/admin/approve-drive/${id}`);
    fetchDrives();
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#ffffff", fontFamily: "'Inter', sans-serif" }}>

      {/* Sidebar */}
      <div style={{
        width: "240px",
        background: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "0 8px 20px",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: "8px",
        }}>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "#1d4ed8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M2 3h12v2H2zM2 7h8v2H2zM2 11h10v2H2z" />
            </svg>
          </div>
          <span style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a" }}>Admin Panel</span>
        </div>

        {/* Nav Buttons */}
        <button
          style={navBtn(active === "companies")}
          onClick={() => { setActive("companies"); fetchCompanies(); }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke={active === "companies" ? "#1d4ed8" : "#64748b"}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18M3 9h6M3 15h6" />
          </svg>
          Companies
        </button>

        <button
          style={navBtn(active === "drives")}
          onClick={() => { setActive("drives"); fetchDrives(); }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke={active === "drives" ? "#1d4ed8" : "#64748b"}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4l3 3" />
          </svg>
          Drives
        </button>

        {/* Role pill */}
        <div style={{
          marginTop: "auto",
          padding: "10px 12px",
          borderRadius: "8px",
          background: "#f1f5f9",
          fontSize: "12px",
          color: "#64748b",
        }}>
          Logged in as <span style={{ fontWeight: "600", color: "#0f172a" }}>{role}</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "32px", overflowY: "auto", background: "#ffffff" }}>

        {/* COMPANIES */}
        {active === "companies" && (
          <>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "20px", fontWeight: "600", color: "#0f172a", margin: 0 }}>
                Pending Companies
              </h1>
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                Review and approve company registrations
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
              <div style={statCard}>
                <div style={statLabel}>Awaiting approval</div>
                <div style={statValue}>{companies.length}</div>
              </div>
            </div>

            <p style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "10px" }}>
              Requests
            </p>

            {companies.length === 0 ? (
              <div style={emptyState}>No pending companies</div>
            ) : (
              companies.map((c) => (
                <div key={c._id} style={card}>
                  <div style={avatar("#eff6ff", "#1d4ed8")}>
                    {getInitials(c.companyName)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={itemName}>{c.companyName}</div>
                    <div style={itemSub}>{c.user?.email}</div>
                  </div>
                  <span style={pendingBadge}>Pending</span>
                  <button style={approveBtn} onClick={() => approveCompany(c._id)}>
                    Approve
                  </button>
                </div>
              ))
            )}
          </>
        )}

        {/* DRIVES */}
        {active === "drives" && (
          <>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "20px", fontWeight: "600", color: "#0f172a", margin: 0 }}>
                Pending Drives
              </h1>
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                Review and approve placement drive listings
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
              <div style={statCard}>
                <div style={statLabel}>Awaiting approval</div>
                <div style={statValue}>{drives.length}</div>
              </div>
            </div>

            <p style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "10px" }}>
              Requests
            </p>

            {drives.length === 0 ? (
              <div style={emptyState}>No pending drives</div>
            ) : (
              drives.map((d) => (
                <div key={d._id} style={card}>
                  <div style={avatar("#f0fdf4", "#15803d")}>
                    {getInitials(d.company?.companyName)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={itemName}>{d.company?.companyName}</div>
                    <div style={itemSub}>{d.jobTitle}</div>
                  </div>
                  <span style={pendingBadge}>Pending</span>
                  <button style={approveBtn} onClick={() => approveDrive(d._id)}>
                    Approve
                  </button>
                </div>
              ))
            )}
          </>
        )}

      </div>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const navBtn = (isActive) => ({
  width: "100%",
  padding: "9px 12px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "13.5px",
  fontFamily: "inherit",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  background: isActive ? "#eff6ff" : "transparent",
  color: isActive ? "#1d4ed8" : "#64748b",
  fontWeight: isActive ? "600" : "400",
  transition: "background 0.15s",
});

const statCard = {
  background: "#f8fafc",
  borderRadius: "8px",
  padding: "14px 16px",
  border: "1px solid #e2e8f0",
};

const statLabel = {
  fontSize: "12px",
  color: "#64748b",
  marginBottom: "4px",
};

const statValue = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#0f172a",
};

const card = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "14px 16px",
  marginBottom: "8px",
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const avatar = (bg, color) => ({
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: bg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "13px",
  fontWeight: "600",
  color: color,
  flexShrink: 0,
});

const itemName = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#0f172a",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const itemSub = {
  fontSize: "12px",
  color: "#64748b",
  marginTop: "2px",
};

const pendingBadge = {
  fontSize: "11px",
  padding: "3px 8px",
  borderRadius: "99px",
  background: "#fef3c7",
  color: "#92400e",
  fontWeight: "600",
  flexShrink: 0,
};

const approveBtn = {
  padding: "7px 14px",
  borderRadius: "8px",
  background: "#1d4ed8",
  color: "white",
  border: "none",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
  fontFamily: "inherit",
  whiteSpace: "nowrap",
  flexShrink: 0,
};

const emptyState = {
  padding: "40px 0",
  textAlign: "center",
  color: "#94a3b8",
  fontSize: "14px",
};
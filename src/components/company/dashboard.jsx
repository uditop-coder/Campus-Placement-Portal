import { useState, useEffect } from "react";
import axios from "axios";

export default function CompanyDashboard() {
  const [active, setActive] = useState("profile");
  const userId = localStorage.getItem("userId");

  const [company, setCompany] = useState({
    companyName: "",
    description: "",
    managerName: ""
  });

  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);

  const [newDrive, setNewDrive] = useState({
    jobTitle: "",
    description: ""
  });

  useEffect(() => {
    if (userId) fetchCompany();
  }, [userId]);

  const fetchCompany = async () => {
    const res = await axios.get(`http://localhost:5000/api/company/${userId}`);
    setCompany(res.data);
    fetchDrives(res.data._id);
  };

  const fetchDrives = async (companyId) => {
    const res = await axios.get(`http://localhost:5000/api/drive/company/${companyId}`);
    setDrives(res.data);
  };

  const fetchApplications = async () => {
    const res = await axios.get("http://localhost:5000/api/application");
    setApplications(res.data);
  };

  const updateCompany = async () => {
    await axios.put("http://localhost:5000/api/company/update", {
      ...company,
      user: userId
    });
    alert("Updated!");
  };

  const addDrive = async () => {
    await axios.post("http://localhost:5000/api/drive/create", {
      ...newDrive,
      company: company._id
    });
    fetchDrives(company._id);
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/application/update-status/${id}`, {
      status
    });
    fetchApplications();
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const statusBadge = (status) => {
    const map = {
      shortlisted: { bg: "#fef3c7", color: "#92400e" },
      selected:    { bg: "#dcfce7", color: "#166534" },
      rejected:    { bg: "#fee2e2", color: "#991b1b" },
    };
    const s = map[status] || { bg: "#f1f5f9", color: "#475569" };
    return {
      fontSize: "11px",
      padding: "3px 8px",
      borderRadius: "99px",
      background: s.bg,
      color: s.color,
      fontWeight: "600",
      display: "inline-block",
    };
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          </div>
          <span style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a" }}>Company</span>
        </div>

        {/* Nav */}
        {[
          {
            id: "profile", label: "Profile",
            icon: (color) => (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )
          },
          {
            id: "drives", label: "Hiring",
            icon: (color) => (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            )
          },
          {
            id: "applications", label: "Applications", action: fetchApplications,
            icon: (color) => (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            )
          },
        ].map(({ id, label, icon, action }) => (
          <button
            key={id}
            onClick={() => { setActive(id); if (action) action(); }}
            style={{
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
              background: active === id ? "#eff6ff" : "transparent",
              color: active === id ? "#1d4ed8" : "#64748b",
              fontWeight: active === id ? "600" : "400",
            }}
          >
            {icon(active === id ? "#1d4ed8" : "#64748b")}
            {label}
          </button>
        ))}

        {/* Company name pill */}
        {company.companyName && (
          <div style={{
            marginTop: "auto",
            padding: "10px 12px",
            borderRadius: "8px",
            background: "#f1f5f9",
            fontSize: "12px",
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <div style={{
              width: "24px", height: "24px", borderRadius: "50%",
              background: "#eff6ff", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "10px", fontWeight: "600", color: "#1d4ed8",
            }}>
              {getInitials(company.companyName)}
            </div>
            <span style={{ fontWeight: "600", color: "#0f172a", fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {company.companyName}
            </span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "32px", overflowY: "auto", background: "#ffffff" }}>

        {/* PROFILE */}
        {active === "profile" && (
          <>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "20px", fontWeight: "600", color: "#0f172a", margin: 0 }}>Company Profile</h1>
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>Update your company information</p>
            </div>

            <div style={sectionCard}>
              <label style={fieldLabel}>Company name</label>
              <input
                style={inputStyle}
                placeholder="e.g. Acme Corp"
                value={company.companyName}
                onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
              />

              <label style={{ ...fieldLabel, marginTop: "14px" }}>Description</label>
              <input
                style={inputStyle}
                placeholder="Brief company description"
                value={company.description}
                onChange={(e) => setCompany({ ...company, description: e.target.value })}
              />

              <label style={{ ...fieldLabel, marginTop: "14px" }}>Manager name</label>
              <input
                style={inputStyle}
                placeholder="e.g. John Smith"
                value={company.managerName}
                onChange={(e) => setCompany({ ...company, managerName: e.target.value })}
              />

              <button style={primaryBtn} onClick={updateCompany}>Save changes</button>
            </div>
          </>
        )}

        {/* DRIVES */}
        {active === "drives" && (
          <>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "20px", fontWeight: "600", color: "#0f172a", margin: 0 }}>Hiring Drives</h1>
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>Create and manage your placement drives</p>
            </div>

            <div style={sectionCard}>
              <p style={sectionTitle}>New drive</p>
              <label style={fieldLabel}>Job title</label>
              <input
                style={inputStyle}
                placeholder="e.g. Software Engineer"
                value={newDrive.jobTitle}
                onChange={(e) => setNewDrive({ ...newDrive, jobTitle: e.target.value })}
              />

              <label style={{ ...fieldLabel, marginTop: "14px" }}>Description</label>
              <input
                style={inputStyle}
                placeholder="Role description, requirements..."
                value={newDrive.description}
                onChange={(e) => setNewDrive({ ...newDrive, description: e.target.value })}
              />

              <button style={primaryBtn} onClick={addDrive}>Add drive</button>
            </div>

            {drives.length > 0 && (
              <>
                <p style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase", margin: "24px 0 10px" }}>
                  Existing drives
                </p>
                {drives.map((d) => (
                  <div key={d._id} style={listCard}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: "#f0fdf4", display: "flex", alignItems: "center",
                      justifyContent: "center", flexShrink: 0,
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "500", color: "#0f172a" }}>{d.jobTitle}</div>
                      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{d.description}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {/* APPLICATIONS */}
        {active === "applications" && (
          <>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "20px", fontWeight: "600", color: "#0f172a", margin: 0 }}>Student Applications</h1>
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>Review and manage applicants</p>
            </div>

            {applications.length === 0 ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
                No applications yet
              </div>
            ) : (
              applications.map((app) => (
                <div key={app._id} style={listCard}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: "#eff6ff", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "13px", fontWeight: "600",
                    color: "#1d4ed8", flexShrink: 0,
                  }}>
                    {getInitials(app.student?.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#0f172a" }}>{app.student?.name}</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{app.drive?.jobTitle}</div>
                    <div style={{ marginTop: "6px" }}>
                      <span style={statusBadge(app.status)}>{app.status || "pending"}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                    <button style={actionBtn("#fef3c7", "#92400e")} onClick={() => updateStatus(app._id, "shortlisted")}>Shortlist</button>
                    <button style={actionBtn("#dcfce7", "#166534")} onClick={() => updateStatus(app._id, "selected")}>Select</button>
                    <button style={actionBtn("#fee2e2", "#991b1b")} onClick={() => updateStatus(app._id, "rejected")}>Reject</button>
                  </div>
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

const sectionCard = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "20px 24px",
};

const sectionTitle = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#0f172a",
  marginBottom: "14px",
};

const fieldLabel = {
  display: "block",
  fontSize: "12px",
  fontWeight: "500",
  color: "#64748b",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  fontSize: "14px",
  fontFamily: "inherit",
  color: "#0f172a",
  background: "#ffffff",
  outline: "none",
  boxSizing: "border-box",
};

const primaryBtn = {
  marginTop: "16px",
  padding: "9px 18px",
  background: "#1d4ed8",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
  fontFamily: "inherit",
};

const listCard = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "14px 16px",
  marginBottom: "8px",
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const actionBtn = (bg, color) => ({
  padding: "6px 10px",
  borderRadius: "6px",
  border: "none",
  background: bg,
  color: color,
  fontSize: "12px",
  fontWeight: "600",
  cursor: "pointer",
  fontFamily: "inherit",
});
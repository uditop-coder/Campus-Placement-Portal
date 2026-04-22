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

  // separate edit form so card always shows last-saved data
  const [editForm, setEditForm] = useState({ companyName: "", description: "", managerName: "" });
  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [newDrive, setNewDrive] = useState({ jobTitle: "", description: "",  jdLink: ""  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (userId) fetchCompany();
  }, [userId]);

  useEffect(() => {
    fetchCompany();
    fetchDrives();
    fetchApplications(); // 🔥 ADD THIS HERE
  }, []);

  // ── API ──────────────────────────────────────────────────
  const fetchCompany = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/company/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompany(res.data);
      setEditForm({
        companyName: res.data.companyName || "",
        description: res.data.description || "",
        managerName: res.data.managerName || ""
      });
      fetchDrives();
    } catch (err) {
      console.error("Error fetching company:", err);
    }
  };

  const fetchDrives = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/drive/my-drives", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrives(res.data);
    } catch (err) {
      console.error("Error fetching drives:", err);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/application/company", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  const updateCompany = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/company/update", editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // reflect in card immediately
      setCompany((prev) => ({ ...prev, ...editForm }));
      setShowEdit(false);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2500);
    } catch (err) {
      console.error("Error updating company:", err);
    } finally {
      setSaving(false);
    }
  };

  const addDrive = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/drive/create",
      newDrive,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setNewDrive({
      jobTitle: "",
      description: "",
      jdLink: ""
    });

    fetchDrives();

  } catch (err) {
    console.error("Error creating drive:", err);
  }
};

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/application/update-status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  // ── Helpers ──────────────────────────────────────────────
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
      fontSize: "11px", padding: "3px 8px", borderRadius: "99px",
      background: s.bg, color: s.color, fontWeight: "600", display: "inline-block",
    };
  };

  const filteredApplications = applications.filter((app) => {
  const name = app.student?.name?.toLowerCase() || "";
  const roll = app.student?.rollNo?.toLowerCase() || "";

  return (
    name.includes(searchTerm.toLowerCase()) ||
    roll.includes(searchTerm.toLowerCase())
  );
});

  const driveStatusBadge = (isApproved) => {
  if (isApproved === true) {
    return {
      label: "Approved",
      style: {
        background: "#dcfce7",
        color: "#166534"
      }
    };
  }

  return {
    label: "Pending",
    style: {
      background: "#fef3c7",
      color: "#92400e"
    }
  };
};

  // ── Render ────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { box-sizing: border-box; }
        .nav-btn:hover { background: #f1f5f9 !important; color: #334155 !important; }
        .edit-toggle-btn:hover { background: rgba(255,255,255,0.22) !important; }
        .save-btn:hover:not(:disabled) { background: #1e40af !important; }
        .cancel-btn:hover { background: #f8fafc !important; }
        .logout-btn:hover { background: #fee2e2 !important; color: #b91c1c !important; }
        .action-chip:hover { opacity: 0.78; }
        .input-field:focus { border-color: #93c5fd !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .edit-panel { animation: slideDown 0.18s ease; }
        @keyframes fadeUp {
          0%   { opacity: 0; transform: translateY(4px); }
          15%  { opacity: 1; transform: translateY(0); }
          80%  { opacity: 1; }
          100% { opacity: 0; }
        }
        .saved-toast { animation: fadeUp 2.5s ease forwards; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── SIDEBAR ── */}
        <div style={{
          width: "228px", background: "#fff",
          borderRight: "1px solid #e2e8f0",
          padding: "20px 14px",
          display: "flex", flexDirection: "column", gap: "3px",
          flexShrink: 0,
        }}>
          {/* Logo */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "4px 8px 18px",
            borderBottom: "1px solid #e2e8f0", marginBottom: "8px",
          }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "8px",
              background: "linear-gradient(135deg,#1e3a8a,#3b82f6)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
            </div>
            <span style={{ fontSize: "14.5px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.02em" }}>Company</span>
          </div>

          {/* Nav items */}
          {[
            {
              id: "profile", label: "Profile",
              icon: (c) => (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              )
            },
            {
              id: "drives", label: "Hiring",
              icon: (c) => (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
                </svg>
              )
            },
            {
              id: "applications", label: "Applications", action: fetchApplications,
              icon: (c) => (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              )
            },
          ].map(({ id, label, icon, action }) => (
            <button key={id} className="nav-btn"
              onClick={() => { setActive(id); if (action) action(); }}
              style={{
                width: "100%", padding: "9px 11px", border: "none",
                borderRadius: "8px", cursor: "pointer", textAlign: "left",
                fontSize: "13.5px", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: "10px",
                background: active === id ? "#eff6ff" : "transparent",
                color: active === id ? "#1d4ed8" : "#64748b",
                fontWeight: active === id ? "600" : "400",
                transition: "background 0.13s, color 0.13s",
              }}
            >
              {icon(active === id ? "#1d4ed8" : "#64748b")}
              {label}
            </button>
          ))}

          <div style={{ flex: 1 }} />

          {/* Company pill */}
          {company.companyName && (
            <div style={{
              padding: "10px 11px", borderRadius: "8px",
              background: "#f1f5f9", display: "flex", alignItems: "center", gap: "8px",
              marginBottom: "8px",
            }}>
              <div style={{
                width: "26px", height: "26px", borderRadius: "50%",
                background: "linear-gradient(135deg,#1e3a8a,#3b82f6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "10px", fontWeight: "700", color: "#fff", flexShrink: 0,
              }}>
                {getInitials(company.companyName)}
              </div>
              <span style={{
                fontWeight: "600", color: "#0f172a", fontSize: "12.5px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {company.companyName}
              </span>
            </div>
          )}

          {/* Logout */}
          <button className="logout-btn"
            onClick={handleLogout}
            style={{
              width: "100%", padding: "9px 11px",
              border: "1px solid #fecaca", borderRadius: "8px",
              cursor: "pointer", textAlign: "left",
              fontSize: "13px", fontFamily: "inherit", fontWeight: "500",
              display: "flex", alignItems: "center", gap: "9px",
              background: "#fff5f5", color: "#ef4444",
              transition: "background 0.13s, color 0.13s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>
        </div>

        {/* ── MAIN ── */}
        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

          {/* ════ PROFILE ════ */}
          {active === "profile" && (
            <>
              {/* ── Company Identity Card ── */}
              <div style={{
                borderRadius: "16px", overflow: "hidden",
                border: "1px solid #dbeafe",
                marginBottom: "20px",
                boxShadow: "0 4px 20px rgba(30,58,138,0.09)",
              }}>
                {/* Gradient header */}
                <div style={{
                  padding: "28px 28px 24px",
                  background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 55%, #3b82f6 100%)",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>

                      {/* Avatar + name */}
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{
                          width: "56px", height: "56px", borderRadius: "14px",
                          background: "rgba(255,255,255,0.15)",
                          border: "1.5px solid rgba(255,255,255,0.28)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "19px", fontWeight: "700", color: "#fff",
                          letterSpacing: "-0.02em", flexShrink: 0,
                        }}>
                          {getInitials(company.companyName)}
                        </div>
                        <div>
                          <h2 style={{
                            margin: 0, fontSize: "21px", fontWeight: "700",
                            color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.2,
                          }}>
                            {company.companyName || "Your Company"}
                          </h2>
                          <p style={{
                            margin: "6px 0 0", fontSize: "13.5px",
                            color: "rgba(255,255,255,0.72)", maxWidth: "460px", lineHeight: 1.55,
                          }}>
                            {company.description || "No description added yet."}
                          </p>
                          {company.managerName && (
                            <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "5px" }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                              </svg>
                              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                                Manager: <strong style={{ color: "rgba(255,255,255,0.88)" }}>{company.managerName}</strong>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Edit toggle button */}
                      <button className="edit-toggle-btn"
                        onClick={() => {
                          setEditForm({
                            companyName: company.companyName || "",
                            description: company.description || "",
                            managerName: company.managerName || "",
                          });
                          setShowEdit((v) => !v);
                        }}
                        style={{
                          padding: "8px 15px", borderRadius: "8px",
                          border: "1.5px solid rgba(255,255,255,0.32)",
                          background: showEdit ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
                          color: "#fff", fontSize: "12.5px", fontWeight: "600",
                          cursor: "pointer", fontFamily: "inherit",
                          display: "flex", alignItems: "center", gap: "6px",
                          flexShrink: 0, transition: "background 0.15s",
                        }}
                      >
                        {showEdit ? (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            Cancel
                          </>
                        ) : (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit Profile
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Decorative circles */}
                  <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", bottom: -80, left: -30, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
                </div>

                {/* ── Edit panel (slides open below header) ── */}
                {showEdit && (
                  <div className="edit-panel" style={{
                    padding: "22px 28px",
                    background: "#fff",
                    borderTop: "1px solid #e2e8f0",
                  }}>
                    <p style={{ margin: "0 0 14px", fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
                      Update Profile
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                      <div>
                        <label style={fieldLabel}>Company name</label>
                        <input className="input-field" style={inputStyle}
                          placeholder="e.g. Acme Corp"
                          value={editForm.companyName}
                          onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })} />
                      </div>
                      <div>
                        <label style={fieldLabel}>Manager name</label>
                        <input className="input-field" style={inputStyle}
                          placeholder="e.g. John Smith"
                          value={editForm.managerName}
                          onChange={(e) => setEditForm({ ...editForm, managerName: e.target.value })} />
                      </div>
                    </div>

                    <div style={{ marginTop: "14px" }}>
                      <label style={fieldLabel}>Description</label>
                      <textarea className="input-field"
                        style={{ ...inputStyle, minHeight: "72px", resize: "vertical" }}
                        placeholder="Brief company description..."
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                    </div>

                    <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                      <button className="save-btn"
                        style={{
                          padding: "9px 20px", background: "#1d4ed8",
                          color: "#fff", border: "none", borderRadius: "8px",
                          cursor: saving ? "not-allowed" : "pointer",
                          fontSize: "13px", fontWeight: "600", fontFamily: "inherit",
                          opacity: saving ? 0.65 : 1, transition: "background 0.13s",
                        }}
                        onClick={updateCompany}
                        disabled={saving}
                      >
                        {saving ? "Saving…" : "Save changes"}
                      </button>
                      <button className="cancel-btn"
                        style={{
                          padding: "9px 16px", background: "transparent",
                          color: "#64748b", border: "1px solid #e2e8f0",
                          borderRadius: "8px", cursor: "pointer",
                          fontSize: "13px", fontFamily: "inherit",
                          transition: "background 0.13s",
                        }}
                        onClick={() => setShowEdit(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Saved confirmation strip */}
                {savedFlash && !showEdit && (
                  <div className="saved-toast" style={{
                    padding: "10px 20px",
                    background: "#f0fdf4",
                    borderTop: "1px solid #bbf7d0",
                    fontSize: "13px", fontWeight: "600", color: "#16a34a",
                    display: "flex", alignItems: "center", gap: "7px",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Profile updated successfully
                  </div>
                )}
              </div>

              {/* Quick stats */}
              <div style={{ display: "flex", gap: "12px" }}>
                {[
                  { label: "Total Drives", value: drives.length, accent: "#1d4ed8", lightBg: "#eff6ff" },
                  { label: "Open Drives", value: drives.filter(d => d.isOpen !== false).length, accent: "#16a34a", lightBg: "#f0fdf4" },
                  { label: "Applications", value: applications.length, accent: "#9333ea", lightBg: "#faf5ff" },
                ].map(({ label, value, accent, lightBg }) => (
                  <div key={label} style={{
                    flex: 1, padding: "16px 20px",
                    background: "#fff", borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}>
                    <div style={{
                      display: "inline-flex", padding: "5px 10px",
                      borderRadius: "6px", background: lightBg,
                      fontSize: "20px", fontWeight: "700", color: accent,
                      letterSpacing: "-0.03em", marginBottom: "6px",
                    }}>
                      {value}
                    </div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>{label}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ════ DRIVES ════ */}
          {active === "drives" && (
            <>
              <div style={{ marginBottom: "22px" }}>
                <h1 style={pageTitle}>Hiring Drives</h1>
                <p style={pageSubtitle}>Create and manage your placement drives</p>
              </div>

              <div style={sectionCard}>
                <p style={sectionTitle}>New drive</p>

                <label style={fieldLabel}>Job title</label>
                <input
                  className="input-field"
                  style={inputStyle}
                  placeholder="e.g. Software Engineer"
                  value={newDrive.jobTitle}
                  onChange={(e) =>
                    setNewDrive({ ...newDrive, jobTitle: e.target.value })
                  }
                />

                <label style={{ ...fieldLabel, marginTop: "14px" }}>
                  Description
                </label>
                <input
                  className="input-field"
                  style={inputStyle}
                  placeholder="Role description, requirements..."
                  value={newDrive.description}
                  onChange={(e) =>
                    setNewDrive({ ...newDrive, description: e.target.value })
                  }
                />

                <label style={{ ...fieldLabel, marginTop: "14px" }}>
                  JD Link (Google Drive / PDF)
                </label>

                <input
                  className="input-field"
                  style={inputStyle}
                  placeholder="Paste job description link..."
                  value={newDrive.jdLink}
                  onChange={(e) =>
                    setNewDrive({ ...newDrive, jdLink: e.target.value })
                  }
                />

                <button className="save-btn" style={primaryBtn} onClick={addDrive}>
                  Add drive
                </button>
              </div>

              {drives.length > 0 && (
                <>
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#94a3b8",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      margin: "24px 0 10px",
                    }}
                  >
                    Existing drives
                  </p>

                  {drives.map((d) => {
                    const status = driveStatusBadge(d.isApproved);

                    return (
                      <div key={d._id} style={listCard}>
                        {/* ICON */}
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "#f0fdf4",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#15803d"
                            strokeWidth="2"
                          >
                            <rect x="2" y="3" width="20" height="14" rx="2" />
                            <path d="M8 21h8M12 17v4" />
                          </svg>
                        </div>

                        {/* DRIVE INFO */}
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#0f172a",
                            }}
                          >
                            {d.jobTitle}
                          </div>

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              whiteSpace: "pre-wrap",
                              marginTop: "2px",
                              lineHeight: "1.5"
                            }}
                          >
                            {d.description}
                          </div>
                        </div>

                        {d.jdLink && (
                          <a
                            href={d.jdLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: "12px",
                              color: "#2563eb",
                              marginTop: "6px",
                              display: "inline-block"
                            }}
                          >
                            🔗 View Full JD
                          </a>
                        )}

                        {/* 🔥 STATUS BADGE */}
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            padding: "4px 10px",
                            borderRadius: "999px",
                            ...status.style,
                          }}
                        >
                          {status.label}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}

          {/* ════ APPLICATIONS ════ */}
          {active === "applications" && (
            <>
              <div style={{ marginBottom: "22px" }}>
                <h1 style={pageTitle}>Student Applications</h1>
                <p style={pageSubtitle}>Review and manage applicants</p>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <input
                  type="text"
                  placeholder="🔍 Search by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    fontSize: "13px",
                    outline: "none"
                  }}
                />
              </div>

              {filteredApplications.length === 0 ? (
                <div style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
                  No applications yet
                </div>
              ) : (
                filteredApplications.map((app) => (
                <div key={app._id} style={listCard}>

                  {/* 👤 PROFILE ICON */}
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#1e3a8a,#3b82f6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#fff",
                    flexShrink: 0,
                  }}>
                    {getInitials(app.student?.name)}
                  </div>

                  {/* 🧑 STUDENT INFO */}
                  <div style={{ flex: 1, minWidth: 0 }}>

                    {/* NAME */}
                    <div style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#0f172a"
                    }}>
                      {app.student?.name || "Unknown Student"}
                    </div>

                    {/* DRIVE TITLE */}
                    <div style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "2px"
                    }}>
                      {app.drive?.jobTitle}
                    </div>

                    {/* 🔥 NEW: STUDENT DETAILS */}
                    <div style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "4px"
                    }}>
                      {app.student?.branch || "N/A"} • CGPA: {app.student?.cgpa || "N/A"}
                    </div>

                    {/* 🔥 NEW: ROLL NO */}
                    <div style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      marginTop: "2px"
                    }}>
                      Roll No: {app.student?.rollNo || "N/A"}
                    </div>

                    {/* 🔥 NEW: RESUME LINK */}
                    {app.student?.resume && (
                      <a
                        href={`http://localhost:5000/uploads/${app.student.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "12px",
                          color: "#2563eb",
                          marginTop: "6px",
                          display: "inline-block",
                          fontWeight: "500"
                        }}
                      >
                        📄 View Resume
                      </a>
                    )}

                    {/* STATUS */}
                    <div style={{ marginTop: "6px" }}>
                      <span style={statusBadge(app.status)}>
                        {app.status || "pending"}
                      </span>
                    </div>
                  </div>

                  {/* 🎯 ACTION BUTTONS */}
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                    <button
                      className="action-chip"
                      style={actionBtn("#fef3c7", "#92400e")}
                      onClick={() => updateStatus(app._id, "shortlisted")}
                    >
                      Shortlist
                    </button>

                    <button
                      className="action-chip"
                      style={actionBtn("#dcfce7", "#166534")}
                      onClick={() => updateStatus(app._id, "selected")}
                    >
                      Select
                    </button>

                    <button
                      className="action-chip"
                      style={actionBtn("#fee2e2", "#991b1b")}
                      onClick={() => updateStatus(app._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>

                </div>
              ))
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const pageTitle = {
  fontSize: "20px", fontWeight: "700", color: "#0f172a",
  margin: 0, letterSpacing: "-0.02em",
};
const pageSubtitle = {
  fontSize: "13px", color: "#64748b", marginTop: "4px",
};
const sectionCard = {
  background: "#fff", border: "1px solid #e2e8f0",
  borderRadius: "12px", padding: "20px 24px",
};
const sectionTitle = {
  fontSize: "13px", fontWeight: "600",
  color: "#0f172a", marginBottom: "14px", marginTop: 0,
};
const fieldLabel = {
  display: "block", fontSize: "12px",
  fontWeight: "500", color: "#64748b", marginBottom: "6px",
};
const inputStyle = {
  width: "100%", padding: "9px 12px",
  border: "1px solid #e2e8f0", borderRadius: "8px",
  fontSize: "14px", fontFamily: "inherit", color: "#0f172a",
  background: "#fff", outline: "none", boxSizing: "border-box",
  transition: "border-color 0.15s, box-shadow 0.15s",
};
const primaryBtn = {
  marginTop: "16px", padding: "9px 18px",
  background: "#1d4ed8", color: "white",
  border: "none", borderRadius: "8px",
  cursor: "pointer", fontSize: "13px",
  fontWeight: "600", fontFamily: "inherit",
  transition: "background 0.13s",
};
const listCard = {
  background: "#fff", border: "1px solid #e2e8f0",
  borderRadius: "12px", padding: "14px 16px",
  marginBottom: "8px", display: "flex",
  alignItems: "center", gap: "14px",
};
const actionBtn = (bg, color) => ({
  padding: "6px 10px", borderRadius: "6px", border: "none",
  background: bg, color, fontSize: "12px",
  fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
  transition: "opacity 0.12s",
});
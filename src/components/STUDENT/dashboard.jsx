import { useState, useEffect } from "react";
import axios from "axios";

export default function StudentDashboard() {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const [active, setActive] = useState("drives");

  const [profile, setProfile] = useState({});
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchDrives();
      fetchApplications();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/student/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProfile(res.data);

    } catch (err) {
      console.error("Fetch Profile Error:", err.response?.data || err);
    }
  };

  const fetchDrives = async () => {
    const res = await axios.get("http://localhost:5000/api/drive");
    setDrives(res.data);
  };

  const fetchApplications = async () => {
    const res = await axios.get("http://localhost:5000/api/application");
    const myApps = res.data.filter(
      (a) => a.student?.user === userId || a.student?._id === userId
    );
    setApplications(myApps);
  };

  const applyToDrive = async (driveId) => {
    try {
      if (!profile._id) {
        alert("Profile not loaded yet");
        return;
      }
      await axios.post("http://localhost:5000/api/application/apply", {
        student: profile._id,
        drive: driveId
      });
      fetchApplications();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error applying");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/student/update",
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (resumeFile) {
        const formData = new FormData();
        formData.append("resume", resumeFile);

        await axios.post(
          "http://localhost:5000/api/student/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
      }

      alert("Profile updated successfully");
      fetchProfile();

    } catch (err) {
      console.error("Update Error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const statusBadge = (status) => {
    const map = {
      selected:    { bg: "#dcfce7", color: "#166534" },
      shortlisted: { bg: "#fef3c7", color: "#92400e" },
      rejected:    { bg: "#fee2e2", color: "#991b1b" },
    };
    const s = map[status] || { bg: "#f1f5f9", color: "#475569" };
    return {
      fontSize: "11px",
      padding: "3px 10px",
      borderRadius: "99px",
      background: s.bg,
      color: s.color,
      fontWeight: "600",
      flexShrink: 0,
    };
  };

  const navItems = [
    {
      id: "drives", label: "Drives",
      icon: (color) => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 3" />
        </svg>
      )
    },
    {
      id: "profile", label: "Profile",
      icon: (color) => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      id: "applied", label: "Applied",
      icon: (color) => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      )
    },
    {
      id: "status", label: "Status",
      icon: (color) => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      )
    },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#ffffff", fontFamily: "'Inter', sans-serif", color: "#0f172a" }}>

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
            width: "32px", height: "32px", borderRadius: "8px",
            background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <span style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a" }}>Student</span>
        </div>

        {/* Nav items */}
        {navItems.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
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

        {/* PROFILE */}
        {active === "profile" && (
          <>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={pageTitle}>My Profile</h1>
              <p style={pageSubtitle}>Update your personal and academic details</p>
            </div>

            <div style={sectionCard}>
              {/* Top Profile Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "24px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#1d4ed8",
                  }}
                >
                  {getInitials(profile.name)}
                </div>

                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>
                    {profile.name || "Student Name"}
                  </h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                    {profile.user?.email}
                  </p>
                </div>
              </div>

              {/* Editable Form */}
              <form
                onSubmit={handleProfileUpdate}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={profile.name || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  style={inputStyle}
                />

                <input
                  type="text"
                  placeholder="Branch"
                  value={profile.branch || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, branch: e.target.value })
                  }
                  style={inputStyle}
                />

                <input
                  type="text"
                  placeholder="Section"
                  value={profile.section || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, section: e.target.value })
                  }
                  style={inputStyle}
                />

                <input
                  type="text"
                  placeholder="Roll Number"
                  value={profile.rollNo || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, rollNo: e.target.value })
                  }
                  style={inputStyle}
                />

                <input
                  type="text"
                  placeholder="Contact Number"
                  value={profile.contact || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, contact: e.target.value })
                  }
                  style={inputStyle}
                />

                <input
                  type="number"
                  step="0.01"
                  placeholder="CGPA"
                  value={profile.cgpa || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, cgpa: e.target.value })
                  }
                  style={inputStyle}
                />

                <input
                  type="text"
                  placeholder="Portfolio URL"
                  value={profile.portfolio || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, portfolio: e.target.value })
                  }
                  style={inputStyle}
                />

                <input
                  type="text"
                  placeholder="Projects"
                  value={profile.projects || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, projects: e.target.value })
                  }
                  style={inputStyle}
                />

                <textarea
                  placeholder="Address"
                  value={profile.address || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                  style={{
                    ...inputStyle,
                    gridColumn: "span 2",
                    minHeight: "80px",
                    resize: "vertical",
                  }}
                />

                {/* Resume Upload */}
                <div style={{ gridColumn: "span 2" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#334155",
                    }}
                  >
                    Upload Resume
                  </label>

                  <input
                    type="file"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />

                  {profile.resume && (
                    <p
                      style={{
                        marginTop: "8px",
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      Current Resume: {profile.resume}
                    </p>
                  )}
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  style={{
                    gridColumn: "span 2",
                    padding: "12px",
                    background: "#1d4ed8",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                    marginTop: "8px",
                  }}
                >
                  Save Profile
                </button>
              </form>
            </div>
          </>
        )}

        {/* DRIVES */}
        {active === "drives" && (
          <>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={pageTitle}>Available Drives</h1>
              <p style={pageSubtitle}>Browse and apply to open placement drives</p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
              <div style={statCard}>
                <div style={statLabel}>Open drives</div>
                <div style={statValue}>{drives.length}</div>
              </div>
              <div style={statCard}>
                <div style={statLabel}>Applied</div>
                <div style={statValue}>{applications.length}</div>
              </div>
            </div>

            <p style={sectionMeta}>Listings</p>

            {drives.length === 0 ? (
              <div style={emptyState}>No drives available</div>
            ) : (
              drives.map((d) => {
                const hasApplied = applications.some((a) => a.drive?._id === d._id);
                return (
                  <div key={d._id} style={listCard}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "50%",
                      background: "#f0fdf4", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "13px", fontWeight: "600",
                      color: "#15803d", flexShrink: 0,
                    }}>
                      {getInitials(d.company?.companyName)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "14px", fontWeight: "500", color: "#0f172a" }}>{d.company?.companyName}</div>
                      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{d.jobTitle}</div>
                    </div>
                    <button
                      style={{
                        padding: "7px 16px",
                        borderRadius: "8px",
                        border: "none",
                        fontSize: "13px",
                        fontWeight: "600",
                        fontFamily: "inherit",
                        cursor: hasApplied ? "not-allowed" : "pointer",
                        background: hasApplied ? "#f1f5f9" : "#1d4ed8",
                        color: hasApplied ? "#94a3b8" : "white",
                        flexShrink: 0,
                      }}
                      disabled={hasApplied}
                      onClick={() => applyToDrive(d._id)}
                    >
                      {hasApplied ? "Applied" : "Apply"}
                    </button>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* APPLIED */}
        {active === "applied" && (
          <>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={pageTitle}>Applied Drives</h1>
              <p style={pageSubtitle}>Drives you have submitted applications to</p>
            </div>

            <p style={sectionMeta}>Applications</p>

            {applications.length === 0 ? (
              <div style={emptyState}>No applications yet</div>
            ) : (
              applications.map((a) => (
                <div key={a._id} style={listCard}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: "#eff6ff", display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#0f172a" }}>{a.drive?.jobTitle}</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{a.drive?.company?.companyName}</div>
                  </div>
                  <span style={statusBadge(a.status)}>{a.status?.toUpperCase()}</span>
                </div>
              ))
            )}
          </>
        )}

        {/* STATUS */}
        {active === "status" && (
          <>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={pageTitle}>Application Status</h1>
              <p style={pageSubtitle}>Track the progress of your applications</p>
            </div>

            {/* Summary stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
              {[
                { label: "Shortlisted", status: "shortlisted", bg: "#fef3c7", color: "#92400e" },
                { label: "Selected",    status: "selected",    bg: "#dcfce7", color: "#166534" },
                { label: "Rejected",    status: "rejected",    bg: "#fee2e2", color: "#991b1b" },
              ].map(({ label, status, bg, color }) => (
                <div key={status} style={{ ...statCard, background: bg, border: "none" }}>
                  <div style={{ ...statLabel, color }}>{label}</div>
                  <div style={{ ...statValue, color }}>
                    {applications.filter((a) => a.status === status).length}
                  </div>
                </div>
              ))}
            </div>

            <p style={sectionMeta}>All applications</p>

            {applications.length === 0 ? (
              <div style={emptyState}>No applications yet</div>
            ) : (
              applications.map((a) => (
                <div key={a._id} style={listCard}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: "#f8fafc", border: "1px solid #e2e8f0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#0f172a" }}>{a.drive?.jobTitle}</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{a.drive?.company?.companyName}</div>
                  </div>
                  <span style={statusBadge(a.status)}>{a.status?.toUpperCase()}</span>
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

const pageTitle = {
  fontSize: "20px", fontWeight: "600", color: "#0f172a", margin: 0,
};

const inputStyle = {
  padding: "12px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  fontSize: "14px",
  width: "100%"
};

const pageSubtitle = {
  fontSize: "13px", color: "#64748b", marginTop: "4px",
};

const sectionCard = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "20px 24px",
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

const statCard = {
  background: "#f8fafc",
  borderRadius: "8px",
  padding: "14px 16px",
  border: "1px solid #e2e8f0",
};

const statLabel = {
  fontSize: "12px", color: "#64748b", marginBottom: "4px",
};

const statValue = {
  fontSize: "24px", fontWeight: "600", color: "#0f172a",
};

const sectionMeta = {
  fontSize: "11px", fontWeight: "600", color: "#94a3b8",
  letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "10px",
};

const emptyState = {
  padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: "14px",
};
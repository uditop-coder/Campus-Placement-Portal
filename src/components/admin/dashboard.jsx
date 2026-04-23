import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [active, setActive] = useState("companies");
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/pending-companies");
    setCompanies(res.data || []);
  };

  const fetchDrives = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/pending-drives");
    setDrives(res.data || []);
  };

  // 🔥 NEW STUDENT API
  const fetchStudents = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/students");
    setStudents(res.data || []);
  };

  const approveCompany = async (id) => {
    await axios.put(`http://localhost:5000/api/admin/approve-company/${id}`);
    fetchCompanies();
  };

  const approveDrive = async (id) => {
    await axios.put(`http://localhost:5000/api/admin/approve-drive/${id}`);
    fetchDrives();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div style={styles.dashboard}>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={{ marginBottom: "20px" }}>Admin Panel</h2>

        <SidebarBtn
          active={active === "companies"}
          onClick={() => {
            setActive("companies");
            fetchCompanies();
          }}
          label={`Companies (${companies.length})`}
        />

        <SidebarBtn
          active={active === "drives"}
          onClick={() => {
            setActive("drives");
            fetchDrives();
          }}
          label={`Drives (${drives.length})`}
        />

        {/* 🔥 NEW STUDENT BUTTON */}
        <SidebarBtn
          active={active === "students"}
          onClick={() => {
            setActive("students");
            fetchStudents();
          }}
          label={`Students (${students.length})`}
        />

        {/* Bottom */}
        <div style={{ marginTop: "auto" }}>
          <p style={{ fontSize: "13px", opacity: 0.8 }}>
            Logged in as <b>admin</b>
          </p>

          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <h1 style={{ color: "#111", marginBottom: "10px" }}>
          {active === "companies"
            ? "Pending Companies"
            : active === "drives"
            ? "Pending Drives"
            : "Student Details"}
        </h1>

        {/* Companies */}
        {active === "companies" &&
          (companies.length === 0 ? (
            <Empty text="No companies pending" />
          ) : (
            companies.map((c) => (
              <div key={c._id} style={styles.card}>
                <div>
                  <h3>{c.companyName}</h3>
                  <p style={styles.subText}>{c.user?.email}</p>
                </div>
                <button
                  onClick={() => approveCompany(c._id)}
                  style={styles.approveBtn}
                >
                  Approve
                </button>
              </div>
            ))
          ))}

        {/* Drives */}
        {active === "drives" &&
          (drives.length === 0 ? (
            <Empty text="No drives pending" />
          ) : (
            drives.map((d) => (
              <div key={d._id} style={styles.card}>
                <div>
                  <h3>{d.company?.companyName}</h3>
                  <p style={styles.subText}>{d.jobTitle}</p>
                </div>
                <button
                  onClick={() => approveDrive(d._id)}
                  style={styles.approveBtn}
                >
                  Approve
                </button>
              </div>
            ))
          ))}

        {/* 🔥 STUDENTS */}
        {active === "students" &&
          (students.length === 0 ? (
            <Empty text="No students found" />
          ) : (
            students.map((s) => (
              <div key={s._id} style={styles.card}>
                <div>
                  <h3>{s.name}</h3>
                  <p style={styles.subText}>{s.email}</p>
                </div>
                <span style={styles.badge}>Student</span>
              </div>
            ))
          ))}
      </div>
    </div>
  );
}

/* 🔥 Sidebar Button Component */
function SidebarBtn({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px",
        marginBottom: "10px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        textAlign: "left",
        fontWeight: "600",
        background: active ? "#4f46e5" : "transparent",
        color: active ? "white" : "#cbd5e1",
      }}
    >
      {label}
    </button>
  );
}

/* Empty State */
function Empty({ text }) {
  return (
    <p style={{ color: "#64748b", marginTop: "20px" }}>
      {text}
    </p>
  );
}

/* 🔥 STYLES */
const styles = {
  dashboard: {
    display: "flex",
    height: "100vh",
    fontFamily: "Segoe UI, sans-serif",
  },

  sidebar: {
    width: "240px",
    background: "#0f172a",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },

  logoutBtn: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  main: {
    flex: 1,
    padding: "25px",
    background: "#f1f5f9",
    overflowY: "auto",
  },

  card: {
    backgroundColor: "#ffffff",   // ✅ use backgroundColor (more reliable)
    color: "#000000",             // ✅ force black text
    padding: "16px",
    borderRadius: "12px",
    marginTop: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },

  approveBtn: {
    background: "#4f46e5",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  subText: {
    color: "#64748b",
    fontSize: "13px",
  },

  badge: {
    background: "#22c55e",
    color: "white",
    padding: "5px 10px",
    borderRadius: "6px",
    fontSize: "12px",
  },
};
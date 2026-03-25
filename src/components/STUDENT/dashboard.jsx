import { useState } from "react";

export default function StudentDashboard() {
  const role = localStorage.getItem("role");
  const [activeSection, setActiveSection] = useState("drives");

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
      
      {/* 🔹 MAIN FLEX CONTAINER */}
      <div style={{
        display: "flex",
        width: "100%",
        height: "100%",
        fontFamily: "Arial"
      }}>
        
        {/* 🔹 Sidebar */}
        <div style={{
          width: "240px",
          height: "100%",
          background: "#1e293b",
          color: "white",
          padding: "25px 15px",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          <h2 style={{ marginBottom: "20px" }}>🎓 Student</h2>

          {menuItem("profile", "👤 Profile")}
          {menuItem("drives", "📢 Placement Drives")}
          {menuItem("applied", "📄 Applied Drives")}
          {menuItem("status", "📊 Drive Status")}
        </div>

        {/* 🔹 Main Content */}
        <div style={{
          flex: 1,
          height: "100%",
          padding: "30px",
          background: "#f8fafc",
          overflowY: "auto"
        }}>
          
          <h1 style={{ marginBottom: "5px" }}>Dashboard</h1>
          <p style={{ color: "#64748b", marginBottom: "25px" }}>
            Welcome! You are logged in as <b>{role}</b>
          </p>

          {/* 🔸 Content Box */}
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}>

            {activeSection === "profile" && (
              <div>
                <h2>👤 Profile</h2>
                <p>Update your details here.</p>
              </div>
            )}

            {activeSection === "drives" && (
              <div>
                <h2>📢 Available Placement Drives</h2>

                {driveCard("Google", "Software Engineer")}
                {driveCard("Amazon", "SDE Intern")}
                {driveCard("Microsoft", "Developer")}

              </div>
            )}

            {activeSection === "applied" && (
              <div>
                <h2>📄 Applied Drives</h2>

                {statusCard("Amazon", "Applied")}
                {statusCard("Infosys", "Applied")}

              </div>
            )}

            {activeSection === "status" && (
              <div>
                <h2>📊 Application Status</h2>

                {statusCard("Amazon", "Shortlisted")}
                {statusCard("Infosys", "Under Review")}

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );

  // 🔹 Sidebar Item
  function menuItem(id, label) {
    return (
      <button
        onClick={() => setActiveSection(id)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          background: activeSection === id ? "#3b82f6" : "transparent",
          color: activeSection === id ? "white" : "#cbd5f5",
          fontWeight: activeSection === id ? "600" : "400"
        }}
      >
        {label}
      </button>
    );
  }

  // 🔹 Drive Card
  function driveCard(company, role) {
    return (
      <div style={{
        background: "#f1f5f9",
        padding: "15px",
        borderRadius: "10px",
        marginTop: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <b>{company}</b>
          <p style={{ margin: 0, color: "#64748b" }}>{role}</p>
        </div>
        <button style={applyBtn}>Apply</button>
      </div>
    );
  }

  // 🔹 Status Card
  function statusCard(company, status) {
    return (
      <div style={{
        background: "#f1f5f9",
        padding: "15px",
        borderRadius: "10px",
        marginTop: "10px"
      }}>
        <b>{company}</b>
        <p style={{ margin: 0 }}>Status: {status}</p>
      </div>
    );
  }
}

// 🔹 Apply Button
const applyBtn = {
  padding: "6px 12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
import { useState, useEffect } from "react";
import axios from "axios";

export default function StudentDashboard() {
  const role = localStorage.getItem("role");
  const [activeSection, setActiveSection] = useState("drives");

  // 🔥 STATES
  const [showModal, setShowModal] = useState(false);

  const [profile, setProfile] = useState({
    name: "Udit Pattnayak",
    email: "udit@gmail.com",
    branch: "CST"
  });

  const [formData, setFormData] = useState(profile);

  const [resume, setResume] = useState(null);

  // 🔥 FETCH PROFILE FROM BACKEND
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = "udit@gmail.com";

        const res = await axios.get(
          `http://localhost:5000/api/student/${email}`
        );

        if (res.data) {
          setProfile(res.data);
          setFormData(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
      
      {/* 🔹 MAIN FLEX CONTAINER */}
      <div style={{
        display: "flex",
        width: "100%",
        height: "100%",
        fontFamily: "Arial",
        color: "black"
      }}>
        
        {/* 🔹 Sidebar */}
        <div style={{
          width: "240px",
          background: "#02a7ee",
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
          padding: "30px",
          background: "#f8fafc",
          overflowY: "auto"
        }}>
          
          <h1 style={{ marginBottom: "5px" }}>Dashboard</h1>
          <p style={{ color: "#5492e8", marginBottom: "25px" }}>
            Welcome! You are logged in as <b>{role}</b>
          </p>

          {/* 🔸 Content Box */}
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>

            {/* 🔹 PROFILE SECTION */}
            {activeSection === "profile" && (
              <div>
                <h2 style={{ marginBottom: "20px" }}>👤 My Profile</h2>

                <div style={{
                  background: "#f1f5f9",
                  padding: "20px",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  maxWidth: "500px"
                }}>
                  <div>
                    <p><b>Name:</b> {profile.name}</p>
                    <p><b>Email:</b> {profile.email}</p>
                    <p><b>Branch:</b> {profile.branch}</p>
                    <p><b>Resume:</b> {resume ? resume.name : "No file uploaded"}</p>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      style={primaryBtn}
                      onClick={() => setShowModal(true)}
                    >
                      ✏️ Update Profile
                    </button>

                    <label style={secondaryBtn}>
                      📄 Upload Resume
                      <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          setResume(file);

                          const form = new FormData();
                          form.append("resume", file);
                          form.append("email", profile.email);

                          try {
                            await axios.post(
                              "http://localhost:5000/api/student/upload",
                              form
                            );
                          } catch (err) {
                            console.log(err);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 🔹 DRIVES */}
            {activeSection === "drives" && (
              <div>
                <h2 style={{ marginBottom: "15px" }}>
                  📢 Available Placement Drives
                </h2>

                {driveCard("Google", "Software Engineer")}
                {driveCard("Amazon", "SDE Intern")}
                {driveCard("Microsoft", "Developer")}
              </div>
            )}

            {/* 🔹 APPLIED */}
            {activeSection === "applied" && (
              <div>
                <h2>📄 Applied Drives</h2>
                {statusCard("Amazon", "Applied")}
                {statusCard("Infosys", "Applied")}
              </div>
            )}

            {/* 🔹 STATUS */}
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

      {/* 🔥 MODAL */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <h3>Edit Profile</h3>

            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Name"
            />

            <input
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email"
            />

            <input
              value={formData.branch}
              onChange={(e) =>
                setFormData({ ...formData, branch: e.target.value })
              }
              placeholder="Branch"
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={primaryBtn}
                onClick={async () => {
                  try {
                    await axios.post(
                      "http://localhost:5000/api/student/update",
                      formData
                    );

                    setProfile(formData);
                    setShowModal(false);
                  } catch (err) {
                    console.log(err);
                  }
                }}
              >
                Save
              </button>

              <button
                style={secondaryBtn}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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

// 🔹 Buttons (UNCHANGED)
const applyBtn = {
  padding: "6px 12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const primaryBtn = {
  padding: "8px 14px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "500"
};

const secondaryBtn = {
  padding: "8px 14px",
  background: "#e2e8f0",
  color: "#1e293b",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "500"
};
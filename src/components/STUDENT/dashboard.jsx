import { useState, useEffect } from "react";
import axios from "axios";

export default function StudentDashboard() {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId"); // 🔥 IMPORTANT

  const [activeSection, setActiveSection] = useState("drives");

  const [showModal, setShowModal] = useState(false);

  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({});
  const [resume, setResume] = useState(null);

  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);

  // 🔥 FETCH PROFILE + DRIVES
  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchDrives();
      fetchApplications();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/student/${userId}`
      );
      setProfile(res.data);
      setFormData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDrives = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/drive");
      setDrives(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/application");
      // filter only current student
      const myApps = res.data.filter(
        (a) => a.student?.user === userId || a.student?._id === userId
      );
      setApplications(myApps);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 APPLY TO DRIVE
  const applyToDrive = async (driveId) => {
    try {
      await axios.post("http://localhost:5000/api/application/apply", {
        student: profile._id,
        drive: driveId
      });
      alert("Applied successfully");
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.message || "Error applying");
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
      
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
          <h2>🎓 Student</h2>

          {menuItem("profile", "👤 Profile")}
          {menuItem("drives", "📢 Placement Drives")}
          {menuItem("applied", "📄 Applied Drives")}
          {menuItem("status", "📊 Drive Status")}
        </div>

        {/* 🔹 Content */}
        <div style={{
          flex: 1,
          padding: "30px",
          background: "#f8fafc",
          overflowY: "auto"
        }}>
          
          <h1>Dashboard</h1>
          <p style={{ color: "#5492e8" }}>
            Logged in as <b>{role}</b>
          </p>

          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px"
          }}>

            {/* 🔹 PROFILE */}
            {activeSection === "profile" && (
              <div>
                <h2>👤 My Profile</h2>

                <p><b>Name:</b> {profile.name}</p>
                <p><b>Email:</b> {profile.user?.email}</p>
                <p><b>Branch:</b> {profile.branch}</p>

                <button style={primaryBtn} onClick={() => setShowModal(true)}>
                  ✏️ Update Profile
                </button>
              </div>
            )}

            {/* 🔹 DRIVES */}
            {activeSection === "drives" && (
              <div>
                <h2>📢 Available Placement Drives</h2>

                {drives.map((d) => (
                  <div key={d._id} style={card}>
                    <div>
                      <b>{d.company?.companyName}</b>
                      <p>{d.jobTitle}</p>
                    </div>
                    <button
                      style={applyBtn}
                      onClick={() => applyToDrive(d._id)}
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 🔹 APPLIED */}
            {activeSection === "applied" && (
              <div>
                <h2>📄 Applied Drives</h2>
                {applications.map((a) => (
                  <div key={a._id} style={card}>
                    <b>{a.drive?.jobTitle}</b>
                    <p>Status: {a.status}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 🔹 STATUS */}
            {activeSection === "status" && (
              <div>
                <h2>📊 Application Status</h2>
                {applications.map((a) => (
                  <div key={a._id} style={card}>
                    <b>{a.drive?.jobTitle}</b>
                    <p>Status: {a.status}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );

  function menuItem(id, label) {
    return (
      <button onClick={() => setActiveSection(id)}>
        {label}
      </button>
    );
  }
}

// 🔹 styles (same UI)
const card = {
  background: "#f1f5f9",
  padding: "15px",
  borderRadius: "10px",
  marginTop: "10px",
  display: "flex",
  justifyContent: "space-between"
};

const applyBtn = {
  background: "#2563eb",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px"
};

const primaryBtn = {
  background: "#2563eb",
  color: "white",
  padding: "8px 14px",
  border: "none",
  borderRadius: "8px"
};
import { useState, useEffect } from "react";
import axios from "axios";

export default function CompanyDashboard() {
  const [active, setActive] = useState("profile");

  const [company, setCompany] = useState({
    name: "My Company",
    description: "We are hiring developers",
    totalEmployees: 100
  });

  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);

  const [newDrive, setNewDrive] = useState({
    role: "",
    package: ""
  });

  const email = "company@gmail.com"; // later from login

  // 🔥 Fetch company + drives + applications
  useEffect(() => {
    fetchCompany();
    fetchDrives();
    fetchApplications();
  }, []);

  const fetchCompany = async () => {
    const res = await axios.get(`http://localhost:5000/api/company/${email}`);
    if (res.data) setCompany(res.data);
  };

  const fetchDrives = async () => {
    const res = await axios.get(`http://localhost:5000/api/drive/${email}`);
    setDrives(res.data);
  };

  const fetchApplications = async () => {
    const res = await axios.get("http://localhost:5000/api/application");
    setApplications(res.data);
  };

  // 🔥 Update company
  const updateCompany = async () => {
    await axios.post("http://localhost:5000/api/company/update", {
      ...company,
      email
    });
    alert("Updated!");
  };

  // 🔥 Add drive
  const addDrive = async () => {
    await axios.post("http://localhost:5000/api/drive/create", {
      ...newDrive,
      companyEmail: email
    });
    fetchDrives();
  };

  // 🔥 Update student status
  const updateStatus = async (id, status) => {
    await axios.post("http://localhost:5000/api/application/update", {
      id,
      status
    });
    fetchApplications();
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* Sidebar */}
      <div style={{ width: "220px", background: "#0284c7", padding: "20px" }}>
        <h2>🏢 Company</h2>

        <button onClick={() => setActive("profile")}>Profile</button>
        <button onClick={() => setActive("drives")}>Hiring</button>
        <button onClick={() => setActive("applications")}>Applications</button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px", background: "#f1f5f9" }}>

        {/* 🔹 PROFILE */}
        {active === "profile" && (
          <div>
            <h2>Company Profile</h2>

            <input
              placeholder="Company Name"
              value={company.name}
              onChange={(e) =>
                setCompany({ ...company, name: e.target.value })
              }
            />

            <input
              placeholder="Description"
              value={company.description}
              onChange={(e) =>
                setCompany({ ...company, description: e.target.value })
              }
            />

            <input
              placeholder="Total Employees"
              value={company.totalEmployees}
              onChange={(e) =>
                setCompany({ ...company, totalEmployees: e.target.value })
              }
            />

            <button onClick={updateCompany}>Update</button>
          </div>
        )}

        {/* 🔹 DRIVES */}
        {active === "drives" && (
          <div>
            <h2>Create Hiring Drive</h2>

            <input
              placeholder="Role"
              value={newDrive.role}
              onChange={(e) =>
                setNewDrive({ ...newDrive, role: e.target.value })
              }
            />

            <input
              placeholder="Package"
              value={newDrive.package}
              onChange={(e) =>
                setNewDrive({ ...newDrive, package: e.target.value })
              }
            />

            <button onClick={addDrive}>Add Drive</button>

            <h3>Existing Drives</h3>
            {drives.map((d) => (
              <div key={d._id}>
                {d.role} - {d.package}
              </div>
            ))}
          </div>
        )}

        {/* 🔹 APPLICATIONS */}
        {active === "applications" && (
          <div>
            <h2>Student Applications</h2>

            {applications.map((app) => (
              <div key={app._id} style={{ margin: "10px", padding: "10px", background: "white" }}>
                <p><b>{app.studentEmail}</b></p>
                <p>Role: {app.role}</p>
                <p>Status: {app.status}</p>

                <button onClick={() => updateStatus(app._id, "Shortlisted")}>
                  Shortlist
                </button>
                <button onClick={() => updateStatus(app._id, "Selected")}>
                  Select
                </button>
                <button onClick={() => updateStatus(app._id, "Rejected")}>
                  Reject
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
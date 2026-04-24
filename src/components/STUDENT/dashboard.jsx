import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  const role = localStorage.getItem("role");

  const [active, setActive] = useState("drives");
  const [profile, setProfile] = useState({});
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchDrives();
    fetchApplications();
  }, []);

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    const res = await axios.get("http://localhost:5000/api/student/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProfile(res.data);
  };

  const fetchDrives = async () => {
    const res = await axios.get("http://localhost:5000/api/drive");
    setDrives(res.data);
  };

  const fetchApplications = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/application/student",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setApplications(res.data);
  };

  const applyToDrive = async (driveId) => {
    await axios.post(
      "http://localhost:5000/api/application/apply",
      { drive: driveId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchApplications(); // refresh
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    await axios.put(
      "http://localhost:5000/api/student/update",
      profile,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Profile updated!");
    fetchProfile();
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-100 to-white">

      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col p-5">
        <h2 className="text-xl font-bold mb-6">Student Panel</h2>

        {["drives", "applied", "status", "profile"].map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={`mb-2 p-2 rounded-lg text-left ${
              active === item ? "bg-white text-blue-900" : "hover:bg-blue-700"
            }`}
          >
            {item.toUpperCase()}
          </button>
        ))}

        <div className="mt-auto">
          <p className="text-sm opacity-70">Logged in as {role}</p>
          <button
            onClick={logout}
            className="mt-3 w-full bg-red-500 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* DRIVES */}
        {active === "drives" && (
          <>
            <h1 className="text-2xl font-bold text-blue-900 mb-4">
              Available Drives
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Stat label="Total Drives" value={drives.length} />
              <Stat label="Applied" value={applications.length} />
            </div>

            {drives.map((d) => {
              const applied = applications.some(
                (a) => a.drive?._id === d._id
              );

              return (
                <Card key={d._id}>
                  <div>
                    <h3 className="font-bold">{d.company?.companyName}</h3>
                    <p className="text-gray-500">{d.jobTitle}</p>
                  </div>

                  <button
                    disabled={applied}
                    onClick={() => applyToDrive(d._id)}
                    className={`px-4 py-2 rounded ${
                      applied
                        ? "bg-gray-300 text-gray-500"
                        : "bg-blue-900 text-white"
                    }`}
                  >
                    {applied ? "Applied" : "Apply"}
                  </button>
                </Card>
              );
            })}
          </>
        )}

        {/* APPLIED */}
        {active === "applied" && (
          <>
            <h1 className="text-2xl font-bold text-blue-900 mb-4">
              Applied Drives
            </h1>

            {applications.length === 0 ? (
              <p>No applications yet</p>
            ) : (
              applications.map((a) => (
                <Card key={a._id}>
                  <div>
                    <h3>{a.drive?.jobTitle}</h3>
                    <p className="text-gray-500">
                      {a.drive?.company?.companyName}
                    </p>
                  </div>
                  <Status status={a.status} />
                </Card>
              ))
            )}
          </>
        )}

        {/* STATUS */}
        {active === "status" && (
          <>
            <h1 className="text-2xl font-bold text-blue-900 mb-4">
              Application Status
            </h1>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <Stat
                label="Selected"
                value={applications.filter((a) => a.status === "selected").length}
              />
              <Stat
                label="Shortlisted"
                value={applications.filter((a) => a.status === "shortlisted").length}
              />
              <Stat
                label="Rejected"
                value={applications.filter((a) => a.status === "rejected").length}
              />
            </div>

            {applications.map((a) => (
              <Card key={a._id}>
                <div>
                  <h3>{a.drive?.jobTitle}</h3>
                  <p>{a.drive?.company?.companyName}</p>
                </div>
                <Status status={a.status} />
              </Card>
            ))}
          </>
        )}

        {/* PROFILE */}
        {active === "profile" && (
          <>
            <h1 className="text-2xl font-bold text-blue-900 mb-4">
              My Profile
            </h1>

            <form
              onSubmit={updateProfile}
              className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4 max-w-2xl"
            >
              <input
                type="text"
                placeholder="Name"
                value={profile.name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Branch"
                value={profile.branch || ""}
                onChange={(e) =>
                  setProfile({ ...profile, branch: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Section"
                value={profile.section || ""}
                onChange={(e) =>
                  setProfile({ ...profile, section: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Roll No"
                value={profile.rollNo || ""}
                onChange={(e) =>
                  setProfile({ ...profile, rollNo: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Contact"
                value={profile.contact || ""}
                onChange={(e) =>
                  setProfile({ ...profile, contact: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                type="number"
                placeholder="CGPA"
                value={profile.cgpa || ""}
                onChange={(e) =>
                  setProfile({ ...profile, cgpa: e.target.value })
                }
                className="border p-2 rounded"
              />

              <textarea
                placeholder="Address"
                value={profile.address || ""}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                className="border p-2 rounded col-span-2"
              />

              <button
                type="submit"
                className="col-span-2 bg-blue-900 text-white py-2 rounded-lg"
              >
                Save Profile
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* Components */

function Card({ children }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-4 rounded-xl shadow mb-3 flex justify-between items-center"
    >
      {children}
    </motion.div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <p className="text-gray-500">{label}</p>
      <h2 className="text-xl font-bold text-blue-900">{value}</h2>
    </div>
  );
}

function Status({ status }) {
  const color =
    status === "selected"
      ? "bg-green-100 text-green-700"
      : status === "shortlisted"
      ? "bg-yellow-100 text-yellow-700"
      : status === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-600";

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
      {status}
    </span>
  );
}
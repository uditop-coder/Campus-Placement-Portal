import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [active, setActive] = useState("companies");
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-100 to-white">

      {/* Sidebar */}
      <div className="w-64 bg-primary text-white flex flex-col p-5 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

        <SidebarBtn active={active === "companies"} onClick={() => {setActive("companies"); fetchCompanies();}} label={`Companies (${companies.length})`} />
        <SidebarBtn active={active === "drives"} onClick={() => {setActive("drives"); fetchDrives();}} label={`Drives (${drives.length})`} />
        <SidebarBtn active={active === "students"} onClick={() => {setActive("students"); fetchStudents();}} label={`Students (${students.length})`} />

        <div className="mt-auto">
          <p className="text-sm opacity-70">Logged in as admin</p>
          <button onClick={logout} className="mt-3 w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg">
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 overflow-y-auto">

        <h1 className="text-3xl font-bold text-primary mb-4">
          {active === "companies" ? "Pending Companies" :
           active === "drives" ? "Pending Drives" : "Students"}
        </h1>

        {/* Companies */}
        {active === "companies" && (
          companies.length === 0 ? <Empty text="No companies pending" /> :
          companies.map((c) => (
            <Card key={c._id}>
              <div>
                <h3 className="font-bold text-lg">{c.companyName}</h3>
                <p className="text-gray-500">{c.user?.email}</p>
              </div>
              <button
                onClick={() => approveCompany(c._id)}
                className="bg-primary hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
              >
                Approve
              </button>
            </Card>
          ))
        )}

        {/* Drives */}
        {active === "drives" && (
          drives.length === 0 ? <Empty text="No drives pending" /> :
          drives.map((d) => (
            <Card key={d._id}>
              <div>
                <h3 className="font-bold text-lg">{d.company?.companyName}</h3>
                <p className="text-gray-500">{d.jobTitle}</p>
              </div>
              <button
                onClick={() => approveDrive(d._id)}
                className="bg-primary hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
              >
                Approve
              </button>
            </Card>
          ))
        )}

        {/* Students */}
        {active === "students" && (
          students.length === 0 ? <Empty text="No students found" /> :
          students.map((s) => (
            <Card key={s._id} onClick={() => setSelectedStudent(s)}>
              <div>
                <h3 className="font-bold">{s.name}</h3>
                <p className="text-gray-500">{s.email}</p>
              </div>
              <span className="bg-green-500 text-white px-3 py-1 rounded-lg">
                View
              </span>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      {selectedStudent && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="bg-white p-6 rounded-xl w-96 text-center shadow-xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <h2 className="text-xl font-bold mb-2">{selectedStudent.name}</h2>
            <p>{selectedStudent.email}</p>

            {selectedStudent.resume ? (
              <a
                href={`http://localhost:5000/${selectedStudent.resume}`}
                target="_blank"
                className="block mt-3 bg-primary text-white py-2 rounded"
              >
                View Resume
              </a>
            ) : (
              <p className="text-gray-400 mt-2">No Resume</p>
            )}

            <button
              onClick={() => setSelectedStudent(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

/* Components */

function SidebarBtn({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`text-left px-3 py-2 rounded-lg mb-2 transition ${
        active ? "bg-white text-primary font-semibold" : "hover:bg-blue-700"
      }`}
    >
      {label}
    </button>
  );
}

function Card({ children, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center mb-4 cursor-pointer"
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

function Empty({ text }) {
  return <p className="text-gray-500">{text}</p>;
}
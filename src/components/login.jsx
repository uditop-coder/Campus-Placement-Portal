import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ROLES = [
  { id: "student", label: "Student", icon: "🎓" },
  { id: "company", label: "Company", icon: "🏢" },
  { id: "admin", label: "Admin", icon: "🛡️" },
];

export default function LoginPage() {
  const [activeRole, setActiveRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: activeRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      if (data.role !== activeRole) {
        setError(`You are registered as ${data.role}`);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.id);

      if (data.role === "admin") navigate("/admin-dashboard");
      else if (data.role === "company") navigate("/company-dashboard");
      else navigate("/student-dashboard");

    } catch {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-500">

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-blue-900">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Login to continue</p>
        </div>

        {/* Role Tabs */}
        <div className="flex bg-blue-100 rounded-lg p-1 mb-5">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                activeRole === role.id
                  ? "bg-blue-900 text-white shadow"
                  : "text-blue-900"
              }`}
            >
              {role.icon} {role.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-3">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 cursor-pointer"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg font-semibold transition"
          >
            {loading ? "Signing in..." : `Login as ${activeRole}`}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm mt-5">
          <a href="/register" className="text-blue-700 font-semibold">
            Create account
          </a>
        </div>
      </motion.div>
    </div>
  );
}
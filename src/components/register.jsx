import { useState } from "react";

export default function Register() {
  const [role, setRole] = useState("student");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    section: "",
    rollNo: "",
    companyName: "",
    description: "",
    managerName: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    try {
      const payload =
  role === "student"
    ? {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "student",
        branch: form.branch,
        section: form.section,
        rollNo: form.rollNo
      }
    : {
        companyName: form.companyName,
        email: form.email,
        password: form.password,
        role: "company",
        description: form.description,
        managerName: form.managerName
      };

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      alert(data.message);
      window.location.href = "/";

    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>

          {/* 🔥 DUMMY FIELDS (IMPORTANT) */}
          <input type="text" name="fake_email" style={{ display: "none" }} />
          <input type="password" name="fake_password" style={{ display: "none" }} />

        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join the placement portal</p>

        {/* Role Toggle */}
        <div style={styles.toggle}>
          <button
            style={role === "student" ? styles.activeTab : styles.tab}
            onClick={() => setRole("student")}
          >
            🎓 Student
          </button>
          <button
            style={role === "company" ? styles.activeTab : styles.tab}
            onClick={() => setRole("company")}
          >
            🏢 Company
          </button>
        </div>

        {/* Email */}
        <input
          name="email"
          placeholder="Email Address"
          autoComplete="off"
          onChange={handleChange}
          style={styles.input}
        />

        {/* Password */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="off"
          onChange={handleChange}
          style={styles.input}
        />

        {/* STUDENT FORM */}
        {role === "student" && (
          <>
            <input name="name" placeholder="Full Name" onChange={handleChange} style={styles.input} />
            <input name="branch" placeholder="Branch" onChange={handleChange} style={styles.input} />
            <input name="section" placeholder="Section" onChange={handleChange} style={styles.input} />
            <input name="rollNo" placeholder="Roll No" onChange={handleChange} style={styles.input} />
          </>
        )}

        {/* COMPANY FORM */}
        {role === "company" && (
          <>
            <input name="companyName" placeholder="Company Name" onChange={handleChange} style={styles.input} />
            <input name="managerName" placeholder="Manager Name" onChange={handleChange} style={styles.input} />
            <input name="description" placeholder="Company Description" onChange={handleChange} style={styles.input} />
          </>
        )}

        <button onClick={handleRegister} style={styles.button}>
          Register as {role}
        </button>

        {/* Footer */}
        <p style={styles.footer}>
          Already have an account?{" "}
          <a href="/" style={styles.link}>Login</a>
        </p>
      </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
    padding: "20px",
    boxSizing: "border-box"
  },

  card: {
    background: "#ffffff",
    padding: "32px 28px",
    width: "100%",
    maxWidth: "380px",
    borderRadius: "16px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    textAlign: "center"
  },

  title: {
    marginBottom: "4px",
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a"
  },

  subtitle: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "18px"
  },

  toggle: {
    display: "flex",
    background: "#f1f5f9",
    borderRadius: "10px",
    marginBottom: "18px",
    padding: "4px"
  },

  tab: {
    flex: 1,
    padding: "8px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#64748b",
    fontSize: "13px"
  },

  activeTab: {
    flex: 1,
    padding: "8px",
    border: "none",
    background: "#ffffff",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    color: "#0f172a"
  },

  input: {
    width: "100%",
    padding: "11px 12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    outline: "none",
    background: "#ffffff",          // ✅ white background
    color: "#0f172a",               // ✅ black text
    fontSize: "13px",
    transition: "all 0.2s ease"
  },



  button: {
    width: "100%",
    padding: "11px",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "10px",
    fontSize: "14px",
    transition: "0.2s"
  },

  footer: {
    marginTop: "16px",
    fontSize: "13px",
    color: "#64748b"
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600"
  }
};
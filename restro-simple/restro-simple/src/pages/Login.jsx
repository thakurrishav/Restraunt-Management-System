import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);

      if (data.user.role === "Waiter") {
        navigate("/tables");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError("Backend is not running or login failed");
      console.error(error);
    }
  };

  return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logo}>🍽️</div>

          <h1 style={styles.title}>Restro POS</h1>
          <p style={styles.subtitle}>Smart Restaurant Management System</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  style={styles.input}
                  required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  style={styles.input}
                  required
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" style={styles.btn}>
              Sign In
            </button>
          </form>

          <div style={styles.hint}>
            <p style={styles.hintText}>
              Use registered backend users from MongoDB
            </p>
            <p style={styles.hintText}>
              Example: admin@restro.com / admin123
            </p>
          </div>
        </div>
      </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 420,
    textAlign: "center",
  },
  logo: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: "var(--accent)",
  },
  subtitle: {
    fontSize: 13,
    color: "var(--muted)",
    marginTop: 4,
    marginBottom: 32,
  },
  form: {
    textAlign: "left",
  },
  field: {
    marginBottom: 18,
  },
  label: {
    display: "block",
    fontSize: 13,
    color: "var(--muted)",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "12px 14px",
    color: "var(--text)",
    fontSize: 14,
    outline: "none",
  },
  error: {
    background: "#3a1a1a",
    color: "var(--red)",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 16,
  },
  btn: {
    width: "100%",
    background: "var(--accent)",
    color: "#111",
    border: "none",
    borderRadius: 8,
    padding: "13px",
    fontSize: 15,
    fontWeight: 700,
    marginTop: 8,
    cursor: "pointer",
  },
  hint: {
    marginTop: 24,
    background: "var(--surface2)",
    borderRadius: 8,
    padding: "12px 14px",
  },
  hintText: {
    fontSize: 12,
    color: "var(--muted)",
    marginBottom: 4,
  },
};
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { path: "/dashboard", label: "📊 Dashboard", roles: ["Admin"] },
    { path: "/tables", label: "🪑 Tables", roles: ["Admin", "Waiter"] },
    { path: "/orders", label: "📋 Orders", roles: ["Admin", "Waiter"] },
    { path: "/menu", label: "🍛 Menu", roles: ["Admin", "Waiter"] },
  ];

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  const visibleLinks = links.filter((l) => l.roles.includes(user?.role));

  return (
    <nav style={styles.nav}>
      <div style={styles.brand} onClick={() => navigate("/dashboard")}>
        <span style={styles.brandIcon}>🍽️</span>
        <span style={styles.brandName}>Restro POS</span>
      </div>

      <div style={styles.links}>
        {visibleLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              ...styles.link,
              ...(location.pathname === link.path ? styles.activeLink : {}),
            }}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div style={styles.right}>
        <span style={styles.userName}>👤 {user?.name}</span>
        <span style={styles.role}>{user?.role}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
    padding: "0 28px",
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  },
  brandIcon: { fontSize: 22 },
  brandName: { fontWeight: 700, fontSize: 16, color: "var(--accent)" },
  links: { display: "flex", gap: 4 },
  link: {
    background: "none",
    border: "none",
    color: "var(--muted)",
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
  },
  activeLink: {
    background: "var(--surface2)",
    color: "var(--text)",
  },
  right: { display: "flex", alignItems: "center", gap: 12 },
  userName: { fontSize: 13, color: "var(--text)" },
  role: {
    fontSize: 11,
    background: "#1a2e1a",
    color: "var(--green)",
    padding: "3px 8px",
    borderRadius: 20,
  },
  logoutBtn: {
    background: "none",
    border: "1px solid var(--border)",
    color: "var(--muted)",
    padding: "6px 14px",
    borderRadius: 8,
    fontSize: 13,
  },
};

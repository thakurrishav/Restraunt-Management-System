import { useState } from "react";
import { initialTables } from "../data";

export default function Tables() {
  const [tables, setTables] = useState(initialTables);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [newTable, setNewTable] = useState({ tableNo: "", seats: "" });

  const filtered = filter === "All" ? tables : tables.filter((t) => t.status === filter);

  const handleAddTable = (e) => {
    e.preventDefault();
    const t = {
      id: tables.length + 1,
      tableNo: parseInt(newTable.tableNo),
      seats: parseInt(newTable.seats),
      status: "Available",
      customer: "",
    };
    setTables([...tables, t]);
    setNewTable({ tableNo: "", seats: "" });
    setShowForm(false);
  };

  const toggleStatus = (id) => {
    setTables(tables.map((t) =>
      t.id === id ? { ...t, status: t.status === "Available" ? "Booked" : "Available" } : t
    ));
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Table Management</h1>
          <p style={styles.sub}>Track and manage restaurant tables</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
          + Add Table
        </button>
      </div>

      {/* Add Table Form */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Add New Table</h3>
          <form onSubmit={handleAddTable} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.field}>
                <label style={styles.label}>Table Number</label>
                <input
                  type="number"
                  value={newTable.tableNo}
                  onChange={(e) => setNewTable({ ...newTable, tableNo: e.target.value })}
                  placeholder="e.g. 9"
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Number of Seats</label>
                <input
                  type="number"
                  value={newTable.seats}
                  onChange={(e) => setNewTable({ ...newTable, seats: e.target.value })}
                  placeholder="e.g. 4"
                  style={styles.input}
                  required
                />
              </div>
              <button type="submit" style={styles.submitBtn}>Add Table</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Buttons */}
      <div style={styles.filters}>
        {["All", "Available", "Booked"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ ...styles.filterBtn, ...(filter === f ? styles.activeFilter : {}) }}
          >
            {f}
          </button>
        ))}
        <span style={styles.countBadge}>
          {tables.filter(t => t.status === "Available").length} Available &nbsp;·&nbsp;
          {tables.filter(t => t.status === "Booked").length} Booked
        </span>
      </div>

      {/* Tables Grid */}
      <div style={styles.grid}>
        {filtered.map((table) => (
          <div key={table.id} style={{
            ...styles.card,
            borderColor: table.status === "Booked" ? "var(--accent)" : "var(--border)",
          }}>
            <div style={styles.cardHeader}>
              <h2 style={styles.tableNo}>Table {table.tableNo}</h2>
              <span style={{
                ...styles.badge,
                background: table.status === "Booked" ? "#3a2a0a" : "#1a3a1a",
                color: table.status === "Booked" ? "var(--accent)" : "var(--green)",
              }}>
                {table.status}
              </span>
            </div>

            <div style={styles.avatar}>
              {table.customer
                ? table.customer.split(" ").map((w) => w[0]).join("").toUpperCase()
                : "—"}
            </div>

            <div style={styles.cardInfo}>
              <p style={styles.infoText}>🪑 Seats: {table.seats}</p>
              {table.customer && <p style={styles.infoText}>👤 {table.customer}</p>}
            </div>

            <button
              onClick={() => toggleStatus(table.id)}
              style={{
                ...styles.toggleBtn,
                background: table.status === "Available" ? "#1a2e1a" : "#3a1a1a",
                color: table.status === "Available" ? "var(--green)" : "var(--red)",
                border: `1px solid ${table.status === "Available" ? "var(--green)" : "var(--red)"}`,
              }}
            >
              {table.status === "Available" ? "Mark as Booked" : "Mark as Available"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "28px 32px", maxWidth: 1200, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 700 },
  sub: { fontSize: 13, color: "var(--muted)", marginTop: 4 },
  addBtn: { background: "var(--accent)", color: "#111", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 14 },
  formCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 24 },
  formTitle: { fontSize: 15, fontWeight: 600, marginBottom: 14 },
  form: {},
  formRow: { display: "flex", gap: 16, alignItems: "flex-end" },
  field: { flex: 1 },
  label: { display: "block", fontSize: 12, color: "var(--muted)", marginBottom: 6 },
  input: { width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", color: "var(--text)", fontSize: 14, outline: "none" },
  submitBtn: { background: "var(--accent)", color: "#111", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" },
  filters: { display: "flex", gap: 8, marginBottom: 20, alignItems: "center" },
  filterBtn: { background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 8, padding: "7px 16px", fontSize: 13 },
  activeFilter: { background: "var(--surface2)", color: "var(--text)", borderColor: "var(--accent)" },
  countBadge: { marginLeft: "auto", fontSize: 13, color: "var(--muted)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 },
  card: { background: "var(--surface)", border: "1px solid", borderRadius: 12, padding: 18 },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  tableNo: { fontSize: 16, fontWeight: 600 },
  badge: { padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 },
  avatar: { width: 52, height: 52, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "var(--accent)", margin: "0 auto 14px" },
  cardInfo: { marginBottom: 14 },
  infoText: { fontSize: 13, color: "var(--muted)", marginBottom: 4 },
  toggleBtn: { width: "100%", border: "none", borderRadius: 8, padding: "8px", fontSize: 12, fontWeight: 600 },
};

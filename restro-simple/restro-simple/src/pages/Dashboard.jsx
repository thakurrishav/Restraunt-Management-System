import { initialOrders, initialTables } from "../data";

export default function Dashboard() {
  const totalOrders = initialOrders.length;
  const totalRevenue = initialOrders.reduce((sum, o) => sum + o.total, 0);
  const bookedTables = initialTables.filter((t) => t.status === "Booked").length;
  const inProgress = initialOrders.filter((o) => o.status === "In Progress").length;
  const readyOrders = initialOrders.filter((o) => o.status === "Ready").length;
  const avgOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
  const counts = {};
  initialOrders.forEach((o) => o.items.forEach((item) => counts[item] = (counts[item] || 0) + 1));
  const popularItem = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

  const metrics = [
    { label: "Total Orders", value: totalOrders, icon: "📋", color: "#025cca" },
    { label: "Total Revenue", value: `₹${totalRevenue}`, icon: "💰", color: "#02ca3a" },
    { label: "Tables Booked", value: `${bookedTables}/${initialTables.length}`, icon: "🪑", color: "#f6b100" },
    { label: "In Progress", value: inProgress, icon: "⏳", color: "#e03a3a" },
    { label: "Avg Order", value: `₹${avgOrder}`, icon: "📊", color: "#9b59b6" },
  ];

  return (
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.sub}>Overview of today's restaurant performance</p>
          </div>
          <div style={styles.dateBox}>
            <span style={styles.dateText}>{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>

        {/* Metric Cards */}
        <div style={styles.grid}>
          {metrics.map((m) => (
              <div key={m.label} style={{ ...styles.card, borderTop: `3px solid ${m.color}` }}>
                <div style={styles.cardTop}>
                  <span style={styles.cardIcon}>{m.icon}</span>
                  <span style={{ ...styles.cardValue, color: m.color }}>{m.value}</span>
                </div>
                <p style={styles.cardLabel}>{m.label}</p>
              </div>
          ))}
        </div>

        <div style={styles.analytics}>
          <div style={styles.analyticsCard}>🔥 <span><b>Popular Item</b><br />{popularItem ? `${popularItem[0]} (${popularItem[1]})` : "No data"}</span></div>
          <div style={styles.analyticsCard}>✅ <span><b>Ready Orders</b><br />{readyOrders} orders ready</span></div>
          <div style={styles.analyticsCard}>📈 <span><b>Revenue</b><br />₹{totalRevenue} today</span></div>
        </div>

        {/* Recent Orders Table */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Recent Orders</h2>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
              <tr>
                {["Order ID", "Customer", "Table", "Items", "Total", "Status", "Time"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
              </thead>
              <tbody>
              {initialOrders.map((order) => (
                  <tr key={order.id} style={styles.tr}>
                    <td style={styles.td}><span style={styles.orderId}>#{order.id}</span></td>
                    <td style={styles.td}>{order.customer}</td>
                    <td style={styles.td}>Table {order.tableNo}</td>
                    <td style={styles.td}>{order.items.length} items</td>
                    <td style={styles.td}>₹{order.total}</td>
                    <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: order.status === "Ready" ? "#1a3a1a" : "#3a2a0a",
                      color: order.status === "Ready" ? "var(--green)" : "var(--accent)",
                    }}>
                      {order.status}
                    </span>
                    </td>
                    <td style={styles.td}>{order.time}</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table Status */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Table Status</h2>
          <div style={styles.tableGrid}>
            {initialTables.map((t) => (
                <div key={t.id} style={{
                  ...styles.tableCard,
                  borderColor: t.status === "Booked" ? "var(--accent)" : "var(--border)",
                }}>
                  <div style={styles.tableCardTop}>
                    <span style={styles.tableNo}>Table {t.tableNo}</span>
                    <span style={{
                      ...styles.badge,
                      background: t.status === "Booked" ? "#3a2a0a" : "#1a3a1a",
                      color: t.status === "Booked" ? "var(--accent)" : "var(--green)",
                    }}>{t.status}</span>
                  </div>
                  <p style={styles.tableSub}>Seats: {t.seats}</p>
                  {t.customer && <p style={styles.tableCustomer}>👤 {t.customer}</p>}
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}

const styles = {
  page: { padding: "28px 32px", maxWidth: 1200, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 },
  title: { fontSize: 24, fontWeight: 700 },
  sub: { fontSize: 13, color: "var(--muted)", marginTop: 4 },
  dateBox: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 16px" },
  dateText: { fontSize: 13, color: "var(--muted)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 20 },
  analytics: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 },
  analyticsCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, fontSize: 13, lineHeight: 1.7 },
  card: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  cardIcon: { fontSize: 28 },
  cardValue: { fontSize: 28, fontWeight: 700 },
  cardLabel: { fontSize: 13, color: "var(--muted)" },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 17, fontWeight: 600, marginBottom: 14 },
  tableWrap: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "12px 16px", textAlign: "left", fontSize: 12, color: "var(--muted)", background: "var(--surface2)", borderBottom: "1px solid var(--border)" },
  tr: { borderBottom: "1px solid var(--border)" },
  td: { padding: "14px 16px", fontSize: 14 },
  orderId: { color: "var(--accent)", fontWeight: 600 },
  badge: { padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 },
  tableGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 },
  tableCard: { background: "var(--surface)", border: "1px solid", borderRadius: 10, padding: 16 },
  tableCardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  tableNo: { fontWeight: 600, fontSize: 14 },
  tableSub: { fontSize: 12, color: "var(--muted)" },
  tableCustomer: { fontSize: 12, color: "var(--text)", marginTop: 6 },
};


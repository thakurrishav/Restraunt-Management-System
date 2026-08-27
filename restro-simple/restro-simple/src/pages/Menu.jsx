import { useState } from "react";
import { menuItems } from "../data";

const categories = ["All", ...new Set(menuItems.map((m) => m.category))];

export default function Menu() {
    const [selected, setSelected] = useState("All");
    const [search, setSearch] = useState("");
    const filtered = menuItems.filter((m) =>
        (selected === "All" || m.category === selected) &&
        m.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Menu</h1>
                    <p style={styles.sub}>All available dishes and beverages</p>
                </div>
            </div>

            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 Search dishes..."
                style={styles.search}
            />

            <div style={styles.filters}>
                {categories.map((c) => (
                    <button key={c} onClick={() => setSelected(c)}
                            style={{ ...styles.filterBtn, ...(selected === c ? styles.activeFilter : {}) }}>
                        {c}
                    </button>
                ))}
            </div>

            <div style={styles.grid}>
                {filtered.length ? filtered.map((item) => (
                    <div key={item.id} style={styles.card}>
                        <div style={styles.itemIcon}>
                            {item.category === "Main Course" ? "🍛" : item.category === "Starter" ? "🍢" : item.category === "Dessert" ? "🍮" : "🥤"}
                        </div>
                        <h3 style={styles.name}>{item.name}</h3>
                        <p style={styles.category}>{item.category}</p>
                        <p style={styles.price}>₹{item.price}</p>
                    </div>
                )) : <p style={styles.noResult}>No dishes found.</p>}
            </div>
        </div>
    );
}

const styles = {
    page: { padding: "28px 32px", maxWidth: 1200, margin: "0 auto" },
    header: { marginBottom: 18 }, title: { fontSize: 24, fontWeight: 700 },
    sub: { fontSize: 13, color: "var(--muted)", marginTop: 4 },
    search: { width: "100%", maxWidth: 400, padding: "10px 12px", marginBottom: 16, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" },
    filters: { display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" },
    filterBtn: { background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 8, padding: "7px 16px", fontSize: 13 },
    activeFilter: { background: "var(--surface2)", color: "var(--text)", borderColor: "var(--accent)" },
    grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 },
    card: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, textAlign: "center" },
    itemIcon: { fontSize: 40, marginBottom: 12 }, name: { fontSize: 15, fontWeight: 600, marginBottom: 6 },
    category: { fontSize: 12, color: "var(--muted)", marginBottom: 8 }, price: { fontSize: 20, fontWeight: 700, color: "var(--accent)" },
    noResult: { color: "var(--muted)" },
};

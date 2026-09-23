import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";import {
  initialOrders,
  menuItems,
  initialTables,
  recommendations,
} from "../data";

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState(initialOrders);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({
    customer: "",
    phone: "",
    tableNo: "",
    paymentMethod: "Cash",
  });
  const [cart, setCart] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [customerHistory, setCustomerHistory] = useState(null);
  useEffect(() => {

    const fetchRecommendations = async () => {

      if (cart.length === 0) {
        setAiRecommendations([]);
        return;
      }

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/recommendations`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                cartItems: cart.map((item) => item.name),
              }),
            }
        );

        const data = await response.json();
        // added code
        console.log("Orders API Response:", data);
        if (data.success) {
          setAiRecommendations(
              data.aiRecommendations || []
          );
        }

      } catch (error) {
        console.error(error);
      }
    };

    fetchRecommendations();

  }, [cart]);
// added code
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/orders`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );

        const data = await response.json();

        if (response.ok) {
          const formattedOrders = data.orders.map((order) => ({
            _id: order._id,
            id: order._id,
            customer: order.customerName,
            //added code
            phone:order.phone,
            tableNo: order.tableNo,
            items: order.items.map((i) => i.name),
            total: order.total,
            status: order.status,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            time: new Date(order.createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

          setOrders(formattedOrders);
        }
      } catch (err) {
        console.error("Failed to load orders", err);
      }
    };

    loadOrders();
  }, []);
  const fetchCustomerHistory = async (phone) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/customer/${phone}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      const data = await response.json();

      setCustomerHistory(data);
      console.log("Customer History:", data);
    } catch (err) {
      console.error(err);
    }
  };
  const recommendedItems = [
    ...new Set(
        cart.flatMap(
            (item) => recommendations[item.name] || []
        )
    ),
  ];

  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);

    if (existing) {
      setCart(
          cart.map((c) =>
              c.id === item.id
                  ? { ...c, qty: c.qty + 1 }
                  : c
          )
      );
    } else {
      setCart([
        ...cart,
        { ...item, qty: 1 }
      ]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const tax = Math.round(total * 0.0525);
  const grandTotal = total + tax;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Add at least one item!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again. Token not found.");
        return;
      }

      const orderData = {
        customerName: form.customer,
        phone: form.phone,      // ADD THIS LINE
        tableNo: parseInt(form.tableNo),
        items: cart.map((c) => ({
          name: c.name,
          price: c.price,
          qty: c.qty,
        })),
        subtotal: total,
        tax,
        total: grandTotal,
        paymentMethod: form.paymentMethod,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to place order");
        return;
      }

      const savedOrder = {
        _id: data.order._id,
        id: data.order._id,
        customer: data.order.customerName,
        phone: data.order.phone,
        tableNo: data.order.tableNo,
        items: data.order.items.map((item) => item.name),
        total: data.order.total,
        status: data.order.status,
        time: new Date(data.order.createdAt).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        paymentMethod: data.order.paymentMethod,
        paymentStatus: data.order.paymentStatus,
      };

      setOrders([savedOrder, ...orders]);
      setCart([]);

      setForm({
        customer: "",
        phone: "",
        tableNo: "",
        paymentMethod: "Cash",
      });
      setShowForm(false);

      alert("Order placed successfully!");

      if (form.paymentMethod === "Online") {
        navigate(`/payment/${data.order._id}`);
      }
    } catch (error) {
      alert("Something went wrong while placing the order");
      console.error(error);
    }
  };
  const updateStatus = (id, status) => {
    setOrders(
        orders.map((o) =>
            o.id === id ? { ...o, status } : o
        )
    );
  };

  const handlePayOnline = (order) => {
    const orderId = order._id || order.id;

    if (!order._id) {
      alert(
          "This is a demo/local order. Stripe payment needs a real MongoDB order _id from the backend."
      );
      return;
    }

    navigate(`/payment/${orderId}`);
  };

  const generateBill = (order) => {
    const win = window.open("", "_blank");

    if (!win) {
      alert("Please allow pop-ups to generate the bill.");
      return;
    }

    const items = order.items.map((name) =>
        menuItems.find((m) => m.name === name)
    );

    const subtotal = items.reduce(
        (sum, item) => sum + (item?.price || 0),
        0
    );

    const billTax = Math.round(subtotal * 0.0525);

    const totalWithoutGST = subtotal;
    const totalWithGST = subtotal + billTax;

    win.document.write(`
      <html>
        <head>
          <title>Bill ${order.id}</title>
          <style>
            body {
              font-family: Arial;
              max-width: 500px;
              margin: 30px auto;
              padding: 20px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
            }
            .total {
              border-top: 2px solid #111;
              padding-top: 10px;
              font-weight: bold;
              font-size: 20px;
            }
            .print {
              text-align: center;
              margin-top: 25px;
            }
            @media print {
              .print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <h1 style="text-align:center">RESTRO POS</h1>
          <p style="text-align:center">Restaurant Management System</p>
          <hr />
          <p><b>Order:</b> ${order.id}</p>
          <p><b>Customer:</b> ${order.customer}</p>
          <p><b>Table:</b> ${order.tableNo}</p>

          ${items
        .map(
            (i) => `
                <div class="row">
                  <span>${i?.name || "Item"}</span>
                  <span>Rs. ${i?.price || 0}</span>
                </div>
              `
        )
        .join("")}

          <hr />
       <div class="row">
  <span>Subtotal</span>
  <span>Rs. ${subtotal}</span>
</div>

<div class="row">
  <span>GST (5.25%)</span>
  <span>Rs. ${billTax}</span>
</div>

<div class="row total">
  <span>Total With GST</span>
  <span>Rs. ${totalWithGST}</span>
</div>

<div class="row">
  <span>Total Without GST</span>
  <span>Rs. ${totalWithoutGST}</span>
</div>
          <p style="text-align:center">Thank you for visiting!</p>
          <div class="print">
            <button onclick="window.print()">Print / Save as PDF</button>
          </div>
        </body>
      </html>
    `);

    win.document.close();
  };

  const filtered =
      filter === "All"
          ? orders
          : orders.filter((o) => o.status === filter);

  return (
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Order Management</h1>
            <p style={styles.sub}>Place and manage customer orders</p>
          </div>

          <button
              onClick={() => setShowForm(!showForm)}
              style={styles.addBtn}
          >
            + New Order
          </button>
        </div>

        {showForm && (
            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>Place New Order</h3>

              <form onSubmit={handlePlaceOrder}>
                <div style={styles.field}>
                  <label style={styles.label}>Customer Name</label>
                  <input
                      value={form.customer}
                      onChange={(e) =>
                          setForm({ ...form, customer: e.target.value })
                      }
                      placeholder="Customer name"
                      style={styles.input}
                      required
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Phone Number</label>

                  <input
                      value={form.phone}
                      onChange={(e) => {
                        const phone = e.target.value;

                        setForm({...form, phone});

                        if (phone.length === 10) {
                          fetchCustomerHistory(phone);
                        }
                      }}
                      placeholder="9876543210"
                      style={styles.input}
                      required
                  />

                </div>


                {customerHistory && (
                    <div
                        style={{
                          background: "#222",
                          padding: "10px",
                          borderRadius: "8px",
                          marginTop: "10px",
                        }}
                    >
                      <h4>Customer History</h4>

                      <p>Visits: {customerHistory.visitCount}</p>

                      <p>Total Spent: ₹{customerHistory.totalSpent}</p>

                      <p>Favourite Items:</p>

                      {customerHistory.favoriteItems?.map((item, index) => (
                          <div key={index}>
                            {item[0]} ({item[1]} orders)
                          </div>
                      ))}
                    </div>
                )}

                <div style={styles.field}>
                  <label style={styles.label}>Table Number</label>


                  <select
                      value={form.tableNo}
                      onChange={(e) =>
                          setForm({ ...form, tableNo: e.target.value })
                      }
                      style={styles.input}
                      required
                  >
                    <option value="">Select table</option>
                    {initialTables
                        .filter((t) => t.status === "Available")
                        .map((t) => (
                            <option key={t.id} value={t.tableNo}>
                              Table {t.tableNo} ({t.seats} seats)
                            </option>
                        ))}
                  </select>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Payment Method</label>
                  <select
                      value={form.paymentMethod}
                      onChange={(e) =>
                          setForm({ ...form, paymentMethod: e.target.value })
                      }
                      style={styles.input}
                  >
                    <option>Cash</option>
                    <option>Online</option>
                  </select>
                </div>


                <h4
                    style={{
                      ...styles.label,
                      marginTop: 16,
                      marginBottom: 10,
                    }}
                >
                  Select Items
                </h4>

                <div style={styles.menuGrid}>
                  {menuItems.map((item) => (
                      <div key={item.id} style={styles.menuItem}>
                        <div>
                          <p style={styles.menuName}>{item.name}</p>
                          <p style={styles.menuPrice}>Rs. {item.price}</p>
                          <p style={styles.menuCat}>{item.category}</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => addToCart(item)}
                            style={styles.addItemBtn}
                        >
                          +
                        </button>
                      </div>
                  ))}
                </div>

                {cart.length > 0 && (
                    <div style={styles.cartBox}>
                      <h4 style={styles.cartTitle}>Cart</h4>

                      {cart.map((c) => (
                          <div key={c.id} style={styles.cartRow}>
                    <span>
                      {c.name} x{c.qty}
                    </span>
                            <span>Rs. {c.price * c.qty}</span>
                            <button
                                type="button"
                                onClick={() => removeFromCart(c.id)}
                                style={styles.removeBtn}
                            >
                              X
                            </button>
                          </div>
                      ))}
                      {aiRecommendations.length > 0 && (
                          <div style={{ marginTop: "15px" }}>
                            <h4>✨ AI Recommendations</h4>

                            {aiRecommendations.map((item, index) => (
                                <div key={index}>
                                  <strong>{item.item}</strong>
                                  <div>{item.reason}</div>
                                </div>
                            ))}
                          </div>
                      )}

                      <div style={styles.cartTotals}>
                        <p style={styles.cartLine}>
                          <span>Subtotal</span>
                          <span>Rs. {total}</span>
                        </p>

                        <p style={styles.cartLine}>
                          <span>Tax (5.25%)</span>
                          <span>Rs. {tax}</span>
                        </p>

                        <p
                            style={{
                              ...styles.cartLine,
                              fontWeight: 700,
                              color: "var(--accent)",
                            }}
                        >
                          <span>Grand Total</span>
                          <span>Rs. {grandTotal}</span>
                        </p>
                      </div>
                    </div>
                )}
                {recommendedItems.length > 0 && (
                    <div
                        style={{
                          background: "var(--surface2)",
                          borderRadius: 10,
                          padding: 16,
                          marginBottom: 16,
                        }}
                    >
                      <h4
                          style={{
                            marginBottom: 10,
                            color: "var(--accent)",
                          }}
                      >
                        Recommended Items
                      </h4>

                      <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 10,
                          }}
                      >
                        {recommendedItems.map((name) => {
                          const item = menuItems.find(
                              (m) => m.name === name
                          );

                          if (!item) return null;

                          return (
                              <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => addToCart(item)}
                                  style={{
                                    background: "var(--accent)",
                                    color: "#111",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "8px 14px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                              >
                                + {item.name} (₹{item.price})
                              </button>
                          );
                        })}
                      </div>
                    </div>
                )}
                <div style={styles.formActions}>
                  <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      style={styles.cancelBtn}
                  >
                    Cancel
                  </button>

                  <button type="submit" style={styles.placeBtn}>
                    Place Order
                  </button>
                </div>
              </form>
            </div>
        )}

        <div style={styles.filters}>
          {["All", "In Progress", "Ready"].map((f) => (
              <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    ...styles.filterBtn,
                    ...(filter === f ? styles.activeFilter : {}),
                  }}
              >
                {f}
              </button>
          ))}

          <span style={styles.countBadge}>{filtered.length} orders</span>
        </div>

        <div style={styles.ordersGrid}>
          {filtered.map((order) => (
              <div key={order._id || order.id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <span style={styles.orderId}>#{order._id || order.id}</span>

                  <span
                      style={{
                        ...styles.badge,
                        background:
                            order.status === "Ready" ? "#1a3a1a" : "#3a2a0a",
                        color:
                            order.status === "Ready"
                                ? "var(--green)"
                                : "var(--accent)",
                      }}
                  >
                {order.status}
              </span>
                </div>

                <h3 style={styles.orderCustomer}>{order.customer}</h3>

                <p style={styles.orderInfo}>
                  📞 {order.phone}
                </p>
                <p style={styles.orderInfo}>
                  Table {order.tableNo} · {order.time}
                </p>

                <p style={styles.orderInfo}>{order.items.join(", ")}</p>

                <div style={styles.orderFooter}>
                  <span style={styles.orderTotal}>Rs. {order.total}</span>

                  <select
                      value={order.status}
                      onChange={(e) =>
                          updateStatus(order.id, e.target.value)
                      }
                      style={styles.statusSelect}
                  >
                    <option>In Progress</option>
                    <option>Ready</option>
                  </select>

                  <button
                      onClick={() => generateBill(order)}
                      style={styles.billBtn}
                  >
                    Bill
                  </button>

                  <button
                      onClick={() => handlePayOnline(order)}
                      style={styles.payBtn}
                  >
                    Pay Online
                  </button>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}


const styles = {
  page: { padding: "28px 32px", maxWidth: 1200, margin: "0 auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: { fontSize: 24, fontWeight: 700 },
  sub: { fontSize: 13, color: "var(--muted)", marginTop: 4 },
  addBtn: {
    background: "var(--accent)",
    color: "#111",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  formCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  formTitle: { fontSize: 16, fontWeight: 600, marginBottom: 16 },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 16,
    marginBottom: 4,
  },
  field: {},
  label: {
    display: "block",
    fontSize: 12,
    color: "var(--muted)",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "10px 12px",
    color: "var(--text)",
    fontSize: 14,
    outline: "none",
  },
  menuGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
    marginBottom: 16,
  },
  menuItem: {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "10px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuName: { fontSize: 13, fontWeight: 500, marginBottom: 2 },
  menuPrice: {
    fontSize: 13,
    color: "var(--accent)",
    fontWeight: 600,
  },
  menuCat: { fontSize: 11, color: "var(--muted)" },
  addItemBtn: {
    background: "var(--accent)",
    color: "#111",
    border: "none",
    borderRadius: 6,
    width: 28,
    height: 28,
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1,
    cursor: "pointer",
  },
  cartBox: {
    background: "var(--surface2)",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  cartTitle: { fontSize: 14, fontWeight: 600, marginBottom: 10 },
  cartRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 13,
    padding: "6px 0",
    borderBottom: "1px solid var(--border)",
  },
  removeBtn: {
    background: "none",
    border: "none",
    color: "var(--red)",
    fontSize: 14,
    cursor: "pointer",
  },
  cartTotals: { marginTop: 10 },
  cartLine: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    padding: "4px 0",
    color: "var(--muted)",
  },
  formActions: {
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
    marginTop: 4,
  },
  cancelBtn: {
    background: "none",
    border: "1px solid var(--border)",
    color: "var(--muted)",
    borderRadius: 8,
    padding: "10px 24px",
    fontSize: 14,
    cursor: "pointer",
  },
  placeBtn: {
    background: "var(--accent)",
    color: "#111",
    border: "none",
    borderRadius: 8,
    padding: "10px 28px",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  filters: {
    display: "flex",
    gap: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  filterBtn: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    color: "var(--muted)",
    borderRadius: 8,
    padding: "7px 16px",
    fontSize: 13,
    cursor: "pointer",
  },
  activeFilter: {
    background: "var(--surface2)",
    color: "var(--text)",
    borderColor: "var(--accent)",
  },
  countBadge: {
    marginLeft: "auto",
    fontSize: 13,
    color: "var(--muted)",
  },
  ordersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
  },
  orderCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 18,
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  orderId: {
    fontSize: 13,
    color: "var(--accent)",
    fontWeight: 600,
  },
  badge: {
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
  },
  orderCustomer: { fontSize: 16, fontWeight: 600, marginBottom: 6 },
  orderInfo: {
    fontSize: 13,
    color: "var(--muted)",
    marginBottom: 4,
  },
  orderFooter: {
    display: "flex",
    gap: 8,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    borderTop: "1px solid var(--border)",
    flexWrap: "wrap",
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 700,
    color: "var(--accent)",
  },
  statusSelect: {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 13,
    outline: "none",
  },
  billBtn: {
    background: "var(--accent)",
    color: "#111",
    border: "none",
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  payBtn: {
    background: "#22c55e",
    color: "#111",
    border: "none",
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
};
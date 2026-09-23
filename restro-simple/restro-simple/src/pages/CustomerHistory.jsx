import { useState } from "react";

export default function CustomerHistory() {
    const [phone, setPhone] = useState("");
    const [data, setData] = useState(null);

    const searchCustomer = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/orders/customer/${phone}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const result = await res.json();
        setData(result);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Customer History</h1>

            <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
            />

            <button onClick={searchCustomer}>
                Search
            </button>

            {data && (
                <>
                    <h2>{data.customerName}</h2>

                    <p>Phone: {data.phone}</p>

                    <p>Visits: {data.visitCount}</p>

                    <p>Total Spent: ₹{data.totalSpent}</p>

                    <h3>Favorite Items</h3>

                    {data.favoriteItems.map((item) => (
                        <p key={item[0]}>
                            {item[0]} ({item[1]})
                        </p>
                    ))}

                    <h3>Previous Orders</h3>

                    {data.orders.map((order) => (
                        <div
                            key={order._id}
                            style={{
                                border: "1px solid gray",
                                margin: "10px",
                                padding: "10px",
                            }}
                        >
                            <p>
                                Date:
                                {new Date(
                                    order.createdAt
                                ).toLocaleString()}
                            </p>

                            <p>Total: ₹{order.total}</p>

                            {order.items.map((item) => (
                                <p key={item.name}>
                                    {item.name} x {item.qty}
                                </p>
                            ))}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}
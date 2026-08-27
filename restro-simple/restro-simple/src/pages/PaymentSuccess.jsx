import { useEffect, useState } from "react";

export default function PaymentSuccess() {
    const [status, setStatus] = useState("Checking payment...");

    useEffect(() => {
        const paymentIntentId = new URLSearchParams(window.location.search).get("payment_intent");
        const token = localStorage.getItem("token");

        fetch(`${import.meta.env.VITE_API_URL}/api/payments/verify/${paymentIntentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setStatus(data.status === "succeeded" ? "Payment successful!" : `Payment status: ${data.status}`))
            .catch(() => setStatus("Could not verify payment"));
    }, []);

    return <h2>{status}</h2>;
}
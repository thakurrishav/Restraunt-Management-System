import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QRCode from "qrcode";

export default function Payment() {
    const { orderId } = useParams();

    const [rzp, setRzp] = useState(null);
    const [qrCode, setQrCode] = useState("");
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        const startPayment = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/payments/create-order`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ orderId }),
                    }
                );

                const data = await response.json();

                setAmount(data.amount / 100);

                // Demo QR Code (replace with your own UPI ID)
                const upiUrl = `upi://pay?pa=thakurrishav665@okicici&pn=Rishav%20Thakur&am=${
                    data.amount / 100
                }&cu=INR`;
                console.log("UPI URL:", upiUrl);
                const qrImage = await QRCode.toDataURL(upiUrl);
                setQrCode(qrImage);

                const options = {
                    key: data.key,
                    amount: data.amount,
                    currency: data.currency,
                    order_id: data.razorpayOrderId,

                    name: "Restaurant Management System",

                    handler: async function (response) {
                        const verifyRes = await fetch(
                            `${import.meta.env.VITE_API_URL}/api/payments/verify`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                    ...response,
                                    orderId,
                                }),
                            }
                        );

                        const verifyData =
                            await verifyRes.json();

                        if (verifyData.success) {
                            alert("Payment Successful");
                            window.location.href =
                                "/payment-success";
                        } else {
                            alert(
                                "Payment Verification Failed"
                            );
                        }
                    },

                    theme: {
                        color: "#3399cc",
                    },
                };

                const razorpay = new window.Razorpay(options);
                setRzp(razorpay);
            } catch (error) {
                console.error(error);
            }
        };

        startPayment();
    }, [orderId]);

    return (
        <div
            style={{
                textAlign: "center",
                padding: "30px",
            }}
        >
            <h1>Payment</h1>

            <h2>Order ID: {orderId}</h2>

            <h3>Amount: ₹{amount}</h3>

            {qrCode && (
                <div>
                    <img
                        src={qrCode}
                        alt="UPI QR Code"
                        width="250"
                    />
                </div>
            )}

            <p>
                Scan the QR code using Google Pay,
                PhonePe, Paytm, or any UPI app.
            </p>

            <button
                onClick={() => rzp?.open()}
                disabled={!rzp}
                style={{
                    padding: "12px 24px",
                    fontSize: "16px",
                    cursor: "pointer",
                }}
            >
                Pay with Razorpay
            </button>
        </div>
    );
}
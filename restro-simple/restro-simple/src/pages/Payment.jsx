import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Payment() {
    const { orderId } = useParams();

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

                const razorpay = new window.Razorpay(
                    options
                );

                razorpay.open();
            } catch (error) {
                console.error(error);
            }
        };

        startPayment();
    }, [orderId]);

    return <p>Opening Razorpay...</p>;
}
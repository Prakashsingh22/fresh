import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/button";
import OrderSuccessModal from "../components/OrderSuccessModal";
import api from "../api/axios";
import "./PaymentPage.css";

const PaymentPage = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [shippingAddress, setShippingAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [processing, setProcessing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState(null);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const address = JSON.parse(localStorage.getItem("verifiedAddress"));

        // 🚫 No cart → go back to products
        if (cart.length === 0) {
            navigate("/search/product");
            return;
        }

        // 🚫 No address → verify again
        if (!address) {
            navigate("/address-verification");
            return;
        }

        setItems(cart);
        setShippingAddress(address);
    }, [navigate]);


    const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handlePayment = async () => {
        if (!paymentMethod) {
            alert("Please select a payment method");
            return;
        }

        setProcessing(true);
        try {
            await new Promise((r) => setTimeout(r, 1500));
            await placeOrder();
        } catch (err) {
            alert("Payment failed");
            setProcessing(false);
        }
    };

    const placeOrder = async () => {
        const formattedAddress = [
            shippingAddress.addressLine1,
            shippingAddress.addressLine2,
            shippingAddress.addressLine3,
            shippingAddress.city,
            shippingAddress.state
        ].filter(Boolean).join(", ") + ` - ${shippingAddress.pinCode}`;

        const payload = {
            paymentMethod,
            shippingAddress: formattedAddress,
            items: items.map(i => ({
                pid: i.pid,
                price: i.price,
                quantity: i.quantity
            }))
        };

        const res = await api.post("/order", payload);

        localStorage.removeItem("cart");
        setCreatedOrderId(res.data.orderId);
        setProcessing(false);
        setShowSuccessModal(true);
    };


    if (!shippingAddress) return null;

    return (
        <div className="payment-page">

            {showSuccessModal && (
                <OrderSuccessModal
                    orderId={createdOrderId}
                    onClose={() => setShowSuccessModal(false)}
                />
            )}
            <div className="main-content-padding">
                <div className="payment-container">
                    {/* BACK BUTTON */}
                    <button
                        className="pp-back-btn"
                        onClick={() => navigate("/orderitems")}

                    >
                        ← Back
                    </button>

                    <h1 className="pp-title">Secure Payment</h1>

                    {/* SUMMARY */}
                    <div className="summary-section">
                        <div className="summary-row">
                            <span>Total Amount</span>
                            <span className="amount">₹{totalAmount}</span>
                        </div>
                        <div className="address-preview">
                            <strong>Deliver to:</strong>{" "}
                            {shippingAddress.addressLine1},{shippingAddress.addressLine2},{shippingAddress.addressLine3},{shippingAddress.city}
                        </div>
                    </div>

                    {/* PAYMENT OPTIONS */}
                    <div className="payment-options">
                        <label
                            className={`option-card ${paymentMethod === "CARD" ? "selected" : ""
                                }`}
                        >
                            <input
                                type="radio"
                                name="pay"
                                value="CARD"
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <div className="details">
                                <span className="title">Card</span>
                                <span className="desc">Visa, Mastercard, RuPay</span>
                            </div>
                        </label>

                        <label
                            className={`option-card ${paymentMethod === "UPI" ? "selected" : ""
                                }`}
                        >
                            <input
                                type="radio"
                                name="pay"
                                value="UPI"
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <div className="details">
                                <span className="title">UPI</span>
                                <span className="desc">GPay, PhonePe, Paytm</span>
                            </div>
                        </label>

                        <label
                            className={`option-card ${paymentMethod === "COD" ? "selected" : ""
                                }`}
                        >
                            <input
                                type="radio"
                                name="pay"
                                value="COD"
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <div className="details">
                                <span className="title">Cash on Delivery</span>
                                <span className="desc">Pay at doorstep</span>
                            </div>
                        </label>
                    </div>

                    {/* CARD DETAILS */}
                    {paymentMethod === "CARD" && (
                        <div className="pp-card-details">
                            <input type="text" placeholder="Card Number" />
                            <div className="pp-card-row">
                                <input type="text" placeholder="MM / YY" />
                                <input type="password" placeholder="CVV" />
                            </div>
                            <input type="text" placeholder="Card Holder Name" />
                        </div>
                    )}

                    {/* UPI DETAILS */}
                    {paymentMethod === "UPI" && (
                        <div className="pp-upi-box">
                            <p>Scan & Pay with UPI</p>
                            <div className="upi-icons">
                                <img src="/gpay.png" alt="GPay" />
                                <img src="/phonepe.png" alt="PhonePe" />
                                <img src="/paytm.png" alt="Paytm" />
                            </div>
                            <div className="upi-qr">QR CODE</div>
                        </div>
                    )}

                    <Button
                        className="pp-primary-btn"
                        onClick={handlePayment}
                        disabled={processing}
                    >
                        {processing ? "Processing..." : `Pay ₹${totalAmount}`}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;

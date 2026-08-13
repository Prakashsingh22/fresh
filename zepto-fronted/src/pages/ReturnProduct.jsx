import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "sonner";
import "./ReturnProduct.css";

const ReturnProduct = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [returnReason, setReturnReason] = useState("");
    const [comments, setComments] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const reasons = [
        "Select a reason",
        "Damaged item",
        "Defective/Does not work",
        "Wrong item received",
        "Better price elsewhere",
        "Item arrived too late",
        "Incompatible or not useful",
        "No longer needed",
        "Performance or quality not adequate",
        "Description on website was not accurate"
    ];

    useEffect(() => {
        api.get(`/orders/${orderId}`)
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(() => {
                toast.error("Order not found");
                navigate("/account/orders");
            });
    }, [orderId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!returnReason || returnReason.trim() === "") {
            return toast.error("Please select a valid reason for return from the dropdown");
        }

        try {
            setSubmitting(true);
            await api.post(`/orders/${orderId}/return`, {
                reason: returnReason,
                comments: comments
            });

            toast.success("Return request submitted successfully");
            navigate("/account/orders");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit return request");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading-container">Loading order details...</div>;

    const { order, items } = data;

    return (
        <div className="return-page">
            <div className="return-container">
                <header className="return-header">
                    <h1>Return Center</h1>
                    <p>Order #{order.id.slice(0, 8)} | Placed on {new Date(order.orderPlacedTime).toLocaleDateString()}</p>
                </header>

                <form className="return-form" onSubmit={handleSubmit}>
                    <div className="return-section">
                        <h2>1. Items to return</h2>
                        <div className="return-items-list">
                            {items.map(item => (
                                <div key={item.pid} className="return-item-card">
                                    <img src={item.productImage || "https://placehold.co/80"} alt={item.productName} />
                                    <div className="item-details">
                                        <h3>{item.productName}</h3>
                                        <p>Qty: {item.quantity} | Price: ₹{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="return-section">
                        <h2>2. Why are you returning this?</h2>
                        <div className="form-group">
                            <label htmlFor="reason">Reason for return</label>
                            <select
                                id="reason"
                                value={returnReason}
                                onChange={(e) => setReturnReason(e.target.value)}
                                required
                            >
                                {reasons.map((r, idx) => (
                                    <option key={r} value={idx === 0 ? "" : r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="comments">Comments (optional)</label>
                            <textarea
                                id="comments"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Please provide more details about your return request..."
                            />
                        </div>
                    </div>

                    <div className="return-actions">
                        <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
                        <button type="submit" className="submit-btn" disabled={submitting}>
                            {submitting ? "Submitting..." : "Submit Return Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReturnProduct;

import React from "react";
import "./OrderSuccessModal.css";
import { useNavigate } from "react-router-dom";

const OrderSuccessModal = ({ orderId, onClose }) => {
    const navigate = useNavigate();

    return (
        <div className="order-success-modal-overlay">
            <div className="order-success-modal">
                <div className="success-icon-container">
                    <span className="success-icon">✓</span>
                </div>
                <h2>Order Placed!</h2>
                <p>Your order has been placed successfully.</p>

                <div className="modal-actions">
                    <button
                        className="view-order-btn"
                        onClick={() => navigate(`/account/orders/${orderId}`)}
                    >
                        View Order Details
                    </button>

                    <button
                        className="home-btn"
                        onClick={() => navigate("/")}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessModal;

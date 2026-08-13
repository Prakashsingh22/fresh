import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Invoice from "../components/Invoice";
import "./AdminOrders.css";
import { toast } from "sonner";

const AdminOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [printData, setPrintData] = useState(null);
    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/orders/all");
            // Sort orders by date descending (newest first)
            const sortedOrders = res.data.sort(
                (a, b) => new Date(b.orderPlacedTime) - new Date(a.orderPlacedTime)
            );
            setOrders(sortedOrders);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status?status=${newStatus}`);
            toast.success(`Order marked as ${newStatus}`);
            fetchOrders(); // Refresh list
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Failed to update order status");
        }
    };

    const getNextStatus = (currentStatus) => {
        switch (currentStatus) {
            case "PLACED":
                return "PACKED";
            case "PACKED":
                return "DISPATCHED";
            case "DISPATCHED":
                return "DELIVERED";
            default:
                return null;
        }
    };

    const handlePrintBill = async (orderId) => {
        try {
            const res = await api.get(`/orders/${orderId}`);
            setPrintData(res.data);
            setTimeout(() => {
                window.print();
            }, 500);
        } catch (error) {
            toast.error("Failed to fetch order details for printing");
        }
    };

    const filteredOrders = orders.filter(
        (order) =>
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-orders-page">
            <header className="admin-orders-page-header">
                <div className="header-content">
                    <div className="logo-section">
                        <img src="/logo1.png" alt="FreshCart Logo" />
                    </div>
                    <button
                        className="back-btn"
                        onClick={() => navigate(-1)}
                    >
                        ←
                    </button>
                    <div className="header-text">
                        <h1>Order Management</h1>
                    </div>
                </div>
            </header>

            <div className="main-content-padding">
                <div className="admin-orders-container">
                    <div className="admin-orders-controls">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search Order ID or Status..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading">Loading orders...</div>
                    ) : (
                        <div className="orders-table-container">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Date</th>
                                        <th>Consumer</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="no-data">
                                                No orders found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map((order) => {
                                            const nextStatus = getNextStatus(order.status);
                                            return (
                                                <tr key={order.id}>
                                                    <td title={order.id}>{order.id.slice(0, 8)}...</td>
                                                    <td>
                                                        {new Date(order.orderPlacedTime).toLocaleString()}
                                                    </td>
                                                    <td>{order.consumer?.userName || "N/A"}</td>
                                                    <td>₹{order.totalAmount || "0"}</td>
                                                    <td>
                                                        <span
                                                            className={`status-badge ${order.status.toLowerCase()}`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="admin-actions">
                                                            <button
                                                                className="action-btn view"
                                                                onClick={() => navigate(`/account/orders/${order.id}`)}
                                                            >
                                                                View Details
                                                            </button>

                                                            {(order.status === "DISPATCHED" || order.status === "DELIVERED") && (
                                                                <button
                                                                    className="action-btn print"
                                                                    onClick={() => handlePrintBill(order.id)}
                                                                >
                                                                    Print Bill
                                                                </button>
                                                            )}

                                                            {nextStatus && (
                                                                <button
                                                                    className={`action-btn mark ${nextStatus.toLowerCase()}`}
                                                                    onClick={() => updateStatus(order.id, nextStatus)}
                                                                >
                                                                    Mark {nextStatus}
                                                                </button>
                                                            )}
                                                        </div>
                                                        {order.status === "CANCELLED" && (
                                                            <span className="cancelled-text">Cancelled</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            {printData && (
                <Invoice
                    order={printData.order}
                    items={printData.items}
                    totalPrice={printData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                />
            )}
        </div>
    );
};

export default AdminOrders;

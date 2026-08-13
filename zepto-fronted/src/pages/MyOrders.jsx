import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    api.get("/orders/my")
      .then(res => setOrders(res.data))
      .catch(() => alert("Failed to load orders"));
  };

  const handleCancelClick = (e, order) => {
    e.stopPropagation(); // prevent card click
    setSelectedOrder(order);
    setCancelReason("");
    setShowCancelModal(true);
  };

  const submitCancel = async () => {
    if (!cancelReason.trim()) return alert("Please provide a reason");
    try {
      await api.post(`/orders/${selectedOrder.id}/cancel`, { reason: cancelReason });
      alert("Order cancelled successfully");
      setShowCancelModal(false);
      fetchOrders(); // refresh list
    } catch (err) {
      alert("Failed to cancel order: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="my-orders-page">
      <Header />
      <div className="orders-container">
        <div className="my-orders-header">
          <h1>📦 My Orders</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by Order ID or Status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="order-search-input"
            />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found matching "{searchTerm}"</p>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="order-card"
                onClick={() => navigate(`/account/orders/${order.id}`)}
              >
                <div className="order-card-header">
                  <div>
                    <strong>Order #{order.id.slice(0, 8)}...</strong>
                    <span className="order-date">
                      {new Date(order.orderPlacedTime).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-card-footer">
                  <p>Payment: {order.paymentMethod}</p>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {
                      ['PLACED', 'PACKED'].includes(order.status) && (
                        <button
                          className="cancel-btn-sm"
                          onClick={(e) => handleCancelClick(e, order)}
                        >
                          Cancel Order
                        </button>
                      )
                    }
                    {
                      order.status === 'DELIVERED' && (
                        <button
                          className="return-btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/account/orders/${order.id}/return`);
                          }}
                        >
                          Return Items
                        </button>
                      )
                    }
                    <span className="view-details-link">View Details →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Cancel Order</h3>
              <p>Are you sure you want to cancel this order? Please tell us why:</p>
              <textarea
                className="cancel-reason-input"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation..."
              />
              <div className="modal-actions">
                <button onClick={() => setShowCancelModal(false)}>Close</button>
                <button className="confirm-cancel-btn" onClick={submitCancel}>Confirm Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

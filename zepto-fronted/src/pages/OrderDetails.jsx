import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import "./OrderDetails.css";
import Invoice from "../components/Invoice";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    api.get(`/orders/${orderId}`)
      .then(res => setData(res.data))
      .catch(() => alert("Order not found"));
  }, [orderId]);

  const formatImagePath = (path) => {
    if (!path) return "https://placehold.co/100x100?text=No+Image";
    if (path.toString().startsWith("http")) return path;
    try {
      let normalized = decodeURI(path.toString()).replace(/\\/g, "/");
      const publicSearch = "/public/";
      const idx = normalized.toLowerCase().indexOf(publicSearch);
      if (idx !== -1) {
        normalized = normalized.substring(idx + publicSearch.length);
      } else if (normalized.toLowerCase().startsWith("public/")) {
        normalized = normalized.substring(7);
      }
      let cleanPath = normalized.replace(/^\/+/, "");
      return encodeURI(`/${cleanPath}`);
    } catch (e) {
      let cleanPath = path.toString().replace(/\\/g, "/").replace(/^\/+/, "");
      return encodeURI(`/${cleanPath}`);
    }
  };

  if (!data) return <div className="loading">Loading...</div>;

  const { order, items } = data;
  const steps = ["PLACED", "PACKED", "DISPATCHED", "DELIVERED"];
  const activeIndex = steps.indexOf(order.status);

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="order-details-page">

      <div className="main-content-padding">
        <div className="order-details-content">
          <button className="od-back-btn" onClick={() => navigate(-1)}>← Back to Orders</button>

          <div className="od-header">
            <h1>Order #{order.id.slice(0, 8)}</h1>
            <span className={`status-badge large ${order.status.toLowerCase()}`}>
              {order.status}
            </span>
            {order.status === 'DELIVERED' && (
              <button
                className="od-return-btn"
                onClick={() => navigate(`/account/orders/${order.id}/return`)}
              >
                Return Items
              </button>
            )}
            <div className="od-invoice-actions">
              <button className="od-view-invoice-btn" onClick={() => setShowInvoice(true)}>
                View Invoice
              </button>
              <button className="od-print-invoice-btn" onClick={() => window.print()}>
                Print Invoice
              </button>
            </div>
          </div>

          {/* STATUS TIMELINE */}
          <div className="status-timeline-container">
            <div className="status-progress-bar">
              <div
                className="status-progress-fill"
                style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
            <div className="status-steps">
              {steps.map((s, i) => (
                <div
                  key={s}
                  className={`timeline-step ${i <= activeIndex ? "active" : ""}`}
                >
                  <div className="step-dot">{i <= activeIndex ? "✓" : i + 1}</div>
                  <span className="step-label">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="od-content-grid">
            {/* ITEMS LIST */}
            <div className="od-section items-section">
              <h2>Items in this Order ({items.length})</h2>
              <div className="od-items-list">
                {items.map((item) => (
                  <div key={item.pid} className="od-item-card">
                    <img
                      src={formatImagePath(item.productImage)}
                      alt={item.productName}
                      className="od-item-image"
                      onError={(e) => { e.target.src = "https://placehold.co/100x100?text=No+Image"; }}
                    />
                    <div className="od-item-info">
                      <h3>{item.productName}</h3>
                      <p>Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <div className="od-item-total">
                      ₹{item.quantity * item.price}
                    </div>
                  </div>
                ))}
              </div>
              <div className="od-total-row">
                <span>Total Amount</span>
                <strong>₹{totalPrice}</strong>
              </div>
            </div>

            {/* ORDER INFO */}
            <div className="od-section info-section">
              <h2>Delivery Details</h2>
              <div className="info-group">
                <label>Shipping Address</label>
                <p>{order.shippingAddress}</p>
              </div>
              <div className="info-group">
                <label>Payment Method</label>
                <p>{order.paymentMethod}</p>
              </div>
              <div className="info-group">
                <label>Order Date</label>
                <p>{new Date(order.orderPlacedTime).toLocaleString()}</p>
              </div>
              <div className="info-group">
                <label>Estimated Delivery</label>
                <p className="delivery-time">Within 48 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Invoice
        order={order}
        items={items}
        totalPrice={totalPrice}
        isPreview={showInvoice}
        onClose={() => setShowInvoice(false)}
      />
    </div>
  );
};

export default OrderDetails;

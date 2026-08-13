import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/button";
import "./OrderItems.css";

const OrderItems = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setItems(cart);
  }, []);

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

  const updateQty = (pid, change) => {
    const updated = items.map(item =>
      item.pid === pid
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdate"));
  };

  const removeItem = (pid) => {
    const updated = items.filter(item => item.pid !== pid);
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdate"));
  };

  // ✅ FIXED TOTAL CALCULATIONS
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalItems = items.length;

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Cart is empty");
      return;
    }
    navigate("/address-verification");
  };

  return (
    <div className="order-items-page">

      <div className="main-content-padding">
        <div className="order-table-wrapper">
          <button
            className="oi-back-btn"
            onClick={() => navigate("/search/product")}
          >
            ← Back to Search
          </button>

          <div className="order-logo-table">
            <img src="/logo1.png" alt="FreshCart Logo" />
            <span>FreshCart</span>
          </div>
          <h1>Order Items Details</h1>

          {items.length === 0 ? (
            <p className="empty-text">Your cart is empty</p>
          ) : (
            <table className="order-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {items.map(item => (
                  <tr key={item.pid}>
                    <td className="product-cell">
                      <img
                        src={formatImagePath(item.image)}
                        alt={item.name}
                        onError={(e) => { e.target.src = "https://placehold.co/100x100?text=No+Image"; }}
                      />
                      <div className="product-info-cell">
                        <span>{item.name}</span>
                        {item.weight && <span className="item-weight">({item.weight})</span>}
                      </div>
                    </td>

                    <td>₹{item.price}</td>

                    <td>
                      <div className="qty-controls">
                        <button onClick={() => updateQty(item.pid, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQty(item.pid, 1)}>+</button>
                      </div>
                    </td>

                    <td>₹{item.price * item.quantity}</td>

                    <td>
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.pid)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* ================= FOOTER SUMMARY ================= */}
          {items.length > 0 && (
            <div className="order-footer">
              <div className="order-summary">
                <p><strong>Total Items:</strong> {totalItems}</p>
                <p><strong>Total Quantity:</strong> {totalQuantity}</p>
                <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
              </div>

              <Button
                onClick={handleCheckout}
              >
                Proceed  →
              </Button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OrderItems;

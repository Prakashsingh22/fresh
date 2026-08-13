import React from 'react';
import './Invoice.css';

const Invoice = ({ order, items, totalPrice, isPreview, onClose }) => {
    if (!order || !items) return null;

    // Helper to format warehouse address
    const getWarehouseAddress = () => {
        if (!order.wareHouse?.location) return "Building No. 5, Tech Park, Industrial Area";
        const loc = order.wareHouse.location;
        return [loc.addressLine1, loc.addressLine2, loc.addressLine3]
            .filter(line => line && line.trim() !== "")
            .join(", ");
    };

    return (
        <div className={`invoice-wrapper ${isPreview ? 'preview-mode' : ''}`}>
            {isPreview && (
                <div className="preview-overlay" onClick={onClose}>
                    <div className="preview-actions">
                        <button className="preview-print-btn" onClick={() => window.print()}>Print Invoice</button>
                        <button className="preview-close-btn" onClick={onClose}>Close</button>
                    </div>
                </div>
            )}
            <div className="invoice-container flipkart-style" onClick={(e) => isPreview && e.stopPropagation()}>
                <div className="invoice-banner">
                    <div className="banner-logo">
                        <h1 className="brand-title">FreshCart</h1>
                    </div>
                    <div className="banner-text">
                        <h2>Tax Invoice</h2>
                        <p>(Original for Recipient)</p>
                    </div>
                </div>

                <div className="address-section">
                    <div className="address-block">
                        <h3 className="section-label">Sold By:</h3>
                        <div className="address-content">
                            <p className="entity-name">{order.wareHouse?.wareHouseName || "FreshCart Retail Private Limited"}</p>
                            <p>Warehouse: {order.wareHouse?.wareHouseName || "Central Hub"}</p>
                            <p>{getWarehouseAddress()}</p>
                            <p>{order.wareHouse?.location?.city || ""}, {order.wareHouse?.location?.state || ""} - {order.wareHouse?.location?.pinCode || ""}</p>
                            {order.wareHouse?.contactNumber && <p><strong>Contact:</strong> {order.wareHouse.contactNumber}</p>}
                            {order.wareHouse?.email && <p><strong>Email:</strong> {order.wareHouse.email}</p>}
                            <p><strong>GSTIN:</strong> 29AAAAA0000A1Z5</p>
                        </div>
                    </div>
                    <div className="address-block text-right">
                        <h3 className="section-label">Shipping Address:</h3>
                        <div className="address-content">
                            <p className="entity-name">{order.consumer?.userName || `${order.consumer?.firstName || ""} ${order.consumer?.lastName || ""}`}</p>
                            <p>{order.shippingAddress}</p>
                        </div>
                    </div>
                </div>

                <div className="order-meta-info">
                    <div className="meta-row">
                        <span className="meta-label">Order ID:</span>
                        <span className="meta-value">{order.id}</span>
                    </div>
                    <div className="meta-row">
                        <span className="meta-label">Order Date:</span>
                        <span className="meta-value">{new Date(order.orderPlacedTime).toLocaleDateString()}</span>
                    </div>
                    <div className="meta-row">
                        <span className="meta-label">Invoice Date:</span>
                        <span className="meta-value">{new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                <table className="invoice-items-table">
                    <thead>
                        <tr>
                            <th>Sl. No</th>
                            <th>Description</th>
                            <th>Unit Price</th>
                            <th>Qty</th>
                            <th>Net Amount</th>
                            <th>Tax (GST)</th>
                            <th>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td className="item-details">
                                    <span className="item-name">{item.productName}</span>
                                </td>
                                <td className="text-right">₹{item.price.toFixed(2)}</td>
                                <td className="text-center">{item.quantity}</td>
                                <td className="text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                                <td className="text-right">Included</td>
                                <td className="text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="grand-total-row">
                            <td colSpan="6" className="text-right">Total</td>
                            <td className="text-right total-value">₹{totalPrice.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>

                <div className="invoice-footer-section">
                    <div className="footer-notes">
                        <p><strong>Payment Mode:</strong> {order.paymentMethod}</p>
                        <p className="declaration">Whether tax is payable on reverse charge basis: No</p>
                    </div>
                    <div className="signature-box">
                        <p>For FreshCart Retail Pvt Ltd:</p>
                        <div className="sign-space"></div>
                        <p className="signatory-label">Authorized Signatory</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;

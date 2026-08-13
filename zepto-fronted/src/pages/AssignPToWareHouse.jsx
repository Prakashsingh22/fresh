import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/ui/button";
import "./AssignPToWareHouse.css";

const AssignPToWareHouse = () => {
    const navigate = useNavigate();

    const [warehouses, setWarehouses] = useState([]);
    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState({
        wid: "",
        pid: "",
        basePrice: "",
        discount: "",
        totalQuantity: "",
    });

    /* 🔹 Load warehouse list on mount */
    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const whRes = await api.get("/warehouse/list");
                setWarehouses(Array.isArray(whRes.data) ? whRes.data : []);
            } catch (err) {
                console.error("Failed to load warehouses:", err);
                alert("Failed to load warehouse data");
            }
        };

        fetchWarehouses();
    }, []);

    /* 🔹 Load products on mount */
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("/product/all");
                setProducts(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setProducts([]);
            }
        };

        fetchProducts();
    }, []);


    /* 🔹 Handle input change */
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        // Clamp numeric values to minimum of 0
        let val = value;
        if (type === "number" && value !== "") {
            val = Math.max(0, parseFloat(value) || 0);
        }
        setFormData((prev) => ({ ...prev, [name]: val }));
    };

    /* 🔹 Submit form */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Authenticated via JWT token

        try {
            await api.post(
                "/warehouse/product/assign",
                {
                    wid: formData.wid,
                    pid: formData.pid,
                    basePrice: Number(formData.basePrice),
                    discount: Number(formData.discount),
                    totalQuantity: Number(formData.totalQuantity),
                }
            );

            alert("Product successfully assigned to warehouse");
            navigate(-1);
        } catch (error) {
            console.error("Assign product error:", error);
            alert("Failed to assign product");
        }
    };

    return (
        <div className="assign-pto-ware-page">
            {/* 🔒 FIXED HEADER */}
            <header className="assign-pto-ware-header">
                <div className="assign-pto-ware-header-content">
                    <div className="invite-logo">
                        <img src="/logo1.png" alt="Logo" />
                    </div>

                    <button
                        className="assign-pto-ware-back-btn"
                        onClick={() => navigate(-1)}
                    >
                        ←
                    </button>

                    <div className="assign-pto-ware-header-text">
                        <h1>Assign Product</h1>
                        <p>Assign product to warehouse</p>
                    </div>
                </div>
            </header>

            {/* 📦 FORM */}
            <form className="assign-pto-ware-form" onSubmit={handleSubmit}>
                <div className="assign-pto-ware-card">
                    <h2>🏬 Warehouse & Product</h2>

                    <label>Warehouse *</label>
                    <select
                        name="wid"
                        value={formData.wid}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Warehouse</option>
                        {warehouses.map((w) => (
                            <option key={w.id} value={w.id}>
                                {w.wareHouseName}
                            </option>
                        ))}
                    </select>

                    <label>Product *</label>
                    <select
                        name="pid"
                        value={formData.pid}
                        onChange={handleChange}
                        required
                        disabled={!formData.wid || products.length === 0}
                    >
                        <option value="">
                            {formData.wid
                                ? products.length > 0
                                    ? "Select Product"
                                    : "No products available"
                                : "Select warehouse first"}
                        </option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.productName}
                            </option>
                        ))}
                    </select>

                    <h2>💰 Pricing</h2>
                    <div className="assign-pto-ware-grid">
                        <div>
                            <label>Base Price (₹) *</label>
                            <input
                                type="number"
                                name="basePrice"
                                value={formData.basePrice}
                                onChange={handleChange}
                                placeholder="Base price (₹)"
                                min="0"
                                required
                            />
                        </div>

                        <div>
                            <label>Discount *</label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                placeholder="Discount price (₹)"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <h2>📦 Inventory</h2>
                    <label>Total Quantity *</label>
                    <input
                        type="number"
                        name="totalQuantity"
                        value={formData.totalQuantity}
                        onChange={handleChange}
                        placeholder="Total Qunatity "
                        min="0"
                        required
                    />

                    <div className="assign-pto-ware-actions">
                        <Button type="submit" className="assign-pto-ware-submit">
                            Assign Product To WareHouse →
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AssignPToWareHouse;

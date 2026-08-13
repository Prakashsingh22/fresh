import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./InviteAdmin.css";

const InviteAdmin = () => {
    const navigate = useNavigate();

    // ✅ MUST MATCH BACKEND DTO
    const [form, setForm] = useState({
        userName: "",
        email: "",
        phoneNumber: "",
        role: "ZEPTO_APP_ADMIN",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Validate form
    const validate = () => {
        const err = {};
        if (!form.userName) err.userName = "Name is required";
        if (!form.email) err.email = "Email is required";
        if (!form.phoneNumber) err.phoneNumber = "Phone number is required";
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    // Submit invitation
    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);

        // ✅ Route based on role
        const endpoint =
            form.role === "WAREHOUSE_ADMIN"
                ? "/warehouse-admin/invite"
                : "/admin/invite";

        try {
            await api.post(endpoint, form);

            alert("Invitation sent successfully");

            // Optional reset
            setForm({
                userName: "",
                email: "",
                phoneNumber: "",
                role: "ZEPTO_APP_ADMIN",
            });
        } catch (error) {
            console.error(error);
            alert(
                error.response?.data || "Failed to send invitation. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="invite-admin-page">

            <div className="page">

                {/* FIXED HEADER */}
                <header className="invite-header">
                    <div className="invite-header-content">
                        {/* BACK BUTTON */}
                        <div className="invite-logo">
                            <img src="/logo1.png" alt="FreshCart Logo" />

                        </div>
                        <button className="back-home-btn" onClick={() => navigate(-1)}>
                            <span className="back-icon">←</span>
                            <span className="back-text"></span>
                        </button>


                        {/* HEADER TEXT */}
                        <div className="header-text">
                            <h1>Invite Administrator</h1>
                            <p>Send invitation to onboard a new admin</p>
                        </div>
                    </div>
                </header>


                {/* Card */}
                <div className="card">
                    <div className="invite-logo">
                        <img src="/logo1.png" alt="FreshCart Logo" />
                        <span>FreshCart</span>
                    </div>

                    <h2>Invite Administrator</h2>
                    <p className="sub">
                        Send an invitation to onboard a new admin
                    </p>

                    {/* Full Name */}
                    <div className="field">
                        <label>Full Name</label>
                        <input
                            name="userName"
                            placeholder="Enter full name"
                            value={form.userName}
                            onChange={handleChange}
                            className={errors.userName ? "error" : ""}
                        />
                        {errors.userName && <span>{errors.userName}</span>}
                    </div>

                    {/* Email */}
                    <div className="field">
                        <label>Email</label>
                        <input
                            name="email"
                            placeholder="Enter email address"
                            value={form.email}
                            onChange={handleChange}
                            className={errors.email ? "error" : ""}
                        />
                        {errors.email && <span>{errors.email}</span>}
                    </div>

                    {/* Phone */}
                    <div className="field">
                        <label>Phone Number</label>
                        <input
                            name="phoneNumber"
                            placeholder="Enter phone number"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            className={errors.phoneNumber ? "error" : ""}
                        />
                        {errors.phoneNumber && <span>{errors.phoneNumber}</span>}
                    </div>

                    {/* Role */}
                    <div className="field">
                        <label>Admin Type</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="ZEPTO_APP_ADMIN">
                                Zepto Application Admin
                            </option>
                            <option value="WAREHOUSE_ADMIN">
                                Warehouse Admin
                            </option>
                        </select>
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`invite-btn ${loading ? "loading" : ""}`}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Sending...
                            </>
                        ) : (
                            "Send Invitation →"
                        )}

                    </button>

                </div>
            </div>
        </div>
    );
};

export default InviteAdmin;
// {/* FIXED HEADER */}
//       <div className="warehouse-header">
//         <button className="back-btn" onClick={() => navigate(-1)}>
//           ←
//         </button>

//         <div className="header-text">
//           <h1>Create Warehouse</h1>
//           <p>Add a new warehouse location</p>
//         </div>
//       </div>

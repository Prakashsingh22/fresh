import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/ui/button";
import "./WareHouse.css";

const indianStates = [
  "Andhra Pradesh",
  "Karnataka",
  "Tamil Nadu",
  "Maharashtra",
  "Delhi",
  "Telangana",
  "Kerala",
];

const WareHouse = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    wareHouseName: "",
    wareHouseEmail: "",
    wareHouseContactNumber: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    city: "",
    state: "",
    pinCode: "",
    isPrimary: false,
  });


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Authenticated via JWT token

    try {
      const payload = {
        wareHouseName: formData.wareHouseName,
        wareHouseEmail: formData.wareHouseEmail,
        wareHouseContactNumber: formData.wareHouseContactNumber,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        addressLine3: formData.addressLine3,
        city: formData.city,
        state: formData.state,
        pinCode: Number(formData.pinCode),
        country: "India",
        isPrimary: formData.isPrimary,
      };

      await api.post("/warehouse/create", payload);

      alert("Warehouse created successfully!");
      navigate("/");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data || "Failed to create warehouse");
    }
  };

  return (
    <div className="warehouse-wrapper">
      {/* FIXED HEADER (SAFE, ISOLATED) */}
      <header className="warehouse-header">
        <div className="warehouse-header-content">
          {/* BACK BUTTON */}
          <div className="invite-logo">
            <img src="/logo1.png" alt="FreshCart Logo" />

          </div>
          <button
            type="button"
            className="warehouse-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            ←
          </button>
          <div className="header-text">
            <h1>Create Warehouse</h1>
            <p>Add a new warehouse location</p>
          </div>

          {/* Future content goes here */}
        </div>
      </header>
      {/* FORM */}
      <form className="warehouse-form" onSubmit={handleSubmit}>
        {/* WAREHOUSE DETAILS */}
        <div className="warehouse-card">

          <h2>🏢 Warehouse Details</h2>

          <div className="grid-2">
            <div>
              <label>WareHouse Name *</label>
              <input
                name="wareHouseName"
                placeholder="Enter warehouse name"
                value={formData.wareHouseName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>WareHouse Email *</label>
              <input
                name="wareHouseEmail"
                placeholder="warehouse@example.com"
                value={formData.wareHouseEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Contact Number *</label>
              <input
                name="wareHouseContactNumber"
                placeholder="9876543210"
                value={formData.wareHouseContactNumber}
                onChange={handleChange}
                required
              />
            </div>


          </div>
        </div>


        {/* LOCATION DETAILS */}
        <div className="warehouse-card">
          <h2>📍 Location Details</h2>

          <div className="grid-2">
            <div className="full">
              <label>Address Line 1 *</label>
              <input
                name="addressLine1"
                placeholder="Building name, Street address"
                value={formData.addressLine1}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Address Line 2</label>
              <input
                name="addressLine2"
                placeholder="Area, Landmark"
                value={formData.addressLine2}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Address Line 3</label>
              <input
                name="addressLine3"
                placeholder="Additional details"
                value={formData.addressLine3}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>City *</label>
              <input
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>State *</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              >
                <option value="">Select state</option>
                {indianStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>PIN Code *</label>
              <input
                name="pinCode"
                placeholder="Enter 6-digit PIN"
                value={formData.pinCode}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Country</label>
              <input value="India" disabled />
            </div>
            <div className="warehouse-primary-toggle">
              <label className="toggle-container">
                <input
                  type="checkbox"
                  name="isPrimary"
                  checked={formData.isPrimary}
                  onChange={handleChange}
                />
                <span className="toggle-switch"></span>
                <span className="toggle-text">Set as Primary WareHouse</span>
              </label>

              <p className="toggle-hint">
                Primary warehouse will be used as the default for order fulfillment
              </p>
            </div>
          </div>
        </div>

        {/* PRIMARY WAREHOUSE TOGGLE */}


        {/* ACTION BUTTONS */}
        <div className="form-actions">
          <div className="custom-warehouse-buttons">
            <Button className="btn-cancel">Cancel</Button>
            <Button type="submit" className="btn-primary">
              Create WareHouse →
            </Button>

          </div>

        </div>
      </form>
    </div>
  );
};

export default WareHouse;

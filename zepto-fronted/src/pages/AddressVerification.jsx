import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/button";
import "./AddressVerification.css";
import api from "../api/axios";

const AddressVerification = () => {
    const navigate = useNavigate();
    const [address, setAddress] = useState({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pinCode: "",
        country: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await api.get("/user/address");
                // The backend returns the location object directly
                if (response.data) {
                    setAddress({
                        addressLine1: response.data.addressLine1 || "",
                        addressLine2: response.data.addressLine2 || "",
                        city: response.data.city || "",
                        state: response.data.state || "",
                        pinCode: response.data.pinCode || "",
                        country: response.data.country || "",
                    });
                }
            } catch (error) {
                console.error("Failed to fetch address", error);
                // Fallback or empty if not found, rely on user input
            } finally {
                setLoading(false);
            }
        };
        fetchAddress();
    }, []);

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleProceed = async () => {
        try {
            // 1. Update address in backend
            await api.put("/user/address", address);

            // 2. Save locally for payment/order flow if needed
            localStorage.setItem("verifiedAddress", JSON.stringify(address));

            // 3. Navigate
            navigate("/payment");
        } catch (error) {
            console.error("Failed to update address", error);
            alert("Failed to save address. Please try again.");
        }
    };

    if (loading) return <div>Loading address...</div>;

    return (
        <div className="address-verification-page">

            <div className="main-content-padding">
                <div className="address-container">
                    {/* ⬅ BACK BUTTON */}
                    <button
                        className="av-back-btn"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>


                    <h1>Verify Delivery Location</h1>
                    <p>Please cross-check your delivery address.</p>

                    <div className="address-form">
                        <div className="form-group">
                            <label>Address Line 1</label>
                            <input
                                type="text"
                                name="addressLine1"
                                value={address.addressLine1}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Address Line 2</label>
                            <input
                                type="text"
                                name="addressLine2"
                                value={address.addressLine2}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={address.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={address.state}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Pin Code</label>
                                <input
                                    type="text"
                                    name="pinCode"
                                    value={address.pinCode}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={address.country}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <Button
                        className="av-primary-btn"
                        onClick={handleProceed}
                    >
                        Confirm & Proceed to Payment →
                    </Button>

                </div>
            </div>
        </div>
    );
};

export default AddressVerification;

import { Navigate, useNavigate } from "react-router-dom";
import { isLoggedIn, getUser, logout } from "../utils/auth";
import { useState } from "react";
import Header from "../components/Header";
import "./AccountSettings.css";

const AccountSettings = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!isLoggedIn()) {
    return <Navigate to="/user/login" replace />;
  }

  const user = getUser();

  if (!user) return null;

  return (
    <div className="account-settings-page">
      <Header />

      <div className="main-content-padding">
        <div className="account-settings-container">
          <header className="account-settings-header">
            <div className="account-settings-header-left">
              <button
                className="account-settings-back-btn"
                onClick={() => navigate(-1)}
              >
                ←
              </button>

              <div className="account-settings-header-text">
                <h1>Account Settings</h1>
                <p>Manage your account information</p>
              </div>
            </div>
          </header>

          {/* PROFILE CARD */}
          <main className="account-settings-content">
            <div className="account-settings-card">
              <h2>👤 Profile Information</h2>


              <div className="account-settings-profile">
                <div className="profile-avatar">
                  {user.name?.charAt(0)}

                </div>
                <div>
                  <h3>{user.name}</h3>
                  <span className="profile-role">{user.userType}</span>
                </div>
              </div>

              <hr />
              <div className="account-settings-actions">
              </div>


              <div className="account-settings-grid">
                <div>
                  <span>Email</span>
                  <strong>{user.email}</strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{user.phone}</strong>
                </div>

                <div>
                  <span>Member Since</span>
                  <strong>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </strong>
                </div>

                <div>
                  <span>Account Type</span>
                  <strong>{user.userType}</strong>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;

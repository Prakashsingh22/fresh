import { useNavigate } from "react-router-dom";

import "./Index.css";


const Index = () => {
  const navigate = useNavigate();

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // if stored
    navigate("/login");
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>
          <img src="/logo1.png" alt="Logo" />
          <span>FreshCart</span>
        </div>

        {/* 🔹 HEADER ACTION BUTTONS */}
        <div className="header-actions">
          <button
            className="link"
            onClick={() => navigate("/product/register")}
          >
            Add Product
          </button>
          <button
            className="link"
            onClick={() => navigate("/invite/admin")}
          >
            Invite Admin
          </button>
          <button
            className="link"
            onClick={() => navigate("/admin/orders")}
          >
            Manage Orders
          </button>
          <button
            className="link"
            onClick={() => navigate("/product/assign")}
          >
            AssignPTo WareHouse
          </button>

          <button
            className="link primary-link"
            onClick={() => navigate("/warehouse/create")}
          >
            Create Warehouse
          </button>

          {/* <button
      className="link"
      onClick={() => navigate("/signup")}
    >
      Sign Up /
    </button> */}
          {/* <button
      className="link"
      onClick={() => navigate("/login")}
    >
      Log In
    </button> */}
          {/* USER */}
          <div className="user-area">
            <div className="user-dropdown">
              <div className="user-chip">
                <span className="avatar">👤</span>
                <span>My Account</span>
              </div>

              <div className="dropdown-menu">
                <button onClick={() => navigate("/account")}>
                  Account Settings
                </button>
                <button
                  className="logout-btn"
                  onClick={logout}
                >
                  → Logout
                </button>
              </div>
            </div>
          </div>

        </div>
      </header>


      <section className="hero-single">
        <div className="hero-full-image">
          <img src="/index3.png" alt="Login visual" />
          <div className="hero-overlay">
            <span className="badge">⚡ Groceries in 10 minutes</span>

            <h1 className="title">
              Fresh groceries, <span className="highlight">delivered fast</span>
            </h1>

            <p className="subtitle">
              From farm-fresh vegetables to daily essentials, get everything
              delivered to your doorstep in minutes.
            </p>
          </div>
        </div>
      </section>

      <section className="features">
        <Feature
          icon="⚡"
          title="10-Minute Delivery"
          desc="Get groceries delivered in minutes"
        />
        <Feature
          icon="🚚"
          title="Free Delivery"
          desc="No charges above ₹199"
        />
        <Feature
          icon="🥦"
          title="100% Fresh"
          desc="Quality guaranteed or refund"
        />
      </section>
      <div className="stats">
        <div className="stat-item">
          <h2>10K+</h2>
          <p>Happy Customers</p>
        </div>

        <div className="stat-item">
          <h2>500+</h2>
          <p>Products</p>
        </div>

        <div className="stat-item">
          <h2>10 min</h2>
          <p>Avg. Delivery</p>
        </div>

        <div className="stat-item">
          <h2>4.9★</h2>
          <p>App Rating</p>
        </div>
      </div>

    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div className="feature-card">
    <span className="feature-icon">{icon}</span>
    <div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  </div>
);

export default Index;

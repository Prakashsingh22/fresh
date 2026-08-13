import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { isLoggedIn, logout, getUser } from "../utils/auth";
import "./Header.css";

const Header = ({
    showSearch = true,
    selectedCategory = "All",
    setSelectedCategory = () => { },
    searchQuery = "",
    setSearchQuery = () => { },
    handleSearch = () => { }
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [cartCount, setCartCount] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState({ code: "EN", name: "English" });
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);

    // Sync local header state with search params if on search page
    const [localCategory, setLocalCategory] = useState(selectedCategory);
    const [localQuery, setLocalQuery] = useState(searchQuery);

    useEffect(() => {
        if (location.pathname === "/search/product") {
            setLocalCategory(searchParams.get("category") || "All");
            setLocalQuery(searchParams.get("query") || "");
        }
    }, [location.pathname, searchParams]);

    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            setCartCount(cart.length);
        };

        updateCartCount();

        // Listen for storage changes (other tabs)
        window.addEventListener("storage", updateCartCount);
        // Listen for custom cart updates (same tab)
        window.addEventListener("cartUpdate", updateCartCount);

        return () => {
            window.removeEventListener("storage", updateCartCount);
            window.removeEventListener("cartUpdate", updateCartCount);
        };
    }, []);

    const executeSearch = (cat, q) => {
        if (location.pathname === "/search/product") {
            setSelectedCategory(cat);
            setSearchQuery(q);
            handleSearch(cat, q);
            // Also update URL for consistency
            navigate(`/search/product?category=${encodeURIComponent(cat)}&query=${encodeURIComponent(q)}`, { replace: true });
        } else {
            navigate(`/search/product?category=${encodeURIComponent(cat)}&query=${encodeURIComponent(q)}`);
        }
    };

    const onSearchSubmit = (e) => {
        if (e) e.preventDefault();
        executeSearch(localCategory, localQuery);
    };

    const changeCategory = (cat) => {
        setLocalCategory(cat);
        setLocalQuery("");
        setShowSidebar(false);
        executeSearch(cat, "");
    };

    return (
        <header className="amazon-header">
            {/* TOP BAR */}
            <div className="nav-belt">
                <div className="nav-left">
                    <div className="nav-logo" onClick={() => navigate("/")}>
                        <span className="logo-text">Freshcart</span>
                        <span className="logo-dot">.in</span>
                    </div>
                    <div className="nav-location">
                        <div className="nav-location-icon">📍</div>
                        <div className="nav-location-text">
                            <span className="line-1">Delivering to New Delhi 110001</span>
                            <span className="line-2">Update location</span>
                        </div>
                    </div>
                </div>

                <div className="nav-fill">
                    {showSearch && (
                        <form className="nav-search-bar" onSubmit={onSearchSubmit}>
                            <div className="nav-search-scope">
                                <select
                                    value={localCategory}
                                    onChange={(e) => setLocalCategory(e.target.value)}
                                >
                                    <option value="All">All</option>
                                    <option value="Phones">Phones</option>
                                    <option value="Grocery">Grocery</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="FreshVegitable">Fresh Vegitable</option>
                                    <option value="HomeDecoration">Home Decoration</option>
                                    <option value="Beauty">Beauty Products</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Men">Men's Fashion</option>
                                    <option value="Women">Women's Fashion</option>
                                    <option value="Jewelry">Artificial Jewelry</option>
                                </select>
                            </div>
                            <input
                                type="text"
                                className="nav-input"
                                placeholder="Search Freshcart.in"
                                value={localQuery}
                                onChange={(e) => setLocalQuery(e.target.value)}
                            />
                            <button type="submit" className="nav-search-submit">
                                🔍
                            </button>
                        </form>
                    )}
                </div>

                <div className="nav-right">
                    <div className="nav-language">
                        <div className="nav-lang-trigger">
                            <span className="flag-icon">🇮🇳</span>
                            <span className="lang-code">{selectedLanguage.code} ▾</span>
                        </div>

                        <div className="nav-lang-dropdown">
                            <div className="lang-dropdown-header">
                                Change Language <a href="#">Learn more</a>
                            </div>

                            <div className="lang-options">
                                {[
                                    { code: "EN", name: "English", native: "English" },
                                    { code: "HI", name: "Hindi", native: "हिन्दी" },
                                    { code: "TA", name: "Tamil", native: "தமிழ்" },
                                    { code: "TE", name: "Telugu", native: "తెలుగు" },
                                    { code: "KN", name: "Kannada", native: "ಕನ್ನಡ" },
                                    { code: "ML", name: "Malayalam", native: "മലയാളം" },
                                    { code: "BN", name: "Bengali", native: "বাংলা" },
                                    { code: "MR", name: "Marathi", native: "मराठी" }
                                ].map((lang) => (
                                    <label key={lang.code} className="lang-option">
                                        <input
                                            type="radio"
                                            name="language"
                                            checked={selectedLanguage.code === lang.code}
                                            onChange={() => setSelectedLanguage(lang)}
                                        />
                                        <span className="lang-text">{lang.native} - {lang.code}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="lang-dropdown-footer">
                                <div className="shopping-info">
                                    <span className="flag-icon">🇮🇳</span> You are shopping on Freshcart.in
                                </div>
                                <a href="#" className="country-link">Change country/region.</a>
                            </div>
                        </div>
                    </div>

                    <div className="nav-account" onClick={() => !isLoggedIn() && navigate("/login")}>
                        <div className="nav-line-1">Hello, {isLoggedIn() ? (getUser()?.name || "Account") : "sign in"}</div>
                        <div className="nav-line-2">
                            Account & Lists
                            {isLoggedIn() && (
                                <div className="nav-account-dropdown">
                                    <button onClick={(e) => { e.stopPropagation(); navigate("/account"); }}>Account Settings</button>
                                    <button className="logout-btn" onClick={(e) => { e.stopPropagation(); logout(); }}>→ Logout</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="nav-orders" onClick={() => navigate("/account/orders")}>
                        <div className="nav-line-1">Returns</div>
                        <div className="nav-line-2">& Orders</div>
                    </div>

                    <div className="nav-cart" onClick={() => navigate("/orderitems")}>
                        <div className="nav-cart-count-container">
                            <ShoppingCart size={24} />
                            <span className="nav-cart-count">{cartCount}</span>
                        </div>
                        <span className="nav-cart-text">Cart</span>
                    </div>
                </div>
            </div>

            {/* SUB-NAVIGATION */}
            <div className="nav-main">
                <div className="nav-main-all" onClick={() => setShowSidebar(true)}>
                    <span>☰</span> All
                </div>
                <div className="nav-main-links">
                    <span onClick={() => changeCategory("Phones")}>Phones</span>
                    <span onClick={() => changeCategory("Grocery")}>Grocery</span>
                    <span onClick={() => changeCategory("Electronics")}>Electronics</span>
                    <span onClick={() => changeCategory("FreshVegitable")}>FreshVegitable</span>
                    <span onClick={() => changeCategory("HomeDecoration")}>HomeDecoration</span>
                    <span onClick={() => changeCategory("Beauty")}>Beauty Product</span>

                    <div
                        className="nav-item-dropdown"
                        onMouseEnter={() => setActiveDropdown("fashion")}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <span className="dropdown-trigger" onClick={() => changeCategory("Fashion")}>
                            Fashion ▾
                        </span>
                        <div className={`dropdown-menu ${activeDropdown === "fashion" ? "show" : ""}`}>
                            <button onClick={(e) => { e.stopPropagation(); changeCategory("Men"); }}>Men's Fashion</button>
                            <button onClick={(e) => { e.stopPropagation(); changeCategory("Women"); }}>Women's Fashion</button>
                            <button onClick={(e) => { e.stopPropagation(); changeCategory("Fashion"); }}>All Fashion</button>
                        </div>
                    </div>

                    <div
                        className="nav-item-dropdown"
                        onMouseEnter={() => setActiveDropdown("jewelry")}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <span className="dropdown-trigger" onClick={() => changeCategory("Jewelry")}>
                            Jewelry ▾
                        </span>
                        <div className={`dropdown-menu ${activeDropdown === "jewelry" ? "show" : ""}`}>
                            <button onClick={(e) => { e.stopPropagation(); changeCategory("Necklaces"); }}>Necklaces</button>
                            <button onClick={(e) => { e.stopPropagation(); changeCategory("Earrings"); }}>Earrings</button>
                            <button onClick={(e) => { e.stopPropagation(); changeCategory("Bracelets"); }}>Bracelets</button>
                            <button onClick={(e) => { e.stopPropagation(); changeCategory("Rings"); }}>Rings</button>
                            <button onClick={(e) => { e.stopPropagation(); changeCategory("Pendants"); }}>Pendants</button>
                            <button onClick={(e) => { e.stopPropagation(); changeCategory("Jewelry"); }}>All Jewelry</button>
                        </div>
                    </div>

                    <span onClick={() => navigate("/account/orders")}>Returns & Orders</span>
                </div>
            </div>

            {/* CATEGORY SIDEBAR */}
            {showSidebar && (
                <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}>
                    <div className="sidebar" onClick={(e) => e.stopPropagation()}>
                        <div className="sidebar-header">
                            <span className="user-icon">👤</span> Hello, {isLoggedIn() ? (getUser()?.name || "Member") : "Sign In"}
                        </div>
                        <div className="sidebar-content">
                            <h3>Trending</h3>
                            <ul>
                                <li onClick={() => changeCategory("All")}>Best Sellers</li>
                                <li onClick={() => changeCategory("All")}>New Releases</li>
                                <li onClick={() => changeCategory("All")}>Movers and Shakers</li>
                            </ul>
                            <hr />
                            <h3>Shop By Category</h3>
                            <ul>
                                <li onClick={() => changeCategory("Phones")}>Phones</li>
                                <li onClick={() => changeCategory("Grocery")}>Grocery</li>
                                <li onClick={() => changeCategory("Electronics")}>Electronics</li>
                                <li onClick={() => changeCategory("FreshVegitable")}>Fresh Vegitable</li>
                                <li onClick={() => changeCategory("HomeDecoration")}>Home Decoration</li>
                                <li onClick={() => changeCategory("Beauty")}>Beauty Products</li>
                                <li onClick={() => changeCategory("Fashion")}>All Fashion</li>
                                <li onClick={() => changeCategory("Men")}>• Men's Fashion</li>
                                <li onClick={() => changeCategory("Women")}>• Women's Fashion</li>
                                <li onClick={() => changeCategory("Jewelry")}>• Artificial Jewelry</li>
                                <li onClick={() => changeCategory("Necklaces")}>&nbsp;&nbsp; - Necklaces</li>
                                <li onClick={() => changeCategory("Earrings")}>&nbsp;&nbsp; - Earrings</li>
                                <li onClick={() => changeCategory("Bracelets")}>&nbsp;&nbsp; - Bracelets</li>
                                <li onClick={() => changeCategory("Rings")}>&nbsp;&nbsp; - Rings</li>
                                <li onClick={() => changeCategory("Pendants")}>&nbsp;&nbsp; - Pendants</li>
                            </ul>
                            <hr />
                            <h3>Help & Settings</h3>
                            <ul>
                                <li onClick={() => { setShowSidebar(false); navigate("/account"); }}>Your Account</li>
                                <li className="sidebar-lang-display">
                                    <span className="flag-icon">🇮🇳</span> {selectedLanguage.native} - {selectedLanguage.code}
                                </li>
                                <li onClick={() => { setShowSidebar(false); navigate("/account/orders"); }}>Returns & Orders</li>
                                <li onClick={() => { setShowSidebar(false); navigate("/account"); }}>Customer Service</li>
                                {isLoggedIn() && <li onClick={() => { setShowSidebar(false); logout(); }}>Sign Out</li>}
                            </ul>
                        </div>
                        <button className="sidebar-close" onClick={() => setShowSidebar(false)}>×</button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/ui/button";
import { toast } from "sonner";
import { ShoppingCart, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { isLoggedIn } from "../utils/auth";
import "./ProductDetails.css";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeMedia, setActiveMedia] = useState(null);
    const [mediaType, setMediaType] = useState("image"); // 'image' or 'video'
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedWeight, setSelectedWeight] = useState("1kg");
    const [cartCount, setCartCount] = useState(0);
    const [showSidebar, setShowSidebar] = useState(false);

    const isVegetable = () => {
        if (!product) return false;
        const name = product.productName.toLowerCase();
        const manufacturer = (product.manufacturerName || "").toLowerCase();
        const vegetableKeywords = ["veg", "potato", "onion", "tomato", "carrot", "broccoli", "green", "fresh", "organic", "cauliflower", "spinach", "cabbage", "pea", "chilli", "ginger", "garlic"];
        return vegetableKeywords.some(keyword => name.includes(keyword) || manufacturer.includes(keyword));
    };

    const getPriceForWeight = (baseDiscountPrice) => {
        if (!isVegetable()) return baseDiscountPrice;
        switch (selectedWeight) {
            case "250gm": return baseDiscountPrice * 0.25;
            case "500gm": return baseDiscountPrice * 0.50;
            case "1kg":
            default: return baseDiscountPrice;
        }
    };

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(cart.length);
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/product/${id}`);
                setProduct(res.data);
                if (res.data.productImageLinks && res.data.productImageLinks.length > 0) {
                    setActiveMedia(res.data.productImageLinks[0]);
                } else {
                    setActiveMedia(res.data.productImageLink);
                }
            } catch (err) {
                console.error("Failed to fetch product details", err);
                toast.error("Failed to load product details");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const formatImagePath = (path) => {
        if (!path) return "https://placehold.co/400x400?text=No+Image";
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

    const handleAddToCart = () => {
        if (!isLoggedIn()) {
            navigate("/login");
            return;
        }
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find((item) => item.pid === product.id);

        const itemPrice = getPriceForWeight(product.discountPrice);
        if (existing) {
            existing.quantity += 1;
            // Support multiple weights of the same product as separate items if needed, 
            // but for now, we'll just track weight in the item.
            // If the user adds the same product with a different weight, it should probably be a separate entry.
        } else {
            cart.push({
                pid: product.id,
                name: product.productName,
                price: itemPrice,
                weight: isVegetable() ? selectedWeight : null,
                quantity: 1,
                image: formatImagePath(product.productImageLink || (product.productImageLinks && product.productImageLinks[0])),
            });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        setCartCount(cart.length);
        toast.success("Added to cart");
    };

    const handleBuyNow = () => {
        if (!isLoggedIn()) {
            navigate("/login");
            return;
        }
        handleAddToCart();
        navigate("/orderitems");
    };

    const handleSearch = () => {
        navigate(`/search/product?query=${encodeURIComponent(searchQuery)}`);
    };

    const handleNextImage = () => {
        const currentIndex = allImages.indexOf(activeMedia);
        const nextIndex = (currentIndex + 1) % allImages.length;
        setActiveMedia(allImages[nextIndex]);
    };

    const handlePrevImage = () => {
        const currentIndex = allImages.indexOf(activeMedia);
        const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
        setActiveMedia(allImages[prevIndex]);
    };

    if (loading) return <div className="loading-container">Loading product details...</div>;
    if (!product) return <div className="error-container">Product not found</div>;

    const allImages = (product.productImageLinks && product.productImageLinks.length > 0)
        ? product.productImageLinks
        : [product.productImageLink].filter(Boolean);

    return (
        <div className="product-details-page">
            {/* CATEGORY SIDEBAR */}
            {showSidebar && (
                <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}>
                    <div className="sidebar" onClick={(e) => e.stopPropagation()}>
                        <div className="sidebar-header">
                            <span className="user-icon">👤</span> Hello, {isLoggedIn() ? "User" : "Sign In"}
                        </div>
                        <div className="sidebar-content">
                            <h3>Trending</h3>
                            <ul>
                                <li onClick={() => navigate("/search/product")}>Best Sellers</li>
                                <li onClick={() => navigate("/search/product")}>New Releases</li>
                            </ul>
                            <hr />
                            <h3>Shop By Category</h3>
                            <ul>
                                <li onClick={() => navigate("/search/product")}>Phones</li>
                                <li onClick={() => navigate("/search/product")}>Grocery</li>
                                <li onClick={() => navigate("/search/product")}>Electronics</li>
                                <li onClick={() => navigate("/search/product")}>FreshVegitable</li>
                                <li onClick={() => navigate("/search/product")}>HomeDecoration</li>
                                <li onClick={() => navigate("/search/product")}>Beauty Product</li>
                                <li onClick={() => navigate("/search/product")}>All Fashion</li>
                            </ul>
                        </div>
                        <button className="sidebar-close" onClick={() => setShowSidebar(false)}>&times;</button>
                    </div>
                </div>
            )}

            {/* AMAZON-STYLE HEADER */}
            <header className="amazon-header">
                <div className="nav-belt">
                    <div className="nav-left">
                        <div className="nav-logo" onClick={() => navigate("/search/product")}>
                            <span className="logo-text">Freshcart</span>
                            <span className="logo-dot">.in</span>
                        </div>
                        <div className="nav-location">
                            <div className="nav-location-icon">📍</div>
                            <div className="nav-location-text">
                                <span className="line-1">Delivering to</span>
                                <span className="line-2">India</span>
                            </div>
                        </div>
                    </div>

                    <div className="nav-fill">
                        <div className="nav-search-bar">
                            <div className="nav-search-scope">
                                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                    <option value="All">All</option>
                                    <option value="Phones">Phones</option>
                                    <option value="Grocery">Grocery</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="FreshVegitable">Fresh Vegitable</option>
                                    <option value="HomeDecoration">HomeDecoration</option>
                                    <option value="Beauty">Beauty Product</option>
                                    <option value="Fashion">Fashion</option>
                                </select>
                            </div>
                            <input
                                type="text"
                                className="nav-input"
                                placeholder="Search Freshcart.in"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <div className="nav-search-submit" onClick={handleSearch}>
                                🔍
                            </div>
                        </div>
                    </div>

                    <div className="nav-right">
                        <div className="nav-account" onClick={() => !isLoggedIn() && navigate("/login")}>
                            <div className="nav-line-1">Hello, {isLoggedIn() ? "Account" : "sign in"}</div>
                            <div className="nav-line-2">Account & Lists</div>
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

                <div className="nav-main">
                    <div className="nav-main-all" onClick={() => setShowSidebar(true)}>
                        <span>☰</span> All
                    </div>
                    <div className="nav-main-links">
                        <span onClick={() => navigate("/search/product")}>Phones</span>
                        <span onClick={() => navigate("/search/product")}>Grocery</span>
                        <span onClick={() => navigate("/search/product")}>Electronics</span>
                        <span onClick={() => navigate("/search/product")}>FreshVegitable</span>
                        <span onClick={() => navigate("/search/product")}>HomeDecoration</span>
                        <span onClick={() => navigate("/search/product")}>Beauty Product</span>
                        <div className="nav-item-dropdown">
                            <span className="dropdown-trigger" onClick={() => navigate("/search/product")}>
                                Fashion ▾
                            </span>
                            <div className="dropdown-menu">
                                <button onClick={() => navigate("/search/product")}>Men's Fashion</button>
                                <button onClick={() => navigate("/search/product")}>Women's Fashion</button>
                                <button onClick={() => navigate("/search/product")}>All Fashion</button>
                            </div>
                        </div>

                        <div className="nav-item-dropdown">
                            <span className="dropdown-trigger" onClick={() => navigate("/search/product")}>
                                Jewelry ▾
                            </span>
                            <div className="dropdown-menu">
                                <button onClick={() => navigate("/search/product")}>Necklaces</button>
                                <button onClick={() => navigate("/search/product")}>Earrings</button>
                                <button onClick={() => navigate("/search/product")}>Bracelets</button>
                                <button onClick={() => navigate("/search/product")}>Rings</button>
                                <button onClick={() => navigate("/search/product")}>Pendants</button>
                                <button onClick={() => navigate("/search/product")}>All Jewelry</button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="details-container">
                {/* Media Section */}
                <div className="media-section">
                    <button className="back-btn-details" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                    </button>
                    <div className="main-media-wrapper">
                        {allImages.length > 1 && (
                            <>
                                <button className="nav-btn prev" onClick={handlePrevImage}>
                                    <ChevronLeft size={24} />
                                </button>
                                <button className="nav-btn next" onClick={handleNextImage}>
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                        {mediaType === "image" ? (
                            <img
                                src={formatImagePath(activeMedia)}
                                alt={product.productName}
                                className="main-media"
                                onError={(e) => { e.target.src = "https://placehold.co/400x400?text=Image+Not+Found"; }}
                            />
                        ) : (
                            <video src={product.productVideoLink} controls autoPlay className="main-media" />
                        )}
                    </div>

                    <div className="thumbnails-grid">
                        {allImages.slice(0, 6).map((img, idx) => (
                            <div
                                key={idx}
                                className={`thumbnail ${activeMedia === img && mediaType === "image" ? "active" : ""}`}
                                onClick={() => {
                                    setActiveMedia(img);
                                    setMediaType("image");
                                }}
                            >
                                <img
                                    src={formatImagePath(img)}
                                    alt={`Thumbnail ${idx}`}
                                    onError={(e) => { e.target.src = "https://placehold.co/100x100?text=No+Image"; }}
                                />
                            </div>
                        ))}
                        {allImages.length > 6 && (
                            <div className="thumbnail more-count">
                                <span>{allImages.length - 6}+</span>
                            </div>
                        )}
                        {product.productVideoLink && (
                            <div
                                className={`thumbnail video-thumb ${mediaType === "video" ? "active" : ""}`}
                                onClick={() => setMediaType("video")}
                            >
                                <div className="play-overlay">▶</div>
                                <video src={product.productVideoLink} muted />
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="info-section">
                    <p className="brand-name">{product.manufacturerName}</p>
                    <h1 className="product-name">{product.productName}</h1>

                    <div className="price-container">
                        <span className="discount-percent">
                            -{Math.round(((product.basePrice - product.discountPrice) / product.basePrice) * 100)}%
                        </span>
                        <div className="price-wrapper">
                            <span className="currency">₹</span>
                            <span className="main-price">{Math.floor(getPriceForWeight(product.discountPrice))}</span>
                            <span className="price-decimal">
                                {(getPriceForWeight(product.discountPrice) % 1).toFixed(2).substring(2)}
                            </span>
                        </div>
                        <p className="mrp">M.R.P.: <span>₹{product.basePrice}</span></p>
                    </div>

                    <div className="stock-status">
                        {product.quantity > 0 ? (
                            <span className="in-stock">In Stock ({product.quantity} available)</span>
                        ) : (
                            <span className="out-of-stock">Currently Unavailable</span>
                        )}
                    </div>

                    <div className="actions">
                        {product.quantity > 0 ? (
                            <>
                                {isVegetable() && (
                                    <div className="weight-selector">
                                        <p>Select Weight:</p>
                                        <div className="weight-options">
                                            {["250gm", "500gm", "1kg"].map((weight) => (
                                                <button
                                                    key={weight}
                                                    className={`weight-btn ${selectedWeight === weight ? "active" : ""}`}
                                                    onClick={() => setSelectedWeight(weight)}
                                                >
                                                    {weight}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <button
                                    className="add-to-cart-btn"
                                    onClick={handleAddToCart}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    className="buy-now-btn"
                                    onClick={handleBuyNow}
                                >
                                    Buy Now
                                </button>
                            </>
                        ) : (
                            <div className="out-of-stock-notice">
                                <button className="out-of-stock-btn-large" disabled>
                                    Out of Stock
                                </button>
                                <p className="unavailable-msg">This item is currently unavailable.</p>
                            </div>
                        )}
                    </div>

                    <div className="product-info-grid">
                        <div className="info-item">
                            <strong>Manufacturer</strong>
                            <span>{product.manufacturerName}</span>
                        </div>
                        <div className="info-item">
                            <strong>Product ID</strong>
                            <span>{product.id.substring(0, 8)}...</span>
                        </div>
                    </div>

                    {product.aboutThisItem && product.aboutThisItem.length > 0 && (
                        <div className="about-item-section">
                            <h3>About this item</h3>
                            <ul>
                                {product.aboutThisItem.map((point, idx) => (
                                    <li key={idx}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {product.technicalDetails && Object.keys(product.technicalDetails).length > 0 && (
                        <div className="technical-details-section">
                            <h3>Technical Details</h3>
                            <table className="tech-table">
                                <tbody>
                                    {Object.entries(product.technicalDetails).map(([key, value], idx) => (
                                        <tr key={idx}>
                                            <td className="tech-label">{key}</td>
                                            <td className="tech-value">{value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

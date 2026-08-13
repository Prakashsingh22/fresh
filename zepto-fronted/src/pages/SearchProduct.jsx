import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/ui/button";
import Header from "../components/Header";
import api from "../api/axios";
import { isLoggedIn, logout, getUser } from "../utils/auth";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import "./SearchProduct.css";

const API_BASE_URL = "/product";

// 🔹 Reusable Amazon-Style Category Card
// REMOVED as per user request

const SearchProduct = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");

    const [manufacturer, setManufacturer] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState({ code: "EN", name: "English" });

    // products = Final list to display
    const [products, setProducts] = useState([]);

    // allProducts = Initial full load (cache)
    const [allProducts, setAllProducts] = useState([]);

    // baseProducts = Current search results (before local filtering)
    const [baseProducts, setBaseProducts] = useState([]);

    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedWeights, setSelectedWeights] = useState({}); // { productId: weight }

    const isVegetable = (p) => {
        if (!p) return false;
        const name = (p.productName || "").toLowerCase();
        const manufacturer = (p.manufacturerName || "").toLowerCase();
        const vegetableKeywords = ["veg", "potato", "onion", "tomato", "carrot", "broccoli", "green", "fresh", "organic", "cauliflower", "spinach", "cabbage", "pea", "chilli", "ginger", "garlic", "mashroom", "capsicum"];
        return vegetableKeywords.some(keyword => name.includes(keyword) || manufacturer.includes(keyword));
    };

    const getPriceWithWeight = (price, weight) => {
        if (!weight) return price;
        if (weight === "250gm") return price * 0.25;
        if (weight === "500gm") return price * 0.50;
        return price;
    };

    // 🔹 Load cart count on mount
    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(cart.length);
    }, []);

    // 🔹 Fetch all products (WITH JWT)
    const fetchAllProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get(`${API_BASE_URL}/all`);
            setAllProducts(res.data);
            setBaseProducts(res.data);
        } catch (err) {
            console.error("Failed to load products", err);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Search from backend (WITH JWT)
    const handleSearch = useCallback(async (forcedCategory, forcedQuery) => {
        const category = forcedCategory || selectedCategory;
        // If forcedQuery is provided (even empty string), use it. Otherwise use state.
        const query = forcedQuery !== undefined ? forcedQuery : searchQuery;

        try {
            setLoading(true);
            let sourceProducts = [];

            if (query.trim()) {
                // If there's a search term, fetch from backend
                const res = await api.get(`${API_BASE_URL}/search`, {
                    params: { productName: query }
                });
                sourceProducts = res.data;
            } else {
                // If no search term, use the full list of products
                sourceProducts = allProducts;
            }

            let results = [...sourceProducts];

            // Local filtering for category
            if (category !== "All") {
                const target = category.toLowerCase();

                const searchTerms =
                    target === "phones" ? ["phone", "mobile", "smartphone", "cell", "iphone", "samsung", "pixel", "oneplus", "nokia", "moto", "xiaomi", "redmi", "realme", "oppo", "vivo"] :
                        target === "freshvegitable" ? ["veg", "potato", "onion", "tomato", "carrot", "broccoli", "green", "fresh", "organic"] :
                            target === "homedecoration" ? ["decor", "home", "painting", "vase", "lamp", "wall", "clock", "furniture"] :
                                target === "beauty" ? ["beauty", "makeup", "skin", "care", "hair", "lipstick", "cream", "lotion", "serum"] :
                                    target === "jewelry" ? ["jewelry", "necklace", "earring", "bracelet", "ring", "pendant", "gold", "silver", "diamond", "chain", "anklet", "bangle", "set"] :
                                        target === "necklaces" ? ["necklace", "choker", "pendant"] :
                                            target === "earrings" ? ["earring", "stud", "hoop", "jhumka"] :
                                                target === "bracelets" ? ["bracelet", "bangle", "wrist"] :
                                                    target === "rings" ? ["ring", "band"] :
                                                        target === "pendants" ? ["pendant", "pendent", "locket"] :
                                                            target === "fashion" ? ["fashion", "clothing", "wear", "shirt", "pant", "top", "dress", "suit", "jacket", "coat", "jeans", "t-shirt", "tshirt", "saree", "kurta", "kurti", "shoes", "footwear", "sneaker", "sandal", "heels", "skirt", "blouse"] :
                                                                target === "men" ? ["men", "man", "male", "boy", "gents", "jeans", "t-shirt", "shirt", "shoes", "sneaker"] :
                                                                    target === "women" ? ["women", "woman", "female", "lady", "ladies", "girl", "saree", "makeup", "dress", "skirt", "kurti", "top", "heels"] :
                                                                        [target];

                results = results.filter(p => {
                    const text = `${p.productName} ${p.manufacturerName}`.toLowerCase();

                    // 🛡️ EXCLUSION LOGIC (To prevent "Gold" phones appearing in Jewelry)
                    let excluded = false;
                    if (target === "jewelry" || target === "necklaces" || target === "earrings" || target === "rings") {
                        const excludeTerms = ["phone", "mobile", "ram", "gb", "5g", "4g", "android", "ios", "snapdragon", "dimensity"];
                        if (excludeTerms.some(term => text.includes(term))) {
                            excluded = true;
                        }
                    }

                    if (excluded) return false;

                    return searchTerms.some(term => {
                        // Use word boundary for generic gender terms to avoid overlaps (e.g., 'men' inside 'women')
                        if (["men", "man", "boy", "girl", "lady"].includes(term)) {
                            const regex = new RegExp(`\\b${term}\\b`, 'i');
                            return regex.test(text);
                        }
                        return text.includes(term);
                    });
                });
            }

            setBaseProducts(results);
        } catch (err) {
            console.error("Search failed", err);
            // Fallback to local products if API fails
            setBaseProducts(allProducts);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, allProducts, selectedCategory]);

    // 🔹 Load all products initially
    useEffect(() => {
        fetchAllProducts();
    }, []);

    // 🔹 Sync state with URL params
    useEffect(() => {
        const query = searchParams.get("query") || "";
        const category = searchParams.get("category") || "All";
        setSearchQuery(query);
        setSelectedCategory(category);
    }, [searchParams]);

    // 🔹 Search whenever query changes (Instant Search)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 300); // 300ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [handleSearch]);

    // 🔹 Apply filters whenever base results or filter criteria change
    useEffect(() => {
        const filtered = applyFilters(baseProducts);
        setProducts(filtered);
        // eslint-disable-next-line
    }, [baseProducts, manufacturer, priceRange]);

    // 🔹 Apply frontend filters
    const applyFilters = (list) => {
        if (!list) return [];
        let filtered = [...list];

        if (manufacturer) {
            filtered = filtered.filter(
                p => p.manufacturerName === manufacturer
            );
        }

        if (priceRange === "low") {
            filtered = filtered.filter(p => !p.discountPrice ? p.basePrice <= 50 : p.discountPrice <= 50);
        }

        if (priceRange === "mid") {
            filtered = filtered.filter(p => {
                const price = p.discountPrice || p.basePrice;
                return price > 50 && price <= 150;
            });
        }

        if (priceRange === "high") {
            filtered = filtered.filter(p => {
                const price = p.discountPrice || p.basePrice;
                return price > 150;
            });
        }

        return filtered;
    };

    // 🔹 Clear filters
    const clearFilters = () => {
        setSearchQuery("");
        setManufacturer("");
        setPriceRange("");
        setSelectedCategory("All");
        setBaseProducts(allProducts);
    };

    const changeCategory = (cat) => {
        setSelectedCategory(cat);
        setSearchQuery("");
        handleSearch(cat, "");
    };

    const manufacturers = [...new Set(allProducts.map(p => p.manufacturerName))];

    const formatImagePath = (path) => {
        if (!path) return "https://placehold.co/300x300?text=No+Image";
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

    // 🔹 Add to Cart Logic
    const handleAddToCart = (p, redirect = false) => {
        if (!isLoggedIn()) {
            navigate("/login");
            return;
        }
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // 🔥 NEW ORDER → reset old address if cart was empty
        if (cart.length === 0) {
            localStorage.removeItem("verifiedAddress");
        }

        const existing = cart.find(item => item.pid === p.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            const weight = selectedWeights[p.id] || (isVegetable(p) ? "1kg" : null);
            const price = getPriceWithWeight(p.discountPrice, weight);

            cart.push({
                pid: p.id,
                name: p.productName,
                price: price,
                weight: weight,
                quantity: 1,
                image: formatImagePath(p.productImageLink || (p.productImageLinks && p.productImageLinks[0]))
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdate"));

        if (redirect) {
            navigate("/orderitems");
        } else {
            toast.success("Added to cart");
        }
    };

    return (
        <div className="search-page">
            {/* AMAZON-STYLE HEADER */}
            <Header
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
            />



            {/* PRODUCTS */}
            <div className="product-grid-header">
                <h2>All Products ({products.length})</h2>
            </div>

            {loading && <p className="empty-text">Loading...</p>}

            <div className="product-grid">
                {!loading && products.length === 0 && (
                    <p className="empty-text">No products found</p>
                )}

                {products.map(p => (
                    <div className={`product-card ${p.quantity <= 0 ? "out-of-stock" : ""}`} key={p.id}>
                        <div className="image-wrapper">
                            {p.discountPrice < p.basePrice && (
                                <span className="discount-badge">
                                    {Math.round(
                                        ((p.basePrice - p.discountPrice) / p.basePrice) * 100
                                    )}% OFF
                                </span>
                            )}
                            <img
                                src={formatImagePath(p.productImageLink || (p.productImageLinks && p.productImageLinks[0]))}
                                alt={p.productName}
                                onClick={() => navigate(`/product/${p.id}`)}
                                style={{ cursor: "pointer" }}
                                onError={(e) => { e.target.src = "https://placehold.co/300x300?text=No+Image"; }}
                            />
                        </div>

                        <h3 onClick={() => navigate(`/product/${p.id}`)} style={{ cursor: "pointer" }}>
                            {p.productName}
                        </h3>
                        <p className="brand">{p.manufacturerName}</p>

                        <div className="price-row">
                            <span className="price">₹{getPriceWithWeight(p.discountPrice, selectedWeights[p.id] || (isVegetable(p) ? "1kg" : null))}</span>
                            {p.discountPrice < p.basePrice && !selectedWeights[p.id] && (
                                <span className="old-price">₹{p.basePrice}</span>
                            )}
                        </div>

                        <span
                            className={`qty ${p.quantity > 50 ? "high" :
                                p.quantity > 10 ? "mid" : "low"
                                }`}
                        >
                            Qty: {p.quantity}
                        </span>

                        {isVegetable(p) && (
                            <div className="weight-selector-card">
                                {["250gm", "500gm", "1kg"].map(weight => (
                                    <button
                                        key={weight}
                                        className={`weight-choice ${(selectedWeights[p.id] || "1kg") === weight ? "active" : ""}`}
                                        onClick={() => setSelectedWeights({ ...selectedWeights, [p.id]: weight })}
                                    >
                                        {weight}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="product-actions">
                            {p.quantity > 0 ? (
                                <>
                                    <Button
                                        className="buy-now-btn"
                                        onClick={() => handleAddToCart(p, true)}
                                    >
                                        Buy Now
                                    </Button>
                                    <Button
                                        className="cart-btn"
                                        onClick={() => handleAddToCart(p, false)}
                                    >
                                        Add to Cart
                                    </Button>
                                </>
                            ) : (
                                <button className="out-of-stock-btn" disabled>
                                    Out of Stock
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchProduct;

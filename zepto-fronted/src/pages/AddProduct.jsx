import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/ui/button";
import "./AddProduct.css";

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    manufacturerName: "",
    productImageLink: "",
    productImageLinks: ["", "", "", "", ""],
    productVideoLink: "",
    quantity: 0,
    basePrice: 0,
    discountPrice: 0,
    aboutThisItem: [""],
    technicalDetails: { "": "" }
  });

  const formatImagePath = (path) => {
    if (!path) return "";
    if (path.toString().startsWith("http")) return path;
    try {
      let decoded = decodeURI(path.toString());
      let normalized = decoded.replace(/\\/g, "/");

      // Handle absolute local paths (e.g. /home/user/project/public/img.png)
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

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Clamp numeric values to minimum of 0
    let val = value;
    if (type === "number" && value !== "") {
      val = Math.max(0, parseFloat(value) || 0);
    }
    setFormData({ ...formData, [name]: val });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.productImageLinks];
    newImages[index] = value;
    // Also update the primary productImageLink if it's the first image
    if (index === 0) {
      setFormData({ ...formData, productImageLinks: newImages, productImageLink: value });
    } else {
      setFormData({ ...formData, productImageLinks: newImages });
    }
  };

  const handleAboutChange = (index, value) => {
    const newList = [...formData.aboutThisItem];
    newList[index] = value;
    setFormData({ ...formData, aboutThisItem: newList });
  };

  const addAboutItem = () => {
    setFormData({ ...formData, aboutThisItem: [...formData.aboutThisItem, ""] });
  };

  const removeAboutItem = (index) => {
    const newList = formData.aboutThisItem.filter((_, i) => i !== index);
    setFormData({ ...formData, aboutThisItem: newList });
  };

  const handleTechChange = (oldKey, value, type) => {
    const newDetails = { ...formData.technicalDetails };
    if (type === "key") {
      const oldValue = newDetails[oldKey];
      delete newDetails[oldKey];
      newDetails[value] = oldValue;
    } else {
      newDetails[oldKey] = value;
    }
    setFormData({ ...formData, technicalDetails: newDetails });
  };

  const addTechDetail = () => {
    setFormData({ ...formData, technicalDetails: { ...formData.technicalDetails, [`spec-${Object.keys(formData.technicalDetails).length}`]: "" } });
  };

  const removeTechDetail = (key) => {
    const newDetails = { ...formData.technicalDetails };
    delete newDetails[key];
    setFormData({ ...formData, technicalDetails: newDetails });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter out empty image links
    const filteredImages = formData.productImageLinks.filter(link => link.trim() !== "");
    const filteredAbout = formData.aboutThisItem.filter(item => item.trim() !== "");
    const filteredTech = Object.fromEntries(
      Object.entries(formData.technicalDetails).filter(([k, v]) => k.trim() !== "" && !k.startsWith("spec-"))
    );

    const dataToSend = {
      ...formData,
      productImageLinks: filteredImages,
      aboutThisItem: filteredAbout,
      technicalDetails: filteredTech,
      productImageLink: formData.productImageLink || (filteredImages.length > 0 ? filteredImages[0] : "")
    };

    await api.post(
      "/product/register",
      dataToSend
    );

    alert("Product added successfully");
    navigate(-1);
  };

  return (
    <div className="add-product-page">
      {/* 🔒 FIXED HEADER */}
      <header className="add-product-header">
        <div className="add-product-header-content">
          <div className="invite-logo">
            <img src="/logo1.png" alt="FreshCart Logo" />

          </div>
          <button
            className="add-product-back-btn"
            onClick={() => navigate(-1)}
          >
            ←
          </button>

          <div className="add-product-header-text">
            <h1>Add Product</h1>
            <p>Add new product with high-quality media</p>
          </div>
        </div>
      </header>

      {/* 📦 FORM STARTS HERE */}
      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="add-product-card">

          {/* PRODUCT DETAILS */}
          <h2>📦 Product Details</h2>

          <div className="add-product-grid">
            <div>
              <label>Product Name *</label>
              <input
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label>Manufacturer Name *</label>
              <input
                name="manufacturerName"
                value={formData.manufacturerName}
                onChange={handleChange}
                placeholder="Enter manufacturer name"
                required
              />
            </div>
          </div>

          {/* MEDIA SECTION */}
          <h2>🖼️ Product Media</h2>
          <div className="add-product-media-grid">
            <div className="add-product-full">
              <label>Primary Product Image URL *</label>
              <div className="input-with-preview">
                <input
                  name="productImageLink"
                  value={formData.productImageLinks[0]}
                  onChange={(e) => handleImageChange(0, e.target.value)}
                  placeholder="e.g. /myfolder/image.png"
                  required
                />
                {formData.productImageLinks[0] && (
                  <div className="media-preview-group">
                    <div className="small-preview">
                      <img
                        src={formatImagePath(formData.productImageLinks[0])}
                        alt="Preview"
                        onError={(e) => { e.target.src = "/placeholder-image.png"; }}
                      />
                    </div>
                    <span className="debug-path">Resolved: {formatImagePath(formData.productImageLinks[0])}</span>
                  </div>
                )}
              </div>
              <p className="input-hint">Path should start with / if it's in public folder (e.g. /myfolder/image.jpg)</p>
            </div>

            <div className="add-product-grid">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx}>
                  <label>Additional Image {idx} URL</label>
                  <div className="input-with-preview">
                    <input
                      value={formData.productImageLinks[idx]}
                      onChange={(e) => handleImageChange(idx, e.target.value)}
                      placeholder={`e.g. /myfolder/angle-${idx}.jpg or https://example.com/angle-${idx}.jpg`}
                    />
                    {formData.productImageLinks[idx] && (
                      <div className="media-preview-group">
                        <div className="small-preview">
                          <img
                            src={formatImagePath(formData.productImageLinks[idx])}
                            alt="Preview"
                            onError={(e) => { e.target.src = "https://placehold.co/100x100?text=Error"; }}
                          />
                        </div>
                        <span className="debug-path">Resolved: {formatImagePath(formData.productImageLinks[idx])}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="add-product-full" style={{ marginTop: "1rem" }}>
              <label>Product Video URL (30s max recommended)</label>
              <input
                name="productVideoLink"
                value={formData.productVideoLink}
                onChange={handleChange}
                placeholder="https://example.com/product-video.mp4"
              />
              <p className="input-hint">Add a short video to showcase your product better.</p>
            </div>
          </div>

          {/* INVENTORY */}
          <h2 style={{ marginTop: "2rem" }}>📦 Inventory</h2>
          <label>Quantity *</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter available quantity"
            min="0"
            required
          />

          {/* PRICING */}
          <h2>💰 Pricing</h2>
          <div className="add-product-grid">
            <div>
              <label>Base Price *</label>
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
              <label>Discount Price *</label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                placeholder="Discount price (₹)"
                min="0"
                required
              />
            </div>
          </div>

          {/* ABOUT THIS ITEM */}
          <h2 style={{ marginTop: "2rem" }}>📝 About This Item</h2>
          <div className="dynamic-list-section">
            {formData.aboutThisItem.map((item, idx) => (
              <div key={idx} className="dynamic-list-item">
                <input
                  value={item}
                  onChange={(e) => handleAboutChange(idx, e.target.value)}
                  placeholder={`Point ${idx + 1}`}
                />
                <button type="button" className="remove-btn" onClick={() => removeAboutItem(idx)}>×</button>
              </div>
            ))}
            <button type="button" className="add-more-btn" onClick={addAboutItem}>+ Add Point</button>
          </div>

          {/* TECHNICAL DETAILS */}
          <h2 style={{ marginTop: "2rem" }}>⚙️ Technical Details</h2>
          <div className="dynamic-list-section">
            {Object.entries(formData.technicalDetails).map(([key, value], idx) => (
              <div key={idx} className="dynamic-list-item tech-spec-item">
                <input
                  className="spec-key"
                  value={key}
                  onChange={(e) => handleTechChange(key, e.target.value, "key")}
                  placeholder="Label (e.g. RAM)"
                />
                <input
                  className="spec-value"
                  value={value}
                  onChange={(e) => handleTechChange(key, e.target.value, "value")}
                  placeholder="Value (e.g. 12 GB)"
                />
                <button type="button" className="remove-btn" onClick={() => removeTechDetail(key)}>×</button>
              </div>
            ))}
            <button type="button" className="add-more-btn" onClick={addTechDetail}>+ Add Specification</button>
          </div>

          {/* ACTION BUTTON */}
          <div className="add-product-actions">
            <Button
              type="submit"
              className="add-product-submit"
            >
              Add Product      →
            </Button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default AddProduct;

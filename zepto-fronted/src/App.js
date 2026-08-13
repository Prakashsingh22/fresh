import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LandingRedirect from "./routes/LandingRedirect";
import ScrollToTop from "./utils/ScrollToTop";
import Login from "./pages/Login";
import Index from "./pages/Index";
import SearchProduct from "./pages/SearchProduct";
import Signup from "./pages/Signup";
import InviteAdmin from "./pages/InviteAdmin";
import WareHouse from "./pages/WareHouse";
import AddProduct from "./pages/AddProduct";
import AssignPToWareHouse from "./pages/AssignPToWareHouse";
import AccountSettings from "./pages/AccountSettings";
import OrderItems from "./pages/OrderItems";
import AddressVerification from "./pages/AddressVerification";
import PaymentPage from "./pages/PaymentPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import ReturnProduct from "./pages/ReturnProduct";
import ProductDetails from "./pages/ProductDetails";

import AdminOrders from "./pages/AdminOrders";
import Footer from "./components/Footer";
import AboutFreshcart from "./pages/AboutFreshcart";
import Careers from "./pages/Careers";
import PressReleases from "./pages/PressReleases";
import FreshcartScience from "./pages/FreshcartScience";
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import RefundReturnPolicy from "./pages/RefundReturnPolicy";
import HelpSupport from "./pages/HelpSupport";

const App = () => {
  const adminRoles = ["MEINT", "ZEPTO_APP_ADMIN"];
  const allAdminRoles = ["MEINT", "ZEPTO_APP_ADMIN", "WAREHOUSE_ADMIN"];

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Landing redirect decides where to go */}
        <Route path="/" element={<LandingRedirect />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Consumer page */}
        <Route path="/search/product" element={<SearchProduct />} />

        {/* Protected Admin Routes */}
        <Route
          path="/index"
          element={
            <ProtectedRoute allowedRoles={allAdminRoles}>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invite/admin"
          element={
            <ProtectedRoute allowedRoles={adminRoles}>
              <InviteAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warehouse/create"
          element={
            <ProtectedRoute allowedRoles={adminRoles}>
              <WareHouse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/register"
          element={
            <ProtectedRoute allowedRoles={allAdminRoles}>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/assign"
          element={
            <ProtectedRoute allowedRoles={allAdminRoles}>
              <AssignPToWareHouse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={allAdminRoles}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        {/* Account pages */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orderitems"
          element={
            <ProtectedRoute>
              <OrderItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/address-verification"
          element={
            <ProtectedRoute>
              <AddressVerification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        {/* Order pages */}
        <Route
          path="/account/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/orders/:orderId"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/orders/:orderId/return"
          element={
            <ProtectedRoute>
              <ReturnProduct />
            </ProtectedRoute>
          }
        />

        {/* Product details */}
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Informational Pages */}
        <Route path="/about" element={<AboutFreshcart />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/press" element={<PressReleases />} />
        <Route path="/science" element={<FreshcartScience />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/refund-policy" element={<RefundReturnPolicy />} />
        <Route path="/help" element={<HelpSupport />} />

        {/* fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
      <Footer />


    </BrowserRouter>
  );
};

export default App;

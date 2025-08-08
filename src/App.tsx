import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Index from "./pages/Index";
import ShopDetail from "./pages/ShopDetail";
import Login from "./pages/Login";
import LoginSelect from "./pages/LoginSelect";
import RegisterShop from "./pages/RegisterShop";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import MerchantLogin from "./pages/MerchantLogin";
import MerchantDashboard from "./pages/MerchantDashboard";
import MerchantShops from "./pages/MerchantShops";
import NotFound from "./pages/NotFound";

const App = () => (
  <LanguageProvider>
    <TooltipProvider>
      <Sonner />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shops" element={<Index />} />
          <Route path="/shop/:id" element={<ShopDetail />} />
          <Route path="/login-select" element={<LoginSelect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register-shop" element={
            <ProtectedRoute requireMerchant>
              <RegisterShop />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute requireCustomer>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute requireCustomer>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/order-confirmation" element={
            <ProtectedRoute requireCustomer>
              <OrderConfirmation />
            </ProtectedRoute>
          } />
          <Route path="/merchant/login" element={<MerchantLogin />} />
          <Route path="/merchant/dashboard" element={
            <ProtectedRoute requireMerchant>
              <MerchantDashboard />
            </ProtectedRoute>
          } />
          <Route path="/merchant/shops" element={
            <ProtectedRoute requireMerchant>
              <MerchantShops />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </TooltipProvider>
  </LanguageProvider>
);

export default App;

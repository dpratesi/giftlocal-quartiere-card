import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shops" element={<Index />} />
          <Route path="/shop/:id" element={<ShopDetail />} />
          <Route path="/login-select" element={<LoginSelect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register-shop" element={<RegisterShop />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/merchant/login" element={<MerchantLogin />} />
          <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

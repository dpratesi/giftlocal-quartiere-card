import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Index from "./Index";

const Home = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect while auth is loading
    if (isLoading) return;

    // If user is authenticated, redirect based on their type
    if (isAuthenticated && user) {
      if (user.type === 'customer') {
        // Customer goes to shops page
        if (user.preferred_city) {
          navigate(`/shops?city=${encodeURIComponent(user.preferred_city)}`, { replace: true });
        } else {
          navigate('/shops', { replace: true });
        }
      } else if (user.type === 'merchant') {
        // Merchant goes to their dashboard
        navigate('/merchant/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, isLoading]);

  // If not authenticated, show the landing page (Index component)
  return <Index />;
};

export default Home;
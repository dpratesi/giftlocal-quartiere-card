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

    // If user is authenticated and has a preferred city, redirect to shops page
    if (isAuthenticated && user?.preferred_city && user.type === 'customer') {
      navigate(`/shops?city=${encodeURIComponent(user.preferred_city)}`, { replace: true });
    }
  }, [isAuthenticated, user?.preferred_city, user?.type, navigate, isLoading]);

  // If user is authenticated but no preferred city yet, or if merchant, or if not authenticated, show the normal home
  return <Index />;
};

export default Home;
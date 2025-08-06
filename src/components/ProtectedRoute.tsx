import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireMerchant?: boolean;
  requireCustomer?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireMerchant = false,
  requireCustomer = false 
}) => {
  const { isAuthenticated, isMerchant, isCustomer, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login-select" replace />;
  }

  if (requireMerchant && !isMerchant) {
    // If user is authenticated but not a merchant, redirect to login-select with message
    return <Navigate to="/login-select" replace />;
  }

  if (requireCustomer && !isCustomer) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
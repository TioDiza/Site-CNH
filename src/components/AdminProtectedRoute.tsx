import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const AdminProtectedRoute: React.FC = () => {
  const { loading, session, profile } = useAuth();

  // Adicionando logs para depuração
  console.log("[AdminProtectedRoute] Loading:", loading);
  console.log("[AdminProtectedRoute] Session:", session);
  console.log("[AdminProtectedRoute] Profile:", profile);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!session || profile?.role !== 'admin') {
    console.log("[AdminProtectedRoute] Redirecting to /admin/login: No session or not admin role.");
    return <Navigate to="/admin/login" replace />;
  }

  console.log("[AdminProtectedRoute] Access granted to dashboard.");
  return <Outlet />;
};

export default AdminProtectedRoute;
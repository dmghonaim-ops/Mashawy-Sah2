// src/components/ProtectedAdminRoute.tsx
import { Navigate } from 'react-router-dom';
import { isAdminLoggedIn } from '@/lib/adminAuth';

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  if (!isAdminLoggedIn()) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }
  
  // Render the protected admin dashboard/layout
  return <>{children}</>;
}
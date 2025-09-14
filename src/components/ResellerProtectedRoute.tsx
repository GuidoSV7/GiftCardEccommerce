import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ResellerProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ResellerProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: ResellerProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario no tiene rol de reseller
  if (!user?.roles || user.roles !== 'reseller') {
    // Redirigir según el rol del usuario
    if (user?.roles === 'member') {
      return <Navigate to="/member/my-account" replace />;
    } else if (user?.roles === 'admin' || user?.roles === 'superadmin') {
      return <Navigate to="/dashboard" replace />;
    } else if (user?.roles === 'support') {
      return <Navigate to="/support/dashboard" replace />;
    } else {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return <>{children}</>;
}

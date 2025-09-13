import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface SupportProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function SupportProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: SupportProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario no tiene rol de soporte
  if (!user?.roles || user.roles !== 'support') {
    // Redirigir según el rol del usuario
    if (user?.roles === 'member') {
      return <Navigate to="/member/my-account" replace />;
    } else if (user?.roles === 'admin' || user?.roles === 'superadmin') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return <>{children}</>;
}

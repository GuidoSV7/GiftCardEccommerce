import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si no es admin o superadmin, redirigir según su rol
  if (user?.roles !== 'admin' && user?.roles !== 'superadmin') {
    if (user?.roles === 'member') {
      return <Navigate to="/member/my-account" replace />;
    } else if (user?.roles === 'support') {
      return <Navigate to="/support/dashboard" replace />;
    } else if (user?.roles === 'reseller') {
      return <Navigate to="/" replace />; // Temporal hasta definir rutas de reseller
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}

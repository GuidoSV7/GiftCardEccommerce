import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function MemberProtectedRoute() {
  const { isAuthenticated, user } = useAuthStore();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si no es miembro, redirigir según su rol
  if (user?.roles !== 'member') {
    if (user?.roles === 'admin' || user?.roles === 'superadmin') {
      return <Navigate to="/dashboard" replace />;
    } else if (user?.roles === 'support') {
      return <Navigate to="/support/dashboard" replace />;
    } else if (user?.roles === 'reseller') {
      return <Navigate to="/" replace />; // Temporal hasta definir rutas de reseller
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
}

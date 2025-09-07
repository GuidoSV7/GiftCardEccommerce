import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export default function RoleProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = '/login' 
}: RoleProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario no tiene un rol permitido
  if (!user?.roles || !allowedRoles.includes(user.roles)) {
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

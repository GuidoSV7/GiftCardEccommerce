import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export const useTokenExpiration = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleTokenExpiration = () => {
            // Limpiar datos del usuario
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRoles');
            
            // Mostrar mensaje
            toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            
            // Redirigir al login
            navigate('/login');
        };

        const handleAuthError = () => {
            // Limpiar datos del usuario
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRoles');
            
            // Mostrar mensaje
            toast.error('Error de autenticación. Por favor, inicia sesión nuevamente.');
            
            // Redirigir al login
            navigate('/login');
        };

        // Escuchar eventos de expiración de token
        window.addEventListener('token-expired', handleTokenExpiration);
        window.addEventListener('auth-error', handleAuthError);

        // Cleanup
        return () => {
            window.removeEventListener('token-expired', handleTokenExpiration);
            window.removeEventListener('auth-error', handleAuthError);
        };
    }, [navigate]);
};

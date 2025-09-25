import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Si el token es inválido o expiró, limpiar la autenticación
        if (error.response?.status === 401) {
            console.log('Token inválido o expirado, limpiando autenticación');
            
            // Disparar evento personalizado para que el hook useTokenExpiration lo capture
            window.dispatchEvent(new CustomEvent('auth-error', { 
                detail: { 
                    message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.' 
                } 
            }));
        }
        return Promise.reject(error);
    }
);

export default api;
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  roles: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User, token: string) => void;
  logout: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setUser: (user: User, token: string) => {
        console.log('AuthStore: Guardando usuario:', user);
        console.log('AuthStore: Guardando token:', token ? 'Token presente' : 'Token ausente');
        
        set({ user, token, isAuthenticated: true });
        
        // También guardar en localStorage para compatibilidad
        try {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          console.log('AuthStore: Datos guardados en localStorage');
        } catch (error) {
          console.error('AuthStore: Error guardando en localStorage:', error);
        }
      },
      
      logout: () => {
        console.log('AuthStore: Cerrando sesión');
        set({ user: null, token: null, isAuthenticated: false });
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          console.log('AuthStore: Datos eliminados del localStorage');
        } catch (error) {
          console.error('AuthStore: Error eliminando del localStorage:', error);
        }
      },
      
      clearAuth: () => {
        console.log('AuthStore: Limpiando autenticación');
        set({ user: null, token: null, isAuthenticated: false });
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          console.log('AuthStore: Datos eliminados del localStorage');
        } catch (error) {
          console.error('AuthStore: Error eliminando del localStorage:', error);
        }
      }
    }),
    {
      name: 'auth-storage', // nombre único para el localStorage
      onRehydrateStorage: () => (state) => {
        console.log('AuthStore: Rehidratando desde localStorage');
        if (state) {
          console.log('AuthStore: Estado rehidratado:', {
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            hasToken: !!state.token
          });
        }
      },
    }
  )
);

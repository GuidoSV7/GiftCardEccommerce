import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/authStore';
import { googleAuth, type GoogleAuthData } from '../../services/authService';
import type { CredentialResponse, GoogleJWTPayload } from '../../types';
import { googleAuthConfig, validateGoogleConfig } from '../../config/google-auth.config';

interface GoogleLoginButtonProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'minimal' | 'outline';
    disabled?: boolean;
}

export const GoogleLoginButton = ({ 
    onSuccess, 
    onError, 
    className = '',
    size = 'md',
    variant = 'default',
    disabled = false
}: GoogleLoginButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useAuthStore();

    const handleGoogleLogin = async () => {
        if (isLoading || disabled) return;

        setIsLoading(true);

        try {
            // Verificar configuración
            if (!validateGoogleConfig()) {
                throw new Error('Configuración de Google Auth incompleta');
            }

            // Verificar si Google Identity Services está disponible
            if (typeof window.google === 'undefined') {
                throw new Error('Google Identity Services no está disponible');
            }

            // Inicializar Google Identity Services
            await new Promise<void>(() => {
                window.google.accounts.id.initialize({
                    client_id: googleAuthConfig.clientId,
                    callback: async (response: CredentialResponse) => {
                        try {
                            // Decodificar el JWT token
                            const payload: GoogleJWTPayload = JSON.parse(atob(response.credential.split('.')[1]));
                            
                            const googleData: GoogleAuthData = {
                                googleId: payload.sub,
                                email: payload.email,
                                name: payload.name,
                                picture: payload.picture
                            };

                            // Enviar datos al backend
                            const authResponse = await googleAuth(googleData);

                            // Guardar en el store
                            setUser({
                                id: authResponse.id,
                                email: authResponse.email,
                                roles: authResponse.roles
                            }, authResponse.token);

                            // Mostrar mensaje de éxito
                            if (authResponse.isNewUser) {
                                toast.success(googleAuthConfig.messages.newUser);
                            } else {
                                toast.success(googleAuthConfig.messages.existingUser);
                            }

                            // Redirigir según el rol
                            if (authResponse.roles === 'admin' || authResponse.roles === 'superadmin') {
                                navigate('/dashboard');
                            } else if (authResponse.roles === 'support') {
                                navigate('/support/dashboard');
                            } else {
                                navigate('/');
                            }

                            onSuccess?.();
                        } catch (error: any) {
                            const errorMessage = error.response?.data?.message || error.message || googleAuthConfig.messages.error;
                            toast.error(errorMessage);
                            onError?.(errorMessage);
                        } finally {
                            setIsLoading(false);
                        }
                    },
                    error_callback: (error: unknown) => {
                        console.error('Google Auth Error:', error);
                        const errorMessage = googleAuthConfig.messages.error;
                        toast.error(errorMessage);
                        onError?.(errorMessage);
                        setIsLoading(false);
                    }
                });

                // Mostrar el popup de Google
                window.google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        // Si no se puede mostrar el popup, usar el método alternativo
                        window.google.accounts.id.renderButton(
                            document.getElementById('google-signin-button') as HTMLElement,
                            googleAuthConfig.ui
                        );
                    }
                });
            });

        } catch (error: any) {
            console.error('Google Login Error:', error);
            const errorMessage = error.message || 'Error al configurar Google Auth';
            toast.error(errorMessage);
            onError?.(errorMessage);
            setIsLoading(false);
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'w-8 h-8';
            case 'lg':
                return 'w-12 h-12';
            default:
                return 'w-10 h-10';
        }
    };

    const getVariantClasses = () => {
        switch (variant) {
            case 'minimal':
                return 'bg-transparent hover:bg-gray-100/10 border border-gray-500/30';
            case 'outline':
                return 'bg-transparent hover:bg-white/10 border-2 border-white/50';
            default:
                return 'bg-gray-600/50 hover:bg-gray-600/70 border border-gray-500/50';
        }
    };

    return (
        <>
            {/* Botón personalizado */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading || disabled}
                className={`
                    ${getSizeClasses()} 
                    ${getVariantClasses()}
                    rounded-full transition-all duration-300 
                    flex items-center justify-center 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:scale-105 active:scale-95
                    ${className}
                `}
                aria-label="Iniciar sesión con Google"
            >
                {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <svg 
                            className="w-4 h-4" 
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path 
                                fill="#4285F4" 
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path 
                                fill="#34A853" 
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path 
                                fill="#FBBC05" 
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path 
                                fill="#EA4335" 
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                    </div>
                )}
            </button>

            {/* Botón oculto para Google Identity Services */}
            <div 
                id="google-signin-button" 
                className="hidden"
                aria-hidden="true"
            />
        </>
    );
};

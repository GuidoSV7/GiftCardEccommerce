export const googleAuthConfig = {
    // Configuración de Google Identity Services
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    
    // Configuración de UI
    ui: {
        theme: 'outline' as const,
        size: 'large' as const,
        type: 'standard' as const,
        shape: 'rectangular' as const,
        text: 'signin_with' as const,
        logoAlignment: 'left' as const,
    },
    
    // Configuración de callback
    callback: {
        autoSelect: false,
        cancelOnTapOutside: true,
        context: 'signin' as const,
        uxMode: 'popup' as const,
    },
    
    // Configuración de validación
    validation: {
        requireEmail: true,
        requireName: true,
        requirePicture: false,
    },
    
    // Mensajes de error
    messages: {
        loading: 'Iniciando sesión con Google...',
        success: '¡Inicio de sesión exitoso!',
        error: 'Error al iniciar sesión con Google',
        newUser: '¡Cuenta creada exitosamente! Bienvenido a VEMPERGAMES',
        existingUser: '¡Bienvenido de vuelta!',
    }
};

// Validar configuración
export const validateGoogleConfig = (): boolean => {
    if (!googleAuthConfig.clientId) {
        console.error('VITE_GOOGLE_CLIENT_ID no está configurado');
        return false;
    }
    return true;
};

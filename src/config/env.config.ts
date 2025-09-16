export const envConfig = {
  // URLs de la API
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  wsUrl: import.meta.env.VITE_WS_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001',
  
  // Configuración de Google OAuth
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  
  // Configuración de la app
  appName: import.meta.env.VITE_APP_NAME || 'GifCard Ecommerce',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Configuración de desarrollo
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Configuración de WebSocket
  wsEnabled: import.meta.env.VITE_WS_ENABLED !== 'false', // Habilitado por defecto
  
  // Configuración de fallback
  fallbackEnabled: import.meta.env.VITE_FALLBACK_ENABLED !== 'false', // Habilitado por defecto
};

// Validar configuración
if (!envConfig.apiUrl) {
  console.warn('⚠️ VITE_API_URL no está configurado, usando localhost:3001');
}

if (!envConfig.googleClientId) {
  console.warn('⚠️ VITE_GOOGLE_CLIENT_ID no está configurado');
}

console.log('🔧 Configuración de entorno:', {
  apiUrl: envConfig.apiUrl,
  wsUrl: envConfig.wsUrl,
  isDevelopment: envConfig.isDevelopment,
  wsEnabled: envConfig.wsEnabled,
  fallbackEnabled: envConfig.fallbackEnabled,
});

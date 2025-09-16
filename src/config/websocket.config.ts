import { envConfig } from './env.config';

export const websocketConfig = {
  // URL del servidor WebSocket
  serverUrl: envConfig.apiUrl,
  
  // URL específica para WebSockets
  wsUrl: envConfig.wsUrl,
  
  // Configuración de reconexión
  reconnection: {
    enabled: true,
    attempts: 5,
    delay: 1000,
    maxDelay: 5000,
  },
  
  // Configuración de timeout
  timeout: {
    connection: 5000, // 5 segundos - reducir timeout para fallback más rápido
    typing: 3000, // 3 segundos para indicador de typing
  },
  
  // Configuración de eventos
  events: {
    // Intervalos de emisión de estadísticas
    statsInterval: 30000, // 30 segundos
    
    // Intervalos de limpieza
    cleanupInterval: 60000, // 1 minuto
  },
  
  // Configuración de desarrollo
  development: {
    logEvents: import.meta.env.DEV,
    logErrors: true,
  }
};

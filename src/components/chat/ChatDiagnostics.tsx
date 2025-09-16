import { useState, useEffect } from 'react';
import { useChatStable } from '../../hooks/useChatStable';
import { envConfig } from '../../config/env.config';

interface ChatDiagnosticsProps {
  sessionId?: string;
  onClose?: () => void;
}

export const ChatDiagnostics = ({ sessionId }: ChatDiagnosticsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [connectionTest, setConnectionTest] = useState<{
    api: 'testing' | 'success' | 'error';
    ws: 'testing' | 'success' | 'error';
  }>({ api: 'testing', ws: 'testing' });

  const {
    isConnected,
    connectionStatus,
    mode,
    connectionAttempts,
    retryWebSocket,
    forceFallback
  } = useChatStable({
    sessionId,
    fallbackEnabled: true
  });

  // Test de conexión a la API
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const response = await fetch(`${envConfig.apiUrl}/api/health`, {
          method: 'GET',
          timeout: 5000
        } as any);
        
        if (response.ok) {
          setConnectionTest(prev => ({ ...prev, api: 'success' }));
        } else {
          setConnectionTest(prev => ({ ...prev, api: 'error' }));
        }
      } catch (error) {
        console.error('Error testing API connection:', error);
        setConnectionTest(prev => ({ ...prev, api: 'error' }));
      }
    };

    testApiConnection();
  }, []);

  // Test de conexión WebSocket
  useEffect(() => {
    const testWsConnection = () => {
      try {
        // Usar la URL correcta para WebSocket con namespace
        const wsUrl = envConfig.wsUrl.replace('http', 'ws').replace('https', 'wss');
        const ws = new WebSocket(`${wsUrl}/chat`);
        
        ws.onopen = () => {
          setConnectionTest(prev => ({ ...prev, ws: 'success' }));
          ws.close();
        };
        
        ws.onerror = () => {
          setConnectionTest(prev => ({ ...prev, ws: 'error' }));
        };
        
        ws.onclose = () => {
          // Connection closed normally
        };
      } catch (error) {
        console.error('Error testing WebSocket connection:', error);
        setConnectionTest(prev => ({ ...prev, ws: 'error' }));
      }
    };

    testWsConnection();
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg"
        title="Diagnósticos de Chat"
      >
        🔧
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 bg-white rounded-lg shadow-2xl w-80 max-h-96 overflow-y-auto border border-gray-200">
      <div className="bg-gray-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold">Diagnósticos de Chat</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Configuración */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Configuración</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>API URL:</strong> {envConfig.apiUrl}</p>
            <p><strong>WS URL:</strong> {envConfig.wsUrl}</p>
            <p><strong>Modo:</strong> {envConfig.isDevelopment ? 'Desarrollo' : 'Producción'}</p>
          </div>
        </div>

        {/* Estado de conexión */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Estado de Conexión</h4>
          <div className="text-sm space-y-1">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                isConnected ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <span>Estado: {isConnected ? 'Conectado' : 'Desconectado'}</span>
            </div>
            <p><strong>Modo:</strong> {mode}</p>
            <p><strong>Status:</strong> {connectionStatus}</p>
            <p><strong>Intentos:</strong> {connectionAttempts}</p>
          </div>
        </div>

        {/* Test de conexión */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Test de Conexión</h4>
          <div className="text-sm space-y-1">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                connectionTest.api === 'success' ? 'bg-green-400' :
                connectionTest.api === 'error' ? 'bg-red-400' : 'bg-yellow-400'
              }`}></div>
              <span>API: {connectionTest.api}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                connectionTest.ws === 'success' ? 'bg-green-400' :
                connectionTest.ws === 'error' ? 'bg-red-400' : 'bg-yellow-400'
              }`}></div>
              <span>WebSocket: {connectionTest.ws}</span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Acciones</h4>
          <div className="space-y-2">
            <button
              onClick={retryWebSocket}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
            >
              Reintentar WebSocket
            </button>
            <button
              onClick={forceFallback}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm"
            >
              Forzar Fallback
            </button>
          </div>
        </div>

        {/* Información de debug */}
        {envConfig.isDevelopment && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Debug Info</h4>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Session ID: {sessionId || 'N/A'}</p>
              <p>WS Enabled: {envConfig.wsEnabled ? 'Yes' : 'No'}</p>
              <p>Fallback Enabled: {envConfig.fallbackEnabled ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

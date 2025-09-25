import { useState, useEffect, useCallback, useRef } from 'react';
import { useChatSocket } from './useChatSocket';
import { useChatFallback } from './useChatFallback';
import type { ChatMessage } from '../types';

interface UseChatStableOptions {
  sessionId?: string;
  onNewMessage?: (message: ChatMessage) => void;
  onSessionJoined?: (data: { sessionId: string; messages: ChatMessage[] }) => void;
  onSessionClosed?: (data: { sessionId: string }) => void;
  onNewPendingSession?: (data: { sessionId: string; userId: string; timestamp: string }) => void;
  onStatsUpdate?: (stats: any) => void;
  fallbackEnabled?: boolean;
  isSupportView?: boolean; // Para usar el endpoint correcto en fallback
}

export const useChatStable = (options: UseChatStableOptions = {}) => {
  const [useWebSocket, setUseWebSocket] = useState(true);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const maxConnectionAttempts = 2; // Reducir intentos para cambiar a fallback más rápido

  // Refs para mantener referencias estables
  const optionsRef = useRef(options);
  const sessionIdRef = useRef(options.sessionId);
  const fallbackEnabledRef = useRef(options.fallbackEnabled ?? true);

  // Actualizar refs cuando cambian las opciones
  useEffect(() => {
    optionsRef.current = options;
    sessionIdRef.current = options.sessionId;
    fallbackEnabledRef.current = options.fallbackEnabled ?? true;
  }, [options]);

  // Callbacks estables que no cambian
  const stableCallbacks = useRef({
    onNewMessage: (message: ChatMessage) => {
      if (optionsRef.current.onNewMessage) {
        optionsRef.current.onNewMessage(message);
      }
    },
    onSessionJoined: (data: { sessionId: string; messages: ChatMessage[] }) => {
      if (optionsRef.current.onSessionJoined) {
        optionsRef.current.onSessionJoined(data);
      }
    },
    onSessionClosed: (data: { sessionId: string }) => {
      if (optionsRef.current.onSessionClosed) {
        optionsRef.current.onSessionClosed(data);
      }
    },
    onNewPendingSession: (data: { sessionId: string; userId: string; timestamp: string }) => {
      if (optionsRef.current.onNewPendingSession) {
        optionsRef.current.onNewPendingSession(data);
      }
    },
    onStatsUpdate: (stats: any) => {
      if (optionsRef.current.onStatsUpdate) {
        optionsRef.current.onStatsUpdate(stats);
      }
    }
  });

  // Hook de WebSocket con callbacks estables (solo cuando useWebSocket es true y hay sessionId)
  const socketResult = useChatSocket(
    useWebSocket && options.sessionId ? {
      sessionId: options.sessionId,
      ...stableCallbacks.current
    } : {}
  );

  // Hook de fallback (solo cuando useWebSocket es false y hay sessionId)
  const fallbackResult = useChatFallback(
    !useWebSocket && options.sessionId ? {
      sessionId: options.sessionId,
      enabled: fallbackEnabledRef.current,
      refetchInterval: 5000,
      isSupportView: options.isSupportView
    } : { enabled: false }
  );

  // Detectar fallos de WebSocket (solo cuando hay sessionId)
  useEffect(() => {
    if (!options.sessionId) return;
    
    console.log('🔍 Verificando estado WebSocket:', {
      useWebSocket,
      isConnected: socketResult.isConnected,
      connectionAttempts,
      maxConnectionAttempts
    });
    
    if (useWebSocket && !socketResult.isConnected) {
      setConnectionAttempts(prev => {
        const newAttempts = prev + 1;
        console.log(`🔄 Intento de conexión WebSocket: ${newAttempts}/${maxConnectionAttempts}`);
        if (newAttempts >= maxConnectionAttempts && fallbackEnabledRef.current) {
          console.warn('⚠️ WebSocket falló, cambiando a modo fallback (polling)');
          setUseWebSocket(false);
        }
        return newAttempts;
      });
    } else if (useWebSocket && socketResult.isConnected) {
      console.log('✅ WebSocket conectado exitosamente, reseteando intentos');
      setConnectionAttempts(0);
    }
  }, [useWebSocket, socketResult.isConnected, maxConnectionAttempts, options.sessionId]);

  // Cambiar automáticamente a fallback si hay errores de conexión persistentes
  useEffect(() => {
    if (useWebSocket && connectionAttempts >= maxConnectionAttempts && fallbackEnabledRef.current) {
      console.warn('🔄 Cambiando automáticamente a modo fallback debido a errores de conexión');
      setUseWebSocket(false);
    }
  }, [useWebSocket, connectionAttempts, maxConnectionAttempts]);

  // Funciones de control estables
  const retryWebSocket = useCallback(() => {
    setConnectionAttempts(0);
    setUseWebSocket(true);
  }, []);

  const forceFallback = useCallback(() => {
    setUseWebSocket(false);
  }, []);

  // Retornar el resultado apropiado
  if (useWebSocket) {
    return {
      ...socketResult,
      mode: 'websocket' as const,
      retryWebSocket,
      forceFallback,
      connectionAttempts,
    };
  } else {
    return {
      ...fallbackResult,
      mode: 'fallback' as const,
      retryWebSocket,
      forceFallback,
      connectionAttempts,
    };
  }
};

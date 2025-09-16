import { useState, useEffect, useCallback, useRef } from 'react';
import { useChatSocket } from './useChatSocket';
import { useChatFallback } from './useChatFallback';
import type { ChatMessage } from '../types';

interface UseChatHybridOptions {
  sessionId?: string;
  onNewMessage?: (message: ChatMessage) => void;
  onSessionJoined?: (data: { sessionId: string; messages: ChatMessage[] }) => void;
  onSessionClosed?: (data: { sessionId: string }) => void;
  onNewPendingSession?: (data: { sessionId: string; userId: string; timestamp: string }) => void;
  onStatsUpdate?: (stats: any) => void;
  fallbackEnabled?: boolean;
}

export const useChatHybrid = (options: UseChatHybridOptions = {}) => {
  const [useWebSocket, setUseWebSocket] = useState(true);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const maxConnectionAttempts = 3;

  // Usar refs para estabilizar los callbacks
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const {
    fallbackEnabled = true
  } = options;

  // Callbacks estables usando useCallback
  const handleNewMessage = useCallback((message: ChatMessage) => {
    if (optionsRef.current.onNewMessage) {
      optionsRef.current.onNewMessage(message);
    }
  }, []);

  const handleSessionJoined = useCallback((data: { sessionId: string; messages: ChatMessage[] }) => {
    if (optionsRef.current.onSessionJoined) {
      optionsRef.current.onSessionJoined(data);
    }
  }, []);

  const handleSessionClosed = useCallback((data: { sessionId: string }) => {
    if (optionsRef.current.onSessionClosed) {
      optionsRef.current.onSessionClosed(data);
    }
  }, []);

  const handleNewPendingSession = useCallback((data: { sessionId: string; userId: string; timestamp: string }) => {
    if (optionsRef.current.onNewPendingSession) {
      optionsRef.current.onNewPendingSession(data);
    }
  }, []);

  const handleStatsUpdate = useCallback((stats: any) => {
    if (optionsRef.current.onStatsUpdate) {
      optionsRef.current.onStatsUpdate(stats);
    }
  }, []);

  // Hook de WebSocket
  const socketResult = useChatSocket({
    sessionId: options.sessionId,
    onNewMessage: handleNewMessage,
    onSessionJoined: handleSessionJoined,
    onSessionClosed: handleSessionClosed,
    onNewPendingSession: handleNewPendingSession,
    onStatsUpdate: handleStatsUpdate
  });

  // Hook de fallback (polling)
  const fallbackResult = useChatFallback({
    sessionId: options.sessionId,
    enabled: !useWebSocket && fallbackEnabled,
    refetchInterval: 5000
  });

  // Detectar si WebSocket falla y cambiar a fallback
  useEffect(() => {
    if (useWebSocket && !socketResult.isConnected) {
      setConnectionAttempts(prev => prev + 1);
      
      if (connectionAttempts >= maxConnectionAttempts && fallbackEnabled) {
        console.warn('⚠️ WebSocket falló, cambiando a modo fallback (polling)');
        setUseWebSocket(false);
      }
    } else if (useWebSocket && socketResult.isConnected) {
      // Resetear contador si se conecta exitosamente
      setConnectionAttempts(0);
    }
  }, [useWebSocket, socketResult.isConnected, connectionAttempts, maxConnectionAttempts, fallbackEnabled]);

  // Función para reintentar WebSocket
  const retryWebSocket = useCallback(() => {
    setConnectionAttempts(0);
    setUseWebSocket(true);
  }, []);

  // Función para forzar fallback
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

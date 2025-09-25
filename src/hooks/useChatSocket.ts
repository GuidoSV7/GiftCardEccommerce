import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import { websocketConfig } from '../config/websocket.config';
import type { ChatMessage, ChatSession } from '../types';

interface UseChatSocketOptions {
  sessionId?: string;
  onNewMessage?: (message: ChatMessage) => void;
  onSessionJoined?: (data: { sessionId: string; messages: ChatMessage[] }) => void;
  onSessionClosed?: (data: { sessionId: string }) => void;
  onNewPendingSession?: (data: { sessionId: string; userId: string; timestamp: string }) => void;
  onStatsUpdate?: (stats: any) => void;
}

interface TypingData {
  isTyping: boolean;
  userId: string;
  userRole?: string;
}

export const useChatSocket = (options: UseChatSocketOptions = {}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<TypingData | null>(null);
  const [pendingSessions, setPendingSessions] = useState<ChatSession[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  const { token, user } = useAuthStore();
  const typingTimeoutRef = useRef<number | null>(null);
  
  // Estabilizar la configuración del WebSocket
  const stableWebsocketConfig = useMemo(() => websocketConfig, []);
  
  // Usar refs para los callbacks para evitar recrearlos en cada render
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Función para limpiar el timeout de typing
  const clearTypingTimeout = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  // Función para manejar el timeout de typing
  const handleTypingTimeout = useCallback(() => {
    setIsTyping(null);
  }, []);

  useEffect(() => {
    if (!token || !user || !options.sessionId) return;

    // Usar la URL de la API para WebSocket (Socket.IO maneja el protocolo automáticamente)
    const wsUrl = stableWebsocketConfig.wsUrl;
    console.log('🔌 Conectando a WebSocket:', `${wsUrl}`);
    console.log('🔑 Token disponible:', token ? 'Sí' : 'No');
    console.log('🔑 Token length:', token ? token.length : 0);
    console.log('🔑 Token (primeros 50 chars):', token ? token.substring(0, 50) + '...' : 'No token');
    console.log('👤 Usuario:', user);

    const newSocket = io(`${wsUrl}`, {
      auth: { 
        token
      },
      transports: ['websocket', 'polling'], // Priorizar WebSocket primero
      autoConnect: true,
      reconnection: stableWebsocketConfig.reconnection.enabled,
      reconnectionAttempts: stableWebsocketConfig.reconnection.attempts,
      reconnectionDelay: stableWebsocketConfig.reconnection.delay,
      reconnectionDelayMax: stableWebsocketConfig.reconnection.maxDelay,
      timeout: stableWebsocketConfig.timeout.connection,
      forceNew: true, // Forzar nueva conexión
      // Configuración adicional para manejar errores
      withCredentials: true,
      upgrade: true
    });

    // Eventos de conexión
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Conectado al chat WebSocket');
      console.log('🔌 Socket ID:', newSocket.id);
      console.log('🔌 Transport:', newSocket.io.engine.transport.name);
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('❌ Desconectado del chat WebSocket:', reason);
      console.log('🔌 Socket ID:', newSocket.id);
    });

    newSocket.on('connect_error', (error) => {
      setIsConnected(false);
      console.error('❌ Error de conexión WebSocket:', error);
      console.error('🔌 Error details:', error.message);
    });

    // Eventos adicionales para debugging
    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconectado al WebSocket, intento:', attemptNumber);
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Intentando reconectar, intento:', attemptNumber);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Error de reconexión:', error);
    });

    newSocket.on('connected', (data) => {
      console.log('🔗 Autenticado en el chat:', data);
    });

    // Evento para debugging de errores del servidor
    newSocket.on('error', (error) => {
      console.error('❌ Error del servidor WebSocket:', error);
    });

    // Eventos de expiración de token
    newSocket.on('token-expired', (data) => {
      console.error('🔑 Token expirado:', data);
      // Disparar evento personalizado para que el hook useTokenExpiration lo capture
      window.dispatchEvent(new CustomEvent('token-expired', { detail: data }));
    });

    newSocket.on('auth-error', (data) => {
      console.error('🔑 Error de autenticación:', data);
      // Disparar evento personalizado para que el hook useTokenExpiration lo capture
      window.dispatchEvent(new CustomEvent('auth-error', { detail: data }));
    });

    // Evento para debugging de eventos personalizados
    newSocket.onAny((event, ...args) => {
      console.log('📡 Evento WebSocket recibido:', event, args);
    });

    // Eventos de mensajes
    newSocket.on('new-message', (message: ChatMessage) => {
      console.log('💬 Nuevo mensaje recibido via WebSocket:', message);
      setMessages(prev => {
        // Evitar duplicados
        const exists = prev.some(msg => msg.id === message.id);
        if (exists) {
          console.log('⚠️ Mensaje duplicado ignorado:', message.id);
          return prev;
        }
        console.log('✅ Mensaje añadido a la lista:', message.id);
        return [...prev, message];
      });
      
      if (optionsRef.current.onNewMessage) {
        console.log('🔄 Ejecutando callback onNewMessage');
        optionsRef.current.onNewMessage(message);
      }
    });

    newSocket.on('session-joined', (data: { sessionId: string; messages: ChatMessage[] }) => {
      setMessages(data.messages);
      if (optionsRef.current.onSessionJoined) {
        optionsRef.current.onSessionJoined(data);
      }
    });

    // Eventos de typing
    newSocket.on('user-typing', (data: TypingData) => {
      setIsTyping(data);
      
      // Limpiar typing después del timeout configurado
      clearTypingTimeout();
      typingTimeoutRef.current = setTimeout(handleTypingTimeout, websocketConfig.timeout.typing);
    });

    // Eventos de sesión
    newSocket.on('session-closed', (data: { sessionId: string }) => {
      if (optionsRef.current.onSessionClosed) {
        optionsRef.current.onSessionClosed(data);
      }
    });

    newSocket.on('session-status-changed', (data: { sessionId: string; status: string }) => {
      console.log('📊 Estado de sesión cambiado:', data);
    });

    // Eventos para agentes de soporte
    newSocket.on('new-pending-session', (data: { sessionId: string; userId: string; timestamp: string }) => {
      if (optionsRef.current.onNewPendingSession) {
        optionsRef.current.onNewPendingSession(data);
      }
    });

    newSocket.on('pending-sessions', (data: { sessions: ChatSession[] }) => {
      setPendingSessions(data.sessions);
    });

    newSocket.on('new-user-message', (data: { sessionId: string; message: ChatMessage; userId: string }) => {
      console.log('💬 Nuevo mensaje de usuario:', data);
    });

    newSocket.on('session-assigned', (data: { sessionId: string }) => {
      console.log('👤 Sesión asignada:', data);
    });

    // Eventos de estadísticas
    newSocket.on('stats-update', (data: any) => {
      setStats(data);
      if (optionsRef.current.onStatsUpdate) {
        optionsRef.current.onStatsUpdate(data);
      }
    });

    // Eventos de error
    newSocket.on('error', (error: { message: string }) => {
      console.error('❌ Error en WebSocket:', error);
    });

    setSocket(newSocket);

    return () => {
      clearTypingTimeout();
      newSocket.close();
    };
  }, [token, user, stableWebsocketConfig, options.sessionId]); // Dependencias estables

  // Unirse a una sesión
  useEffect(() => {
    if (socket && options.sessionId) {
      socket.emit('join-session', { sessionId: options.sessionId });
    }
  }, [socket, options.sessionId]);

  // Funciones para enviar eventos
  const sendMessage = useCallback((message: string) => {
    console.log('📤 Enviando mensaje:', { message, sessionId: options.sessionId, socketConnected: !!socket });
    if (socket && options.sessionId) {
      socket.emit('send-message', { 
        sessionId: options.sessionId, 
        message 
      });
      console.log('✅ Mensaje enviado via WebSocket');
    } else {
      console.error('❌ No se puede enviar mensaje:', { socket: !!socket, sessionId: options.sessionId });
    }
  }, [socket, options.sessionId]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (socket && options.sessionId) {
      socket.emit('typing', { 
        sessionId: options.sessionId, 
        isTyping 
      });
    }
  }, [socket, options.sessionId]);

  const markMessagesAsRead = useCallback(() => {
    if (socket && options.sessionId) {
      socket.emit('mark-read', { sessionId: options.sessionId });
    }
  }, [socket, options.sessionId]);

  // Función para limpiar mensajes
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Función para obtener el estado de conexión
  const getConnectionStatus = useCallback(() => {
    if (!socket) return 'disconnected';
    if (isConnected) return 'connected';
    return 'connecting';
  }, [socket, isConnected]);

  return {
    // Estado
    socket,
    isConnected,
    messages,
    isTyping,
    pendingSessions,
    stats,
    
    // Funciones
    sendMessage,
    sendTyping,
    markMessagesAsRead,
    clearMessages,
    getConnectionStatus,
    
    // Estado de conexión
    connectionStatus: getConnectionStatus(),
  };
};

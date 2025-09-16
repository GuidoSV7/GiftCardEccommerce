import { useEffect, useRef, useState, useCallback } from 'react';
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
    if (!token || !user) return;

    // Usar la URL específica para WebSockets
    const wsUrl = websocketConfig.wsUrl;
    console.log('🔌 Conectando a WebSocket:', `${wsUrl}/chat`);

    const newSocket = io(`${wsUrl}/chat`, {
      auth: { 
        token,
        Authorization: `Bearer ${token}` // Incluir Authorization header explícitamente
      },
      transports: ['websocket', 'polling'], // Fallback a polling si WebSocket falla
      autoConnect: true,
      reconnection: websocketConfig.reconnection.enabled,
      reconnectionAttempts: websocketConfig.reconnection.attempts,
      reconnectionDelay: websocketConfig.reconnection.delay,
      reconnectionDelayMax: websocketConfig.reconnection.maxDelay,
      timeout: websocketConfig.timeout.connection,
      forceNew: true, // Forzar nueva conexión
      // Configuración adicional para manejar errores
      withCredentials: true,
      upgrade: true,
      extraHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Eventos de conexión
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Conectado al chat WebSocket');
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('❌ Desconectado del chat WebSocket:', reason);
    });

    newSocket.on('connect_error', (error) => {
      setIsConnected(false);
      console.error('❌ Error de conexión WebSocket:', error);
    });

    newSocket.on('connected', (data) => {
      console.log('🔗 Autenticado en el chat:', data);
    });

    // Eventos de mensajes
    newSocket.on('new-message', (message: ChatMessage) => {
      setMessages(prev => {
        // Evitar duplicados
        const exists = prev.some(msg => msg.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
      
      if (optionsRef.current.onNewMessage) {
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
  }, [token, user]); // Solo dependencias estables

  // Unirse a una sesión
  useEffect(() => {
    if (socket && options.sessionId) {
      socket.emit('join-session', { sessionId: options.sessionId });
    }
  }, [socket, options.sessionId]);

  // Funciones para enviar eventos
  const sendMessage = useCallback((message: string) => {
    if (socket && options.sessionId) {
      socket.emit('send-message', { 
        sessionId: options.sessionId, 
        message 
      });
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

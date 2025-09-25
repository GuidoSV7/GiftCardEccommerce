import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getChatMessages, 
    getChatMessagesForSupport,
    sendChatMessage, 
    markMessagesAsRead 
} from '../services/chatService';


interface UseChatFallbackOptions {
  sessionId?: string;
  enabled?: boolean;
  refetchInterval?: number;
  isSupportView?: boolean; // Para usar el endpoint correcto
}

export const useChatFallback = (options: UseChatFallbackOptions = {}) => {
  const [isConnected] = useState(true); // Simular conexión
  const queryClient = useQueryClient();

  const {
    sessionId,
    enabled = true,
    refetchInterval = 5000,
    isSupportView = false
  } = options;

  // Query para obtener mensajes con polling
  const { data: fetchedMessages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['chatMessages', sessionId, isSupportView ? 'support' : 'user'],
    queryFn: () => isSupportView ? getChatMessagesForSupport(sessionId!) : getChatMessages(sessionId!),
    retry: 2,
    staleTime: 5000, // 5 segundos - aumentar para reducir refetches
    refetchInterval: enabled ? refetchInterval : false,
    enabled: !!sessionId && enabled,
  });

  // Usar directamente los mensajes de la query
  const messages = fetchedMessages || [];

  // Mutación para enviar mensaje
  const sendMessageMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: () => {
      // Invalidar la query para refrescar los mensajes
      queryClient.invalidateQueries({ queryKey: ['chatMessages', sessionId, isSupportView ? 'support' : 'user'] });
    }
  });

  // Mutación para marcar como leído
  const markReadMutation = useMutation({
    mutationFn: (sessionId: string) => markMessagesAsRead(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', sessionId, isSupportView ? 'support' : 'user'] });
    }
  });


  // Funciones para enviar eventos
  const sendMessage = useCallback((message: string) => {
    if (sessionId) {
      sendMessageMutation.mutate({
        message,
        sessionId
      } as any);
    }
  }, [sessionId, sendMessageMutation]);

  const sendTyping = useCallback((isTyping: boolean) => {
    // En modo fallback, no hay indicador de typing
    console.log('Typing fallback:', isTyping);
  }, []);

  const markMessagesAsReadCallback = useCallback(() => {
    if (sessionId) {
      markReadMutation.mutate(sessionId);
    }
  }, [sessionId, markReadMutation]);

  const clearMessages = useCallback(() => {
    // En modo fallback, no podemos limpiar mensajes localmente
    // Los mensajes se mantienen en el servidor
    console.log('Clear messages requested in fallback mode');
  }, []);

  const getConnectionStatus = useCallback(() => {
    return 'fallback';
  }, []);

  return {
    // Estado
    messages,
    isConnected,
    isTyping: null,
    pendingSessions: [],
    stats: null,
    
    // Funciones
    sendMessage,
    sendTyping,
    markMessagesAsRead: markMessagesAsReadCallback,
    clearMessages,
    getConnectionStatus,
    
    // Estado de conexión
    connectionStatus: 'fallback',
    
    // Estado de carga
    isLoading: messagesLoading,
    isSending: sendMessageMutation.isPending,
  };
};

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { 
    getActiveChatSession, 
    createChatSession, 
    closeChatSession
} from '../../services/chatService';
import { useChatStable } from '../../hooks/useChatStable';
import { ChatDiagnostics } from './ChatDiagnostics';
import type { ChatMessageFormData, ChatSession } from '../../types';

interface ChatSupportProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ChatSupport = ({ isOpen, onClose }: ChatSupportProps) => {
    const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    // Configuración del formulario
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ChatMessageFormData>();

    // Hook estable (WebSocket + Fallback)
    const {
        isConnected,
        messages,
        isTyping,
        sendMessage,
        sendTyping,
        markMessagesAsRead,
        clearMessages,
        mode,
        retryWebSocket
    } = useChatStable({
        sessionId: currentSession?.id,
        onNewMessage: () => {
            // Auto-scroll cuando llega un nuevo mensaje
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        },
        onSessionJoined: (data) => {
            console.log('Sesión unida:', data);
        },
        onSessionClosed: (data) => {
            console.log('Sesión cerrada:', data);
            setCurrentSession(null);
            clearMessages();
        }
    });

    // Query para obtener sesión activa (solo al abrir)
    const { data: activeSession } = useQuery({
        queryKey: ['chatSession'],
        queryFn: getActiveChatSession,
        retry: 2,
        staleTime: 30 * 1000, // 30 segundos
        enabled: isOpen,
    });

    // Mutación para crear sesión
    const createSessionMutation = useMutation({
        mutationFn: createChatSession,
        onError: (error: any) => {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Error al iniciar chat de soporte');
            }
        },
        onSuccess: (session) => {
            setCurrentSession(session);
            toast.success('Chat iniciado exitosamente');
        }
    });

    // Ya no necesitamos mutación para enviar mensaje - se hace via WebSocket

    // Mutación para cerrar sesión
    const closeSessionMutation = useMutation({
        mutationFn: closeChatSession,
        onError: (error: any) => {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Error al cerrar chat');
            }
        },
        onSuccess: () => {
            setCurrentSession(null);
            queryClient.invalidateQueries({ queryKey: ['chatSession'] });
            queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
            toast.success('Chat cerrado exitosamente');
            onClose();
        }
    });

    // Efectos
    useEffect(() => {
        if (activeSession) {
            setCurrentSession(activeSession);
        }
    }, [activeSession]);

    // Scroll automático a los mensajes nuevos
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handlers
    const handleStartChat = () => {
        createSessionMutation.mutate();
    };

    const handleSendMessage = async (data: ChatMessageFormData) => {
        if (!currentSession || !isConnected) {
            toast.error('No hay conexión con el servidor');
            return;
        }
        
        try {
            // Enviar mensaje via WebSocket
            sendMessage(data.message);
            reset();
            
            // Marcar mensajes como leídos
            markMessagesAsRead();
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            toast.error('Error al enviar mensaje');
        }
    };

    const handleTyping = (isTyping: boolean) => {
        sendTyping(isTyping);
    };

    const handleCloseChat = () => {
        if (currentSession?.id) {
            closeSessionMutation.mutate(currentSession.id);
        } else {
            onClose();
        }
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Componente de diagnósticos */}
            <ChatDiagnostics sessionId={currentSession?.id} />
            
            <div className="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col border border-gray-200">
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                    <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                            isConnected ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        <h3 className="font-semibold">Soporte en Vivo</h3>
                        <span className={`text-xs ml-2 px-2 py-1 rounded ${
                            mode === 'websocket' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-yellow-600 text-white'
                        }`}>
                            {mode === 'websocket' ? 'Tiempo Real' : 'Modo Fallback'}
                        </span>
                        {mode === 'fallback' && (
                            <button
                                onClick={retryWebSocket}
                                className="text-xs text-blue-200 hover:text-white ml-2 underline"
                            >
                                Reintentar WebSocket
                            </button>
                        )}
                    </div>
                    <button
                        onClick={handleCloseChat}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                    {!currentSession ? (
                        /* Estado inicial - Iniciar chat */
                        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                ¿Necesitas ayuda?
                            </h4>
                            <p className="text-gray-600 text-sm mb-6">
                                Nuestro equipo de soporte está aquí para ayudarte. Inicia una conversación y te responderemos pronto.
                            </p>
                            <button
                                onClick={handleStartChat}
                                disabled={createSessionMutation.isPending}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                {createSessionMutation.isPending ? 'Iniciando...' : 'Iniciar Chat'}
                            </button>
                        </div>
                    ) : (
                        /* Chat activo */
                        <>
                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {messages.length === 0 ? (
                                    <div className="text-center text-gray-500 text-sm">
                                        <p>¡Hola! ¿En qué puedo ayudarte hoy?</p>
                                    </div>
                                ) : (
                                    messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                                    message.sender === 'user'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-200 text-gray-800'
                                                }`}
                                            >
                                                <p>{message.message}</p>
                                                <p className={`text-xs mt-1 ${
                                                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                                                }`}>
                                                    {formatTime(message.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                
                                {/* Typing indicator */}
                                {isTyping && isTyping.isTyping && isTyping.userRole === 'support' && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="border-t border-gray-200 p-4">
                                <form onSubmit={handleSubmit(handleSendMessage)} className="flex space-x-2">
                                    <input
                                        {...register('message', { 
                                            required: 'El mensaje es requerido',
                                            minLength: { value: 1, message: 'El mensaje no puede estar vacío' }
                                        })}
                                        type="text"
                                        placeholder="Escribe tu mensaje..."
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={!isConnected}
                                        onFocus={() => handleTyping(true)}
                                        onBlur={() => handleTyping(false)}
                                        onKeyDown={() => handleTyping(true)}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!isConnected || !!errors.message}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </form>
                                {errors.message && (
                                    <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

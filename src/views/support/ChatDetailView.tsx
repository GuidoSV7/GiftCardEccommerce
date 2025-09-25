import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { 
    getChatMessagesForSupport,
    sendSupportMessage,
    releaseChatSession,
    takeChatSession,
    getAllChatSessions,
    closeChatSessionBySupport
} from '../../services/chatService';
import { useChatStable } from '../../hooks/useChatStable';
import type { ChatMessageFormData } from '../../types';

export default function ChatDetailView() {
    const { id: sessionId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ChatMessageFormData>();
    
    // Estado para el modal de chat tomado
    const [showChatTakenModal, setShowChatTakenModal] = useState(false);
    const [takenByAgent, setTakenByAgent] = useState<{ name?: string; email?: string } | null>(null);

    // Query para obtener mensajes del chat
    const { data: messages = [], isLoading: messagesLoading } = useQuery({
        queryKey: ['chatMessages', sessionId, 'support'],
        queryFn: async () => {
            console.log('📥 Obteniendo mensajes para sesión:', sessionId);
            const result = await getChatMessagesForSupport(sessionId!);
            console.log('📥 Mensajes obtenidos:', result);
            return result;
        },
        enabled: !!sessionId,
        retry: 2,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false, // Evitar refetch innecesario
    });

    // Query para obtener todas las sesiones (para verificar estado del chat)
    const { data: allSessions = [] } = useQuery({
        queryKey: ['allChatSessions'],
        queryFn: getAllChatSessions,
        retry: 2,
        staleTime: 10 * 1000, // 10 segundos
    });

    // Hook estable para WebSocket - solo se inicializa cuando tenemos sessionId
    const {
        isConnected,
        markMessagesAsRead,
        mode
    } = useChatStable({
        sessionId: sessionId || undefined,
        isSupportView: true, // Indicar que es vista de soporte
        onNewMessage: () => {
            console.log('🔄 Nuevo mensaje recibido, invalidando query...');
            // Invalidar la query para recargar los mensajes
            queryClient.invalidateQueries({ queryKey: ['chatMessages', sessionId, 'support'] });
            
            // Auto-scroll cuando llega un nuevo mensaje
            setTimeout(() => {
                const messagesEnd = document.getElementById('messages-end');
                messagesEnd?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    });

    // Debug: Log del modo de conexión
    useEffect(() => {
        console.log('🔌 Modo de conexión:', mode);
        console.log('🔌 Estado de conexión:', isConnected ? 'Conectado' : 'Desconectado');
    }, [mode, isConnected]);

    // Mutación para tomar el chat
    const takeChatMutation = useMutation({
        mutationFn: takeChatSession,
        onSuccess: () => {
            toast.success('Chat tomado exitosamente');
            queryClient.invalidateQueries({ queryKey: ['allChatSessions'] });
        },
        onError: (error: any) => {
            if (error.response?.status === 409) {
                const errorMessage = error.response?.data?.message || 'Este chat ya está siendo atendido por otro agente';
                toast.error(errorMessage);
                // No navegar automáticamente, dejar que el usuario decida
                console.log('⚠️ Chat ya está siendo atendido por otro agente');
            } else {
                toast.error(error.response?.data?.message || 'Error al tomar el chat');
            }
        }
    });

    // Mutación para liberar el chat
    const releaseChatMutation = useMutation({
        mutationFn: releaseChatSession,
        onSuccess: () => {
            toast.success('Chat liberado exitosamente');
            queryClient.invalidateQueries({ queryKey: ['allChatSessions'] });
            navigate('/support/dashboard');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Error al liberar el chat');
        }
    });

    // Mutación para cerrar el chat
    const closeChatMutation = useMutation({
        mutationFn: closeChatSessionBySupport,
        onSuccess: () => {
            toast.success('Chat cerrado exitosamente');
            queryClient.invalidateQueries({ queryKey: ['allChatSessions'] });
            navigate('/support/dashboard');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Error al cerrar el chat');
        }
    });

    // Mutación para enviar mensaje de soporte
    const sendSupportMessageMutation = useMutation({
        mutationFn: ({ sessionId, message }: { sessionId: string; message: string }) => {
            console.log('📤 Enviando mensaje de soporte:', { sessionId, message });
            return sendSupportMessage(sessionId, message);
        },
        onSuccess: (data) => {
            console.log('✅ Mensaje de soporte enviado exitosamente:', data);
            // Invalidar la query para recargar los mensajes
            console.log('🔄 Invalidando query con key:', ['chatMessages', sessionId, 'support']);
            queryClient.invalidateQueries({ queryKey: ['chatMessages', sessionId, 'support'] });
            console.log('✅ Query invalidada exitosamente');
            toast.success('Mensaje enviado exitosamente');
        },
        onError: (error: any) => {
            console.error('❌ Error al enviar mensaje de soporte:', error);
            toast.error(error.response?.data?.message || 'Error al enviar mensaje');
        }
    });

    const handleSendMessage = async (data: ChatMessageFormData) => {
        console.log('🚀 handleSendMessage llamado con:', { sessionId, message: data.message });
        
        if (!sessionId) {
            console.error('❌ No hay sessionId');
            toast.error('No hay sesión de chat activa');
            return;
        }
        
        if (!data.message || data.message.trim() === '') {
            console.error('❌ Mensaje vacío');
            toast.error('El mensaje no puede estar vacío');
            return;
        }
        
        console.log('📤 Iniciando envío de mensaje de soporte...');
        
        // Enviar mensaje usando el endpoint específico de soporte
        sendSupportMessageMutation.mutate({ 
            sessionId, 
            message: data.message 
        });
        
        reset();
        
        // Marcar mensajes como leídos
        markMessagesAsRead();
    };

    const handleReleaseChat = () => {
        if (sessionId) {
            releaseChatMutation.mutate(sessionId);
        }
    };

    const handleCloseChat = () => {
        if (sessionId) {
            closeChatMutation.mutate(sessionId);
        }
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Función para obtener el estado actual del chat
    const getCurrentChatStatus = () => {
        if (!sessionId || !allSessions.length) return null;
        
        // Obtener el ID del usuario desde el token JWT en lugar de localStorage
        const token = localStorage.getItem('token');
        let currentUserId = localStorage.getItem('userId');
        
        // Si hay token, decodificar para obtener el ID real
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                currentUserId = payload.id || payload.sub;
                console.log('🔑 ID del usuario desde JWT:', currentUserId);
            } catch (error) {
                console.warn('⚠️ Error decodificando JWT, usando localStorage:', error);
            }
        }
        
        const currentChat = allSessions.find(session => session.id === sessionId);
        
        if (!currentChat) return null;
        
        // Verificar si el supportAgentId es corrupto (contiene un sessionId en lugar de agentId)
        const isCorruptedSupportAgentId = currentChat.supportAgentId && 
            currentChat.supportAgentId === sessionId && 
            !currentChat.supportAgent;
        
        console.log('🔍 Verificando estado del chat:', {
            sessionId,
            currentUserId,
            chatStatus: currentChat.status,
            supportAgentId: currentChat.supportAgentId,
            supportAgent: currentChat.supportAgent,
            supportAgentUserId: currentChat.supportAgent?.userId,
            isTakenByCurrentUser: currentChat.status === 'active' && currentChat.supportAgent?.userId === currentUserId,
            isTakenByOtherUser: currentChat.status === 'active' && 
                currentChat.supportAgent && 
                currentChat.supportAgent.userId !== currentUserId,
            isCorrupted: isCorruptedSupportAgentId,
            comparison: {
                currentUserId,
                supportAgentUserId: currentChat.supportAgent?.userId,
                areEqual: currentChat.supportAgent?.userId === currentUserId,
                currentUserIdType: typeof currentUserId,
                supportAgentUserIdType: typeof currentChat.supportAgent?.userId,
                hasSupportAgent: !!currentChat.supportAgent
            }
        });

        return {
            ...currentChat,
            isTakenByCurrentUser: currentChat.status === 'active' && currentChat.supportAgent?.userId === currentUserId,
            isTakenByOtherUser: currentChat.status === 'active' && 
                currentChat.supportAgent && 
                currentChat.supportAgent.userId !== currentUserId && 
                !isCorruptedSupportAgentId,
            isCorrupted: isCorruptedSupportAgentId
        };
    };

    const currentChatStatus = getCurrentChatStatus();

    // Ref para evitar múltiples ejecuciones
    const hasAttemptedTake = useRef(false);

    // Verificar si el chat ya está tomado antes de intentar tomarlo
    useEffect(() => {
        if (sessionId && !hasAttemptedTake.current && !takeChatMutation.isPending && !takeChatMutation.isSuccess) {
            // Si no hay currentChatStatus (sesiones no cargadas), intentar tomar el chat
            if (!currentChatStatus) {
                console.log('🔄 Sesiones no cargadas, intentando tomar chat automáticamente:', sessionId);
                hasAttemptedTake.current = true;
                takeChatMutation.mutate(sessionId);
                return;
            }

            if (currentChatStatus.isTakenByCurrentUser) {
                console.log('✅ Chat ya está tomado por el usuario actual:', sessionId);
                hasAttemptedTake.current = true;
                return;
            }

            if (currentChatStatus.isCorrupted) {
                console.log('🔧 Chat con datos corruptos detectado, intentando tomar automáticamente:', sessionId);
                hasAttemptedTake.current = true;
                takeChatMutation.mutate(sessionId);
                return;
            }

            if (currentChatStatus.isTakenByOtherUser) {
                console.log('⚠️ Chat ya está tomado por otro usuario:', sessionId);
                // Mostrar modal con información del agente que tomó el chat
                setTakenByAgent({
                    name: currentChatStatus.supportAgent?.name,
                    email: currentChatStatus.supportAgent?.email
                });
                setShowChatTakenModal(true);
                hasAttemptedTake.current = true;
                return;
            }

            // Si el chat no está tomado por nadie, tomarlo automáticamente
            if (currentChatStatus.status === 'pending' || !currentChatStatus.supportAgent) {
                console.log('🔄 Chat disponible, tomando automáticamente:', sessionId);
                hasAttemptedTake.current = true;
                takeChatMutation.mutate(sessionId);
                return;
            }

            // Si llegamos aquí, el chat está en un estado inesperado
            console.log('⚠️ Chat en estado inesperado, intentando tomar:', sessionId);
            hasAttemptedTake.current = true;
            takeChatMutation.mutate(sessionId);
        }
    }, [sessionId, takeChatMutation.isPending, takeChatMutation.isSuccess, currentChatStatus]); // Usar currentChatStatus como dependencia

    // Debug: Log cuando el WebSocket se conecta/desconecta
    useEffect(() => {
        console.log('🔌 WebSocket estado:', isConnected ? 'Conectado' : 'Desconectado');
    }, [isConnected]);

    if (!sessionId) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">ID de sesión no válido</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Chat de Soporte</h1>
                    <p className="text-gray-600 mt-2">Sesión: {sessionId.slice(-8)}</p>
                    <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isConnected 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {isConnected ? '✅ Conectado' : '❌ Desconectado'}
                        </span>
                    </div>
                    {takeChatMutation.isError && (
                        <div className="mt-2">
                            <p className="text-red-600 text-sm">❌ Error al tomar el chat</p>
                            <p className="text-gray-500 text-xs mt-1">
                                Este chat puede estar siendo atendido por otro agente o ya no está disponible.
                            </p>
                        </div>
                    )}
                    {currentChatStatus?.status === 'pending' && (
                        <p className="text-gray-600 text-sm mt-1">
                            📋 Chat pendiente de atención
                        </p>
                    )}
                </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/support/dashboard')}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            ← Volver al Dashboard
                        </button>
                        {currentChatStatus?.isTakenByCurrentUser && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleReleaseChat}
                                    disabled={releaseChatMutation.isPending}
                                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                                >
                                    {releaseChatMutation.isPending ? 'Liberando...' : 'Liberar Chat'}
                                </button>
                                <button
                                    onClick={handleCloseChat}
                                    disabled={closeChatMutation.isPending}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                >
                                    {closeChatMutation.isPending ? 'Cerrando...' : 'Cerrar Chat'}
                                </button>
                            </div>
                        )}
                        {takeChatMutation.isError && (
                            <button
                                onClick={() => navigate('/support/dashboard')}
                                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                            >
                                Volver al Dashboard
                            </button>
                        )}
                    </div>
            </div>

            {/* Chat Container */}
            <div className="bg-white rounded-lg shadow h-96 flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messagesLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center text-gray-500 text-sm">
                            <p>No hay mensajes en esta conversación</p>
                        </div>
                    ) : (
                        messages.map((message) => {
                            console.log('🎨 Renderizando mensaje:', message);
                            return (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                        message.sender === 'user'
                                            ? 'bg-gray-200 text-gray-800'
                                            : 'bg-blue-600 text-white'
                                    }`}
                                >
                                    <p className="text-xs font-semibold mb-1 ${
                                        message.sender === 'user' ? 'text-gray-600' : 'text-blue-100'
                                    }">
                                        {message.sender === 'user' ? '👤 Cliente' : '🛠️ Soporte'}
                                    </p>
                                    <p>{message.message}</p>
                                    <p className={`text-xs mt-1 ${
                                        message.sender === 'user' ? 'text-gray-500' : 'text-blue-100'
                                    }`}>
                                        {formatTime(message.timestamp)}
                                    </p>
                                </div>
                            </div>
                            );
                        })
                    )}
                    <div id="messages-end"></div>
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-4">
                    <form onSubmit={handleSubmit(handleSendMessage)} className="flex space-x-2">
                        <input
                            {...register('message', { 
                                required: 'El mensaje es requerido',
                                maxLength: { value: 1000, message: 'El mensaje no puede exceder 1000 caracteres' }
                            })}
                            type="text"
                            placeholder="Escribe tu mensaje..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={sendSupportMessageMutation.isPending}
                        />
                        <button
                            type="submit"
                            disabled={sendSupportMessageMutation.isPending || !!errors.message}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {sendSupportMessageMutation.isPending ? 'Enviando...' : 'Enviar'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                console.log('🧪 Probando envío de mensaje de soporte...');
                                sendSupportMessageMutation.mutate({ 
                                    sessionId: sessionId!, 
                                    message: 'Mensaje de prueba de soporte' 
                                });
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            🧪 Probar Soporte
                        </button>
                    </form>
                    {errors.message && (
                        <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                    )}
                </div>
            </div>

            {/* Modal de Chat Tomado */}
            {showChatTakenModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Chat No Disponible</h3>
                                <p className="text-sm text-gray-600">Este chat ya está siendo atendido</p>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-gray-700 mb-2">
                                El chat fue tomado por:
                            </p>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="font-medium text-gray-900">
                                    {takenByAgent?.name || takenByAgent?.email || 'Otro agente de soporte'}
                                </p>
                                {takenByAgent?.email && takenByAgent?.name && (
                                    <p className="text-sm text-gray-600">{takenByAgent.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowChatTakenModal(false);
                                    navigate('/support/dashboard');
                                }}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Volver al Dashboard
                            </button>
                            <button
                                onClick={() => setShowChatTakenModal(false)}
                                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

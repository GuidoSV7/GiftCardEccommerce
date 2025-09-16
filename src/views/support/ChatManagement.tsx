import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { 
    getAllChatSessions, 
    getChatSessionsByStatus, 
    assignChatSession
} from '../../services/chatService';
import { useChatStable } from '../../hooks/useChatStable';
import type { ChatMessageFormData, ChatMessage, ChatSession } from '../../types';

export default function ChatManagement() {
    const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'pending' | 'closed'>('all');
    const [selectedSession, setSelectedSession] = useState<string | null>(null);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const queryClient = useQueryClient();

    // Configuración del formulario para responder
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ChatMessageFormData>();

    // Hook estable para soporte
    const {
        isConnected,
        messages,
        isTyping,
        sendMessage,
        sendTyping
    } = useChatStable({
        sessionId: selectedSession || undefined,
        onNewMessage: (message: ChatMessage) => {
            console.log('Nuevo mensaje recibido:', message);
        },
        onNewPendingSession: (data) => {
            console.log('Nueva sesión pendiente:', data);
            toast.info('Nueva sesión de chat pendiente');
            // Refrescar la lista de sesiones
            queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
        },
        onStatsUpdate: (stats) => {
            console.log('Estadísticas actualizadas:', stats);
        }
    });

    // Query para obtener sesiones según el filtro (solo carga inicial)
    const { data: initialSessions = [], isLoading: sessionsLoading } = useQuery({
        queryKey: ['chatSessions', selectedStatus],
        queryFn: () => {
            if (selectedStatus === 'all') {
                return getAllChatSessions();
            }
            return getChatSessionsByStatus(selectedStatus);
        },
        retry: 2,
        staleTime: 30 * 1000, // 30 segundos
        // Eliminamos refetchInterval - ahora se actualiza via WebSocket
    });

    // Actualizar sesiones cuando cambian los datos iniciales
    useEffect(() => {
        setSessions(initialSessions);
    }, [initialSessions]);

    // Ya no necesitamos mutación para enviar mensaje - se hace via WebSocket

    // Mutación para asignar sesión
    const assignSessionMutation = useMutation({
        mutationFn: ({ sessionId, supportAgentId }: { sessionId: string; supportAgentId: string }) =>
            assignChatSession(sessionId, supportAgentId),
        onError: (error: any) => {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Error al asignar sesión');
            }
        },
        onSuccess: () => {
            toast.success('Sesión asignada exitosamente');
            queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
        }
    });

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'closed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active':
                return 'Activo';
            case 'pending':
                return 'Pendiente';
            case 'closed':
                return 'Cerrado';
            default:
                return status;
        }
    };

    const handleSendMessage = async (data: ChatMessageFormData) => {
        if (!selectedSession || !isConnected) {
            toast.error('No hay conexión con el servidor');
            return;
        }
        
        try {
            // Enviar mensaje via WebSocket
            sendMessage(data.message);
            reset();
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            toast.error('Error al enviar mensaje');
        }
    };

    const handleTyping = (isTyping: boolean) => {
        sendTyping(isTyping);
    };

    const handleAssignSession = (sessionId: string) => {
        // En un caso real, obtendrías el ID del agente de soporte actual
        const supportAgentId = 'current-support-agent-id';
        assignSessionMutation.mutate({ sessionId, supportAgentId });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestión de Chats</h1>
                        <p className="text-gray-600 mt-2">
                            Administra y responde a las conversaciones de los usuarios
                        </p>
                    </div>
                    <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                            isConnected ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        <span className="text-sm text-gray-600">
                            {isConnected ? 'Conectado' : 'Desconectado'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de Sesiones */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Sesiones de Chat</h2>
                            
                            {/* Filtros */}
                            <div className="mt-4 flex space-x-2">
                                {[
                                    { key: 'all', label: 'Todas' },
                                    { key: 'active', label: 'Activas' },
                                    { key: 'pending', label: 'Pendientes' },
                                    { key: 'closed', label: 'Cerradas' }
                                ].map((filter) => (
                                    <button
                                        key={filter.key}
                                        onClick={() => setSelectedStatus(filter.key as any)}
                                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                            selectedStatus === filter.key
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {sessionsLoading ? (
                                <div className="p-6 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-600 mt-2">Cargando sesiones...</p>
                                </div>
                            ) : sessions.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <p>No hay sesiones disponibles</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {sessions.map((session) => (
                                        <div
                                            key={session.id}
                                            onClick={() => setSelectedSession(session.id)}
                                            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                                                selectedSession === session.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                Usuario {session.userId.slice(-4)}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {formatTime(session.lastMessageAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.status)}`}>
                                                        {getStatusText(session.status)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="lg:col-span-2">
                    {selectedSession ? (
                        <div className="bg-white rounded-lg shadow h-96 flex flex-col">
                            {/* Chat Header */}
                            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">
                                            Usuario {selectedSession.slice(-4)}
                                        </h3>
                                        <p className="text-xs text-gray-500">Chat de soporte</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAssignSession(selectedSession)}
                                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Asignar
                                </button>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {messages.length === 0 ? (
                                    <div className="text-center text-gray-500 text-sm">
                                        <p>No hay mensajes en esta conversación</p>
                                    </div>
                                ) : (
                                    messages.map((message) => (
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
                                                <p>{message.message}</p>
                                                <p className={`text-xs mt-1 ${
                                                    message.sender === 'user' ? 'text-gray-500' : 'text-blue-100'
                                                }`}>
                                                    {formatTime(message.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                
                                {/* Typing indicator */}
                                {isTyping && isTyping.isTyping && isTyping.userRole === 'user' && (
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
                                        placeholder="Escribe tu respuesta..."
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
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow h-96 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona una conversación</h3>
                                <p className="text-gray-600">Elige una sesión de chat de la lista para comenzar a responder</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

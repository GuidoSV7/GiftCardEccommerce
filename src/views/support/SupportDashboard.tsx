import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllChatSessions, takeChatSession } from '../../services/chatService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useMemo } from 'react';

export default function SupportDashboard() {
    const queryClient = useQueryClient();
    
    // Estados para filtros y búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');


    // Query para obtener todas las sesiones de chat
    const { data: allSessions = [], isLoading: sessionsLoading } = useQuery({
        queryKey: ['allChatSessions'],
        queryFn: getAllChatSessions,
        retry: 2,
        staleTime: 10 * 1000, // 10 segundos para actualizaciones más frecuentes
        refetchInterval: 15 * 1000, // Refetch cada 15 segundos
    });

    // Contar chats activos del usuario actual
    const currentUserActiveChats = useMemo(() => {
        // Obtener el ID del usuario desde el token JWT en lugar de localStorage
        const token = localStorage.getItem('token');
        let currentUserId = localStorage.getItem('userId');
        
        // Si hay token, decodificar para obtener el ID real
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                currentUserId = payload.id || payload.sub;
            } catch (error) {
                console.warn('⚠️ Error decodificando JWT, usando localStorage:', error);
            }
        }
        
        const activeChats = allSessions.filter(session => 
            session.status === 'active' && 
            session.supportAgent?.userId === currentUserId
        );
        
        console.log('🔍 Contando chats activos:', {
            currentUserId,
            totalSessions: allSessions.length,
            activeSessions: allSessions.filter(s => s.status === 'active').length,
            userActiveChats: activeChats.length,
            activeChats: activeChats.map(c => ({ id: c.id, supportAgent: c.supportAgent }))
        });
        
        return activeChats.length;
    }, [allSessions]);

    // Mutación para tomar un chat
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
            } else {
                toast.error(error.response?.data?.message || 'Error al tomar el chat');
            }
        }
    });


    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
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

    // Función para obtener el nombre del usuario
    const getUserName = (session: any) => {
        if (session.user?.name) {
            return session.user.name;
        }
        if (session.user?.email) {
            return session.user.email.split('@')[0];
        }
        return `Usuario ${session.userId.slice(-4)}`;
    };

    // Función para filtrar sesiones
    const filteredSessions = useMemo(() => {
        return allSessions.filter((session) => {
            // Filtro por término de búsqueda (nombre del usuario)
            const userName = getUserName(session).toLowerCase();
            const matchesSearch = searchTerm === '' || userName.includes(searchTerm.toLowerCase());
            
            // Filtro por estado
            const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
            
            // Filtro por fecha
            let matchesDate = true;
            if (dateFilter !== 'all') {
                const sessionDate = new Date(session.createdAt);
                const now = new Date();
                
                switch (dateFilter) {
                    case 'today':
                        matchesDate = sessionDate.toDateString() === now.toDateString();
                        break;
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        matchesDate = sessionDate >= weekAgo;
                        break;
                    case 'month':
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        matchesDate = sessionDate >= monthAgo;
                        break;
                }
            }
            
            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [allSessions, searchTerm, statusFilter, dateFilter]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestión de Chats</h1>
                        <p className="text-gray-600 mt-2">
                            Gestiona y responde a las consultas de los usuarios
                        </p>
                        <div className="mt-2 flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                                Chats activos: <span className="font-semibold text-blue-600">{currentUserActiveChats}/2</span>
                            </span>
                            {currentUserActiveChats >= 2 && (
                                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                    Límite alcanzado
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Búsqueda por nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar por nombre
                        </label>
                        <input
                            type="text"
                            placeholder="Nombre del usuario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filtro por estado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filtrar por estado
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="pending">Pendientes</option>
                            <option value="active">Activos</option>
                            <option value="closed">Cerrados</option>
                        </select>
                    </div>

                    {/* Filtro por fecha */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filtrar por fecha
                        </label>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Todas las fechas</option>
                            <option value="today">Hoy</option>
                            <option value="week">Última semana</option>
                            <option value="month">Último mes</option>
                        </select>
                    </div>
                </div>

                {/* Chats pendientes (sin atender) */}
                {allSessions.filter(session => session.status === 'pending').length > 0 && (
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-800">
                                    ⚠️ Chats Pendientes
                                </h3>
                                <p className="text-sm text-yellow-700 mt-1">
                                    {allSessions.filter(session => session.status === 'pending').length} chat(s) esperando atención
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-yellow-600">
                                    Prioridad: Alta
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Resultados de búsqueda */}
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Mostrando {filteredSessions.length} de {allSessions.length} chats
                    </p>
                    {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                                setDateFilter('all');
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            </div>

            {/* Chat Sessions Table */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Todos los Chats</h2>
                </div>
                <div className="overflow-x-auto">
                    {sessionsLoading ? (
                        <div className="p-6 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-600 mt-2">Cargando chats...</p>
                        </div>
                    ) : filteredSessions.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p>No hay chats que coincidan con los filtros</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Último Mensaje
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSessions.map((session) => (
                                    <tr key={session.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {getUserName(session)}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {formatTime(session.createdAt)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col space-y-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.status)}`}>
                                                    {getStatusText(session.status)}
                                                </span>
                                                {session.status === 'active' && session.supportAgent && (
                                                    <span className="text-xs text-gray-600">
                                                        Atendido por: {session.supportAgent.name || session.supportAgent.email}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatTime(session.lastMessageAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {session.status === 'pending' ? (
                                                    <div className="flex flex-col space-y-1">
                                                        <button
                                                            onClick={() => takeChatMutation.mutate(session.id)}
                                                            disabled={takeChatMutation.isPending || currentUserActiveChats >= 2}
                                                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {takeChatMutation.isPending ? 'Tomando...' : 'Tomar Chat'}
                                                        </button>
                                                        {currentUserActiveChats >= 2 && (
                                                            <span className="text-xs text-red-600 text-center">
                                                                Límite de 2 chats alcanzado
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : session.status === 'active' ? (
                                                    <div className="flex flex-col space-y-1">
                                                        <Link
                                                            to={`/support/chats/${session.id}`}
                                                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors text-center"
                                                        >
                                                            Ver Chat
                                                        </Link>
                                                        {session.supportAgent && (
                                                            <span className="text-xs text-gray-500 text-center">
                                                                Atendido por: {session.supportAgent.name || session.supportAgent.email}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 text-xs">Chat cerrado</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
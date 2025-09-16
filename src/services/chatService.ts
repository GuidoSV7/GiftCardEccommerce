import api from '../lib/axios';
import type { ChatSession, ChatMessage, ChatMessageFormData } from '../types';

// Obtener sesión de chat activa del usuario
export const getActiveChatSession = async (): Promise<ChatSession | null> => {
    try {
        const response = await api.get('/chat/session/active');
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Crear nueva sesión de chat
export const createChatSession = async (): Promise<ChatSession> => {
    try {
        const response = await api.post('/chat/session');
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Obtener mensajes de una sesión
export const getChatMessages = async (sessionId: string): Promise<ChatMessage[]> => {
    try {
        const response = await api.get(`/chat/session/${sessionId}/messages`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Enviar mensaje
export const sendChatMessage = async (data: ChatMessageFormData): Promise<ChatMessage> => {
    try {
        const response = await api.post('/chat/message', data);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Cerrar sesión de chat
export const closeChatSession = async (sessionId: string): Promise<void> => {
    try {
        await api.patch(`/chat/session/${sessionId}/close`);
    } catch (error) {
        throw error;
    }
};

// Marcar mensajes como leídos
export const markMessagesAsRead = async (sessionId: string): Promise<void> => {
    try {
        await api.patch(`/chat/session/${sessionId}/mark-read`);
    } catch (error) {
        throw error;
    }
};

// ===== FUNCIONES PARA SOPORTE =====

// Obtener todas las sesiones de chat (para soporte)
export const getAllChatSessions = async (): Promise<ChatSession[]> => {
    try {
        const response = await api.get('/chat/sessions/all');
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Obtener sesiones de chat por estado (para soporte)
export const getChatSessionsByStatus = async (status: 'active' | 'closed' | 'pending'): Promise<ChatSession[]> => {
    try {
        const response = await api.get(`/chat/sessions/status/${status}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Asignar sesión de chat a un agente de soporte
export const assignChatSession = async (sessionId: string, supportAgentId: string): Promise<void> => {
    try {
        await api.patch(`/chat/session/${sessionId}/assign`, { supportAgentId });
    } catch (error) {
        throw error;
    }
};

// Responder como soporte
export const sendSupportMessage = async (sessionId: string, message: string): Promise<ChatMessage> => {
    try {
        const response = await api.post(`/chat/session/${sessionId}/support-message`, { message });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Obtener estadísticas de chat (para soporte)
export const getChatStats = async (): Promise<{
    totalSessions: number;
    activeSessions: number;
    pendingSessions: number;
    closedSessions: number;
    averageResponseTime: number;
}> => {
    try {
        const response = await api.get('/chat/stats');
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

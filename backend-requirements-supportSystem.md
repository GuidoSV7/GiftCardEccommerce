# Backend Requirements: Sistema de Soporte

## 📋 Descripción
Sistema completo de gestión de soporte al cliente que permite a los agentes de soporte gestionar, responder y administrar las conversaciones de chat de los usuarios. Incluye dashboard, gestión de sesiones, estadísticas y asignación de agentes.

## 🗄️ Entidades

### ChatSession (Extendida)
```typescript
interface ChatSession {
    id: string;
    userId: string;
    supportAgentId?: string; // Nuevo campo
    status: 'active' | 'closed' | 'pending';
    priority: 'low' | 'medium' | 'high'; // Nuevo campo
    assignedAt?: Date; // Nuevo campo
    createdAt: Date;
    lastMessageAt: Date;
    messages: ChatMessage[];
}
```

### ChatMessage (Sin cambios)
```typescript
interface ChatMessage {
    id: string;
    sessionId: string;
    message: string;
    sender: 'user' | 'support';
    timestamp: Date;
    isRead: boolean;
}
```

### SupportAgent (Nueva entidad)
```typescript
interface SupportAgent {
    id: string;
    userId: string;
    name: string;
    email: string;
    isActive: boolean;
    maxConcurrentChats: number;
    currentActiveChats: number;
    createdAt: Date;
    updatedAt: Date;
}
```

## 🔗 Endpoints Requeridos

### 1. [GET] /api/chat/sessions/all
**Descripción:** Obtener todas las sesiones de chat (para soporte)
**Headers:** 
- Authorization: Bearer {token}
- Requiere rol: support, admin, superadmin

**Query Parameters:**
- `status` (opcional): Filtrar por estado
- `page` (opcional): Número de página
- `limit` (opcional): Elementos por página
- `sortBy` (opcional): Campo para ordenar
- `sortOrder` (opcional): asc | desc

**Response:**
```json
{
    "success": true,
    "data": {
        "sessions": ChatSession[],
        "pagination": {
            "page": 1,
            "limit": 20,
            "total": 100,
            "totalPages": 5
        }
    },
    "message": "Sesiones obtenidas exitosamente"
}
```

### 2. [GET] /api/chat/sessions/status/:status
**Descripción:** Obtener sesiones por estado específico
**Headers:** 
- Authorization: Bearer {token}
- Requiere rol: support, admin, superadmin

**Response:**
```json
{
    "success": true,
    "data": ChatSession[],
    "message": "Sesiones obtenidas exitosamente"
}
```

### 3. [PATCH] /api/chat/session/:id/assign
**Descripción:** Asignar sesión de chat a un agente de soporte
**Headers:** 
- Authorization: Bearer {token}
- Content-Type: application/json
- Requiere rol: support, admin, superadmin

**Body:**
```json
{
    "supportAgentId": "agent-uuid"
}
```

**Response:**
```json
{
    "success": true,
    "data": ChatSession,
    "message": "Sesión asignada exitosamente"
}
```

### 4. [POST] /api/chat/session/:id/support-message
**Descripción:** Enviar mensaje como agente de soporte
**Headers:** 
- Authorization: Bearer {token}
- Content-Type: application/json
- Requiere rol: support, admin, superadmin

**Body:**
```json
{
    "message": "Hola, ¿en qué puedo ayudarte?"
}
```

**Response:**
```json
{
    "success": true,
    "data": ChatMessage,
    "message": "Mensaje enviado exitosamente"
}
```

### 5. [GET] /api/chat/stats
**Descripción:** Obtener estadísticas de chat para el dashboard
**Headers:** 
- Authorization: Bearer {token}
- Requiere rol: support, admin, superadmin

**Response:**
```json
{
    "success": true,
    "data": {
        "totalSessions": 150,
        "activeSessions": 25,
        "pendingSessions": 10,
        "closedSessions": 115,
        "averageResponseTime": 5.2,
        "sessionsToday": 15,
        "sessionsThisWeek": 45,
        "sessionsThisMonth": 150
    },
    "message": "Estadísticas obtenidas exitosamente"
}
```

### 6. [GET] /api/chat/session/:id/details
**Descripción:** Obtener detalles completos de una sesión
**Headers:** 
- Authorization: Bearer {token}
- Requiere rol: support, admin, superadmin

**Response:**
```json
{
    "success": true,
    "data": {
        "session": ChatSession,
        "user": {
            "id": "user-uuid",
            "email": "user@example.com",
            "name": "Usuario"
        },
        "agent": {
            "id": "agent-uuid",
            "name": "Agente de Soporte"
        }
    },
    "message": "Detalles obtenidos exitosamente"
}
```

### 7. [PATCH] /api/chat/session/:id/priority
**Descripción:** Cambiar prioridad de una sesión
**Headers:** 
- Authorization: Bearer {token}
- Content-Type: application/json
- Requiere rol: support, admin, superadmin

**Body:**
```json
{
    "priority": "high"
}
```

**Response:**
```json
{
    "success": true,
    "data": ChatSession,
    "message": "Prioridad actualizada exitosamente"
}
```

### 8. [GET] /api/support/agents
**Descripción:** Obtener lista de agentes de soporte
**Headers:** 
- Authorization: Bearer {token}
- Requiere rol: admin, superadmin

**Response:**
```json
{
    "success": true,
    "data": SupportAgent[],
    "message": "Agentes obtenidos exitosamente"
}
```

### 9. [POST] /api/support/agents
**Descripción:** Crear nuevo agente de soporte
**Headers:** 
- Authorization: Bearer {token}
- Content-Type: application/json
- Requiere rol: admin, superadmin

**Body:**
```json
{
    "userId": "user-uuid",
    "name": "Agente de Soporte",
    "maxConcurrentChats": 5
}
```

**Response:**
```json
{
    "success": true,
    "data": SupportAgent,
    "message": "Agente creado exitosamente"
}
```

### 10. [GET] /api/chat/session/:id/messages
**Descripción:** Obtener mensajes de una sesión (ya existe, pero con permisos extendidos)
**Headers:** 
- Authorization: Bearer {token}
- Requiere rol: support, admin, superadmin

**Response:**
```json
{
    "success": true,
    "data": ChatMessage[],
    "message": "Mensajes obtenidos exitosamente"
}
```

## ✅ Validaciones

### Asignar Sesión
- [ ] Validar que el agente de soporte existe
- [ ] Validar que el agente está activo
- [ ] Validar que el agente no excede su límite de chats concurrentes
- [ ] Validar que la sesión existe y está activa
- [ ] Validar permisos del usuario que asigna

### Enviar Mensaje de Soporte
- [ ] Validar que el usuario tiene rol de soporte
- [ ] Validar que la sesión existe
- [ ] Validar que el mensaje no está vacío
- [ ] Validar longitud máxima del mensaje (1000 caracteres)
- [ ] Actualizar timestamp de la sesión

### Obtener Estadísticas
- [ ] Validar permisos de soporte
- [ ] Calcular métricas en tiempo real
- [ ] Incluir filtros por fecha si se especifican

### Cambiar Prioridad
- [ ] Validar que la sesión existe
- [ ] Validar que el valor de prioridad es válido
- [ ] Validar permisos del usuario

## 🚨 Códigos de Error

### 400 - Bad Request
```json
{
    "success": false,
    "message": ["Error de validación específico"],
    "errors": {
        "supportAgentId": ["El agente de soporte no existe"],
        "priority": ["La prioridad debe ser low, medium o high"]
    }
}
```

### 401 - Unauthorized
```json
{
    "success": false,
    "message": "Token inválido o expirado"
}
```

### 403 - Forbidden
```json
{
    "success": false,
    "message": "No tienes permisos para realizar esta acción"
}
```

### 404 - Not Found
```json
{
    "success": false,
    "message": "Sesión de chat no encontrada"
}
```

### 409 - Conflict
```json
{
    "success": false,
    "message": "El agente de soporte ha alcanzado su límite de chats concurrentes"
}
```

### 429 - Too Many Requests
```json
{
    "success": false,
    "message": "Demasiados mensajes enviados. Intenta de nuevo en unos minutos"
}
```

### 500 - Internal Server Error
```json
{
    "success": false,
    "message": "Error interno del servidor"
}
```

## 📝 Notas para el Backend

### Middleware Requerido
- [ ] Validación de JWT token
- [ ] Validación de roles (support, admin, superadmin)
- [ ] Rate limiting para mensajes (máximo 20 mensajes por minuto)
- [ ] Logging de todas las acciones de soporte
- [ ] WebSocket para notificaciones en tiempo real

### Base de Datos
- [ ] Extender tabla chat_sessions:
  - support_agent_id (UUID, FK a support_agents)
  - priority (ENUM: 'low', 'medium', 'high', default 'medium')
  - assigned_at (TIMESTAMP)
- [ ] Crear tabla support_agents:
  - id (UUID, PK)
  - user_id (UUID, FK a users)
  - name (VARCHAR)
  - email (VARCHAR)
  - is_active (BOOLEAN, default true)
  - max_concurrent_chats (INTEGER, default 5)
  - current_active_chats (INTEGER, default 0)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
- [ ] Crear índices para optimizar consultas
- [ ] Configurar triggers para actualizar contadores

### WebSocket Events
- [ ] `chat_message_received` - Nuevo mensaje del usuario
- [ ] `chat_assigned` - Sesión asignada a agente
- [ ] `chat_status_changed` - Estado de sesión cambiado
- [ ] `agent_status_changed` - Estado del agente cambiado

### Funcionalidades Adicionales
- [ ] Sistema de cola de chats pendientes
- [ ] Asignación automática basada en carga de trabajo
- [ ] Notificaciones push para nuevos chats
- [ ] Sistema de templates de respuestas
- [ ] Métricas de rendimiento por agente
- [ ] Sistema de calificaciones post-chat

## 🔄 Estados del Frontend

### Loading States
- `sessionsLoading: boolean` - Para cargar lista de sesiones
- `messagesLoading: boolean` - Para cargar mensajes
- `statsLoading: boolean` - Para cargar estadísticas
- `isAssigning: boolean` - Para asignar sesión
- `isSending: boolean` - Para enviar mensaje

### Error States
- `sessionsError: string | null` - Para errores de sesiones
- `messagesError: string | null` - Para errores de mensajes
- `statsError: string | null` - Para errores de estadísticas

## 📱 Componentes Frontend que Consumirán estos Endpoints

- `SupportDashboard.tsx` - Dashboard principal con estadísticas
- `ChatManagement.tsx` - Gestión de chats y respuestas
- `SupportSidebar.tsx` - Navegación del panel de soporte
- `SupportLayout.tsx` - Layout principal del panel

## 🎯 Flujo de Agente de Soporte

1. **Agente inicia sesión** → Dashboard con estadísticas
2. **Ve lista de chats** → Filtra por estado (activos, pendientes, cerrados)
3. **Selecciona chat** → Ve conversación completa
4. **Asigna chat a sí mismo** → Toma responsabilidad
5. **Responde mensajes** → Comunicación bidireccional
6. **Cambia prioridad** → Si es necesario
7. **Cierra sesión** → Finaliza conversación

## 📊 Métricas del Dashboard

- **Total de sesiones** - Todas las sesiones creadas
- **Chats activos** - Sesiones en curso
- **Chats pendientes** - Esperando asignación
- **Chats cerrados** - Finalizadas
- **Tiempo promedio de respuesta** - En minutos
- **Sesiones hoy/semana/mes** - Filtros temporales

## 🔐 Permisos por Rol

### Support
- Ver todas las sesiones
- Asignar sesiones a sí mismo
- Responder mensajes
- Cambiar prioridad
- Ver estadísticas básicas

### Admin/SuperAdmin
- Todas las funciones de Support
- Asignar sesiones a otros agentes
- Gestionar agentes de soporte
- Ver estadísticas avanzadas
- Acceso a logs del sistema

---

**Fecha de Creación:** 2024-12-19
**Desarrollador Frontend:** AI Assistant
**Prioridad:** Alta
**Estimación Backend:** 7-10 días
**Dependencias:** Sistema de autenticación JWT, Base de datos PostgreSQL, WebSocket

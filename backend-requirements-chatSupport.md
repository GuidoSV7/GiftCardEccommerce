# Backend Requirements: ChatSupport

## 📋 Descripción
Sistema de chat de soporte en tiempo real para que los usuarios puedan comunicarse con el equipo de soporte. Permite crear sesiones de chat, enviar mensajes, y gestionar el estado de las conversaciones.

## 🗄️ Entidades

### ChatSession
```typescript
interface ChatSession {
    id: string;
    userId: string;
    status: 'active' | 'closed' | 'pending';
    createdAt: Date;
    lastMessageAt: Date;
    messages: ChatMessage[];
}
```

### ChatMessage
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

## 🔗 Endpoints Requeridos

### 1. [GET] /api/chat/session/active
**Descripción:** Obtener sesión de chat activa del usuario
**Headers:** 
- Authorization: Bearer {token}

**Response:**
```json
{
    "success": true,
    "data": ChatSession | null,
    "message": "Sesión obtenida exitosamente"
}
```

### 2. [POST] /api/chat/session
**Descripción:** Crear nueva sesión de chat
**Headers:** 
- Authorization: Bearer {token}

**Response:**
```json
{
    "success": true,
    "data": ChatSession,
    "message": "Sesión creada exitosamente"
}
```

### 3. [GET] /api/chat/session/:id/messages
**Descripción:** Obtener mensajes de una sesión
**Headers:** 
- Authorization: Bearer {token}

**Response:**
```json
{
    "success": true,
    "data": ChatMessage[],
    "message": "Mensajes obtenidos exitosamente"
}
```

### 4. [POST] /api/chat/message
**Descripción:** Enviar mensaje
**Headers:** 
- Authorization: Bearer {token}
- Content-Type: application/json

**Body:**
```json
{
    "message": "Hola, necesito ayuda"
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

### 5. [PATCH] /api/chat/session/:id/close
**Descripción:** Cerrar sesión de chat
**Headers:** 
- Authorization: Bearer {token}

**Response:**
```json
{
    "success": true,
    "message": "Sesión cerrada exitosamente"
}
```

### 6. [PATCH] /api/chat/session/:id/mark-read
**Descripción:** Marcar mensajes como leídos
**Headers:** 
- Authorization: Bearer {token}

**Response:**
```json
{
    "success": true,
    "message": "Mensajes marcados como leídos"
}
```

## ✅ Validaciones

### Crear ChatSession
- [ ] Validar que el usuario esté autenticado
- [ ] Validar que no tenga una sesión activa
- [ ] Crear sesión con status 'pending'
- [ ] Asignar userId del token JWT

### Enviar ChatMessage
- [ ] Validar que el usuario esté autenticado
- [ ] Validar que la sesión exista
- [ ] Validar que la sesión pertenezca al usuario
- [ ] Validar que el mensaje no esté vacío
- [ ] Validar longitud máxima del mensaje (500 caracteres)
- [ ] Asignar sender como 'user'
- [ ] Actualizar lastMessageAt de la sesión

### Obtener Mensajes
- [ ] Validar que el usuario esté autenticado
- [ ] Validar que la sesión exista
- [ ] Validar que la sesión pertenezca al usuario
- [ ] Ordenar mensajes por timestamp ascendente

### Cerrar Sesión
- [ ] Validar que el usuario esté autenticado
- [ ] Validar que la sesión exista
- [ ] Validar que la sesión pertenezca al usuario
- [ ] Cambiar status a 'closed'

### Marcar como Leído
- [ ] Validar que el usuario esté autenticado
- [ ] Validar que la sesión exista
- [ ] Validar que la sesión pertenezca al usuario
- [ ] Marcar todos los mensajes de soporte como leídos

## 🚨 Códigos de Error

### 400 - Bad Request
```json
{
    "success": false,
    "message": ["Error de validación específico"],
    "errors": {
        "message": ["El mensaje no puede estar vacío"]
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
    "message": "No tienes permisos para acceder a esta sesión de chat"
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
    "message": "Ya tienes una sesión de chat activa"
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
- [ ] Validación de permisos por rol
- [ ] Rate limiting para evitar spam (máximo 10 mensajes por minuto)
- [ ] Logging de mensajes para auditoría
- [ ] WebSocket para mensajes en tiempo real (opcional pero recomendado)

### Base de Datos
- [ ] Crear tabla chat_sessions
  - id (UUID, PK)
  - user_id (UUID, FK a users)
  - status (ENUM: 'active', 'closed', 'pending')
  - created_at (TIMESTAMP)
  - last_message_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
- [ ] Crear tabla chat_messages
  - id (UUID, PK)
  - session_id (UUID, FK a chat_sessions)
  - message (TEXT)
  - sender (ENUM: 'user', 'support')
  - timestamp (TIMESTAMP)
  - is_read (BOOLEAN, default false)
  - created_at (TIMESTAMP)
- [ ] Configurar índices por userId y sessionId
- [ ] Configurar relaciones entre tablas
- [ ] Configurar soft delete para chat_sessions

### WebSocket (Opcional pero Recomendado)
- [ ] Implementar WebSocket para mensajes en tiempo real
- [ ] Notificar cuando llega un nuevo mensaje
- [ ] Notificar cuando cambia el estado de la sesión
- [ ] Manejar reconexión automática

### Funcionalidades Adicionales
- [ ] Sistema de notificaciones push para mensajes de soporte
- [ ] Historial de conversaciones anteriores
- [ ] Sistema de tickets de soporte
- [ ] Asignación automática de agentes de soporte
- [ ] Métricas de tiempo de respuesta

## 🔄 Estados del Frontend

### Loading States
- `sessionLoading: boolean` - Para cargar sesión activa
- `messagesLoading: boolean` - Para cargar mensajes
- `isCreating: boolean` - Para crear sesión
- `isSending: boolean` - Para enviar mensaje
- `isClosing: boolean` - Para cerrar sesión

### Error States
- `sessionError: string | null` - Para errores de sesión
- `messagesError: string | null` - Para errores de mensajes
- `sendError: string | null` - Para errores al enviar

## 📱 Componentes Frontend que Consumirán estos Endpoints

- `ChatSupport.tsx` - Componente principal del chat
- `ChatButton.tsx` - Botón flotante para abrir chat
- `HomeView.tsx` - Vista principal donde se integra el chat

## 🎯 Flujo de Usuario

1. **Usuario hace clic en el botón de chat**
2. **Sistema verifica si hay sesión activa**
   - Si no hay: crea nueva sesión
   - Si hay: carga mensajes existentes
3. **Usuario envía mensaje**
4. **Sistema guarda mensaje y notifica a soporte**
5. **Soporte responde (futuro)**
6. **Usuario puede cerrar la sesión**

## 📊 Métricas Sugeridas

- Tiempo promedio de respuesta del soporte
- Número de sesiones activas por día
- Mensajes por sesión
- Tasa de resolución de problemas
- Satisfacción del usuario

---

**Fecha de Creación:** 2024-12-19
**Desarrollador Frontend:** AI Assistant
**Prioridad:** Alta
**Estimación Backend:** 5-7 días
**Dependencias:** Sistema de autenticación JWT, Base de datos PostgreSQL

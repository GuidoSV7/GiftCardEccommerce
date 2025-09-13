# Backend Requirements: Google Authentication

## 📋 Descripción
Sistema de autenticación con Google OAuth 2.0 que permite a los usuarios iniciar sesión usando sus cuentas de Google. Incluye registro automático de nuevos usuarios y manejo de tokens JWT.

## 🗄️ Entidades

### User (Extendida)
```typescript
interface User {
    id: string;
    email: string;
    userName: string;
    password?: string; // Opcional para usuarios de Google
    googleId?: string; // Nuevo campo
    roles: string;
    registrationDate: Date;
    isActive: boolean;
    type?: string;
}
```

## 🔗 Endpoints Requeridos

### 1. [POST] /api/auth/google
**Descripción:** Autenticar usuario con Google OAuth
**Headers:** 
- Content-Type: application/json

**Body:**
```json
{
    "googleId": "google-user-id",
    "email": "user@gmail.com",
    "name": "Usuario Nombre",
    "picture": "https://lh3.googleusercontent.com/..."
}
```

**Response (Usuario Existente):**
```json
{
    "success": true,
    "data": {
        "id": "user-uuid",
        "email": "user@gmail.com",
        "roles": "member",
        "token": "jwt-token",
        "adminData": null,
        "isNewUser": false
    },
    "message": "Inicio de sesión exitoso"
}
```

**Response (Usuario Nuevo):**
```json
{
    "success": true,
    "data": {
        "id": "user-uuid",
        "email": "user@gmail.com",
        "roles": "member",
        "token": "jwt-token",
        "adminData": null,
        "isNewUser": true
    },
    "message": "Usuario creado e iniciado sesión exitosamente"
}
```

## ✅ Validaciones

### Autenticación con Google
- [ ] Validar que googleId no esté vacío
- [ ] Validar formato de email
- [ ] Validar que name no esté vacío
- [ ] Verificar que el googleId sea único
- [ ] Verificar que el email sea único (si no es usuario de Google existente)

### Crear Usuario de Google
- [ ] Asignar rol 'member' por defecto
- [ ] Establecer isActive como true
- [ ] Establecer registrationDate como fecha actual
- [ ] No requerir password para usuarios de Google
- [ ] Usar name como userName inicial

### Login de Usuario Existente
- [ ] Verificar que el usuario existe por googleId o email
- [ ] Actualizar googleId si el usuario existe pero no tiene googleId
- [ ] Generar nuevo JWT token
- [ ] Mantener roles existentes

## 🚨 Códigos de Error

### 400 - Bad Request
```json
{
    "success": false,
    "message": ["Error de validación específico"],
    "errors": {
        "googleId": ["El ID de Google es requerido"],
        "email": ["El email no es válido"],
        "name": ["El nombre es requerido"]
    }
}
```

### 401 - Unauthorized
```json
{
    "success": false,
    "message": "Token de Google inválido o expirado"
}
```

### 409 - Conflict
```json
{
    "success": false,
    "message": "Ya existe un usuario con este email"
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
- [ ] Validación de datos de entrada
- [ ] Verificación de unicidad de googleId y email
- [ ] Generación de JWT token
- [ ] Logging de autenticaciones de Google

### Base de Datos
- [ ] Agregar campo `googleId` a la tabla users
- [ ] Hacer campo `password` nullable para usuarios de Google
- [ ] Crear índice único en `googleId`
- [ ] Crear índice en `email` para búsquedas rápidas

### Lógica de Negocio
- [ ] Si usuario existe por googleId → Login directo
- [ ] Si usuario existe por email pero sin googleId → Actualizar googleId y login
- [ ] Si usuario no existe → Crear nuevo usuario y login
- [ ] Asignar rol 'member' por defecto a nuevos usuarios
- [ ] Generar JWT token con información del usuario

### Seguridad
- [ ] Validar que el googleId proviene de Google (opcional)
- [ ] No permitir cambio de email en usuarios de Google
- [ ] Mantener consistencia entre googleId y email
- [ ] Rate limiting para prevenir abuso

## 🔄 Estados del Frontend

### Loading States
- `isGoogleLoading: boolean` - Para autenticación con Google
- `isCreating: boolean` - Para crear nuevo usuario
- `isLogging: boolean` - Para login de usuario existente

### Error States
- `googleError: string | null` - Para errores de Google Auth
- `validationError: string | null` - Para errores de validación
- `networkError: string | null` - Para errores de red

## 📱 Componentes Frontend que Consumirán estos Endpoints

- `GoogleLoginButton.tsx` - Botón de login con Google
- `LoginView.tsx` - Vista de login principal
- `RegisterView.tsx` - Vista de registro (opcional)

## 🎯 Flujo de Usuario

1. **Usuario hace clic en "Iniciar sesión con Google"**
2. **Se abre popup de Google OAuth**
3. **Usuario autoriza la aplicación**
4. **Google devuelve datos del usuario**
5. **Frontend envía datos al backend**
6. **Backend verifica/crea usuario**
7. **Backend devuelve JWT token**
8. **Frontend guarda token y redirige**

## 📊 Configuración de Google OAuth

### Variables de Entorno Requeridas
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### Configuración en Google Cloud Console
- [ ] Crear proyecto en Google Cloud Console
- [ ] Habilitar Google+ API
- [ ] Crear credenciales OAuth 2.0
- [ ] Configurar URIs de redirección autorizadas
- [ ] Configurar dominios autorizados

## 🔐 Consideraciones de Seguridad

### Validación de Tokens
- [ ] Verificar que el JWT de Google sea válido
- [ ] Validar que el token no haya expirado
- [ ] Verificar la audiencia del token
- [ ] Validar la firma del token

### Protección de Datos
- [ ] No almacenar tokens de Google
- [ ] Encriptar datos sensibles
- [ ] Implementar rate limiting
- [ ] Logging de intentos de autenticación

### Privacidad
- [ ] Informar al usuario sobre el uso de datos
- [ ] Permitir revocación de permisos
- [ ] Cumplir con GDPR/CCPA
- [ ] Política de privacidad clara

## 🚀 Funcionalidades Adicionales

### Opcionales
- [ ] Sincronización de avatar de Google
- [ ] Actualización automática de datos de perfil
- [ ] Vinculación de cuentas (Google + email/password)
- [ ] Desvinculación de cuentas
- [ ] Migración de usuarios existentes

### Métricas
- [ ] Número de logins con Google por día
- [ ] Tasa de conversión de nuevos usuarios
- [ ] Tiempo de autenticación promedio
- [ ] Errores de autenticación más comunes

## 📋 Checklist de Implementación

### Backend
- [ ] Crear endpoint `/api/auth/google`
- [ ] Agregar campo `googleId` a User entity
- [ ] Implementar lógica de creación/login
- [ ] Agregar validaciones
- [ ] Configurar variables de entorno
- [ ] Implementar manejo de errores
- [ ] Agregar logging
- [ ] Crear tests unitarios

### Frontend
- [ ] Instalar Google Identity Services
- [ ] Crear componente GoogleLoginButton
- [ ] Integrar en LoginView
- [ ] Agregar tipos TypeScript
- [ ] Implementar manejo de errores
- [ ] Agregar loading states
- [ ] Crear tests de componente

### Configuración
- [ ] Configurar Google Cloud Console
- [ ] Agregar variables de entorno
- [ ] Configurar dominios autorizados
- [ ] Probar en diferentes entornos
- [ ] Documentar proceso de setup

---

**Fecha de Creación:** 2024-12-19
**Desarrollador Frontend:** AI Assistant
**Prioridad:** Alta
**Estimación Backend:** 2-3 días
**Dependencias:** Google Cloud Console, JWT, Base de datos PostgreSQL

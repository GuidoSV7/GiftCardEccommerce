# 🔧 Solución de Problemas - Chat WebSocket

## 🚨 **Problemas Comunes y Soluciones**

### **1. Error de Conexión WebSocket**
```
Firefox no puede establecer una conexión con el servidor en wss://api.digitalstream.es/socket.io/
```

#### **Causas Posibles:**
- El servidor WebSocket no está configurado correctamente
- La URL del servidor es incorrecta
- Problemas de CORS
- El servidor no soporta WebSockets

#### **Soluciones:**

**A. Verificar Variables de Entorno**
```bash
# Crear archivo .env.local
VITE_API_URL=https://api.digitalstream.es
VITE_WS_URL=https://api.digitalstream.es
```

**B. Verificar Configuración del Servidor**
- Asegúrate de que el servidor NestJS tenga el módulo WebSocket configurado
- Verifica que el puerto esté abierto para WebSockets
- Revisa la configuración de CORS

**C. Usar Modo Fallback**
El sistema automáticamente cambia a polling si WebSocket falla, pero puedes forzarlo:
```typescript
// En el componente de diagnósticos
forceFallback();
```

### **2. Maximum Update Depth Exceeded**
```
Maximum update depth exceeded. This can happen when a component calls setState inside useEffect
```

#### **Causa:**
Loop infinito en useEffect debido a dependencias que cambian en cada render.

#### **Solución:**
Ya corregido en la implementación actual usando `useRef` para los callbacks:

```typescript
// ❌ Antes (causaba loop)
useEffect(() => {
  // ...
}, [options]); // options cambia en cada render

// ✅ Ahora (estable)
const optionsRef = useRef(options);
optionsRef.current = options;

useEffect(() => {
  // ...
}, [token, user]); // Solo dependencias estables
```

### **3. WebSocket se Conecta pero No Recibe Mensajes**

#### **Causas:**
- Autenticación JWT incorrecta
- Namespace incorrecto
- Eventos no registrados correctamente

#### **Soluciones:**

**A. Verificar Autenticación**
```typescript
// El token debe ser válido
const { token } = useAuthStore();
console.log('Token:', token);
```

**B. Verificar Namespace**
```typescript
// Debe coincidir con el backend
const socket = io(`${wsUrl}/chat`, {
  auth: { token }
});
```

**C. Verificar Eventos**
```typescript
// Eventos que debe escuchar el cliente
socket.on('new-message', (message) => {
  console.log('Nuevo mensaje:', message);
});
```

### **4. Fallback No Funciona**

#### **Causas:**
- API REST no disponible
- Endpoints incorrectos
- Problemas de CORS en API REST

#### **Soluciones:**

**A. Verificar Endpoints REST**
```typescript
// Estos endpoints deben funcionar
GET /api/chat/session/active
POST /api/chat/message
GET /api/chat/session/:id/messages
```

**B. Verificar Configuración de Fallback**
```typescript
// En useChatHybrid
fallbackEnabled: true, // Debe estar habilitado
```

## 🛠️ **Herramientas de Diagnóstico**

### **1. Componente de Diagnósticos**
El componente `ChatDiagnostics` proporciona información en tiempo real:

- Estado de conexión
- Modo actual (WebSocket/Fallback)
- Test de conectividad
- Configuración actual
- Acciones de recuperación

### **2. Logs de Consola**
```typescript
// Habilitar logs detallados
console.log('🔌 Conectando a WebSocket:', wsUrl);
console.log('✅ Conectado al chat WebSocket');
console.log('❌ Error en WebSocket:', error);
```

### **3. Network Tab en DevTools**
- Verificar requests a `/socket.io/`
- Revisar status codes
- Verificar headers de autenticación

## 🔄 **Flujo de Recuperación Automática**

1. **Intento WebSocket** → Si falla
2. **Reintentos automáticos** (3 intentos) → Si falla
3. **Cambio a Fallback** (polling) → Funciona
4. **Botón "Reintentar"** → Vuelve a intentar WebSocket

## 📋 **Checklist de Verificación**

### **Backend:**
- [ ] Módulo WebSocket instalado (`@nestjs/websockets`, `socket.io`)
- [ ] Gateway configurado correctamente
- [ ] CORS habilitado para WebSockets
- [ ] Autenticación JWT funcionando
- [ ] Endpoints REST funcionando

### **Frontend:**
- [ ] Variables de entorno configuradas
- [ ] Hook `useChatHybrid` implementado
- [ ] Fallback habilitado
- [ ] Componente de diagnósticos disponible
- [ ] Logs de debug habilitados

### **Red:**
- [ ] Puerto WebSocket abierto
- [ ] Firewall configurado
- [ ] SSL/TLS funcionando (para WSS)
- [ ] Load balancer configurado (si aplica)

## 🚀 **Configuración Recomendada**

### **Desarrollo:**
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=http://localhost:3001
VITE_WS_ENABLED=true
VITE_FALLBACK_ENABLED=true
```

### **Producción:**
```env
VITE_API_URL=https://api.digitalstream.es
VITE_WS_URL=https://api.digitalstream.es
VITE_WS_ENABLED=true
VITE_FALLBACK_ENABLED=true
```

## 📞 **Soporte**

Si los problemas persisten:

1. **Revisar logs** del servidor y cliente
2. **Usar componente de diagnósticos** para identificar el problema
3. **Verificar configuración** de red y servidor
4. **Probar en modo fallback** para confirmar que la funcionalidad básica funciona
5. **Contactar al equipo de desarrollo** con logs y configuración

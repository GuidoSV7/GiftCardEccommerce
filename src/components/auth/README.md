# Google Authentication Component

## 📋 Descripción
Componente de autenticación con Google OAuth 2.0 que permite a los usuarios iniciar sesión usando sus cuentas de Google.

## 🚀 Instalación y Configuración

### 1. Configurar Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google+ API**
4. Ve a **Credenciales** → **Crear credenciales** → **ID de cliente OAuth 2.0**
5. Configura la pantalla de consentimiento OAuth
6. Agrega los dominios autorizados:
   - `http://localhost:3000` (desarrollo)
   - `https://tu-dominio.com` (producción)

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_GOOGLE_CLIENT_ID=tu-google-client-id-aqui
VITE_API_URL=http://localhost:3000/api
```

### 3. Agregar Google Identity Services

Agrega el script de Google Identity Services en tu `index.html`:

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

## 📱 Uso del Componente

### Uso Básico

```tsx
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton';

function LoginPage() {
  const handleSuccess = () => {
    console.log('Login exitoso');
  };

  const handleError = (error: string) => {
    console.error('Error:', error);
  };

  return (
    <GoogleLoginButton
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
```

### Props Disponibles

```tsx
interface GoogleLoginButtonProps {
  onSuccess?: () => void;           // Callback cuando el login es exitoso
  onError?: (error: string) => void; // Callback cuando hay un error
  className?: string;               // Clases CSS adicionales
  size?: 'sm' | 'md' | 'lg';       // Tamaño del botón
  variant?: 'default' | 'minimal' | 'outline'; // Variante del botón
  disabled?: boolean;               // Deshabilitar el botón
}
```

### Ejemplos de Uso

#### Botón Pequeño
```tsx
<GoogleLoginButton
  size="sm"
  variant="minimal"
  onSuccess={() => navigate('/dashboard')}
/>
```

#### Botón Grande con Estilo Outline
```tsx
<GoogleLoginButton
  size="lg"
  variant="outline"
  className="w-full"
  onError={(error) => setError(error)}
/>
```

## 🔧 Configuración Avanzada

### Personalizar Mensajes

Edita `src/config/google-auth.config.ts`:

```typescript
export const googleAuthConfig = {
  messages: {
    loading: 'Conectando con Google...',
    success: '¡Bienvenido!',
    error: 'Error de autenticación',
    newUser: '¡Cuenta creada!',
    existingUser: '¡Bienvenido de vuelta!',
  }
};
```

### Personalizar UI

```typescript
export const googleAuthConfig = {
  ui: {
    theme: 'filled_blue',
    size: 'large',
    type: 'standard',
    shape: 'pill',
    text: 'continue_with',
    logoAlignment: 'center',
  }
};
```

## 🔄 Flujo de Autenticación

1. **Usuario hace clic** en el botón de Google
2. **Se abre popup** de Google OAuth
3. **Usuario autoriza** la aplicación
4. **Google devuelve** datos del usuario (JWT)
5. **Frontend decodifica** el JWT y extrae datos
6. **Se envía** al backend para verificar/crear usuario
7. **Backend devuelve** JWT token de la aplicación
8. **Frontend guarda** token y redirige al usuario

## 🛡️ Seguridad

### Validaciones Implementadas

- ✅ Verificación de configuración antes de inicializar
- ✅ Validación de disponibilidad de Google Identity Services
- ✅ Manejo de errores de autenticación
- ✅ Validación de datos del JWT de Google
- ✅ Rate limiting en el backend

### Mejores Prácticas

- 🔒 Nunca expongas el `GOOGLE_CLIENT_SECRET` en el frontend
- 🔒 Valida siempre los tokens en el backend
- 🔒 Usa HTTPS en producción
- 🔒 Implementa rate limiting
- 🔒 Logs de intentos de autenticación

## 🐛 Solución de Problemas

### Error: "Google Identity Services no está disponible"

**Causa:** El script de Google no se ha cargado.

**Solución:**
1. Verifica que el script esté en `index.html`
2. Verifica la conexión a internet
3. Verifica que no haya bloqueadores de anuncios

### Error: "Configuración de Google Auth incompleta"

**Causa:** `VITE_GOOGLE_CLIENT_ID` no está configurado.

**Solución:**
1. Verifica el archivo `.env`
2. Reinicia el servidor de desarrollo
3. Verifica que la variable esté disponible

### Error: "Token de Google inválido"

**Causa:** El JWT de Google está corrupto o expirado.

**Solución:**
1. Verifica la configuración en Google Cloud Console
2. Verifica que el dominio esté autorizado
3. Verifica que el client ID sea correcto

### Popup Bloqueado

**Causa:** El navegador bloquea popups.

**Solución:**
1. Permite popups para el dominio
2. Usa el método alternativo (botón renderizado)
3. Considera usar redirect en lugar de popup

## 📊 Monitoreo

### Métricas Recomendadas

- Número de logins con Google por día
- Tasa de éxito de autenticación
- Tiempo promedio de autenticación
- Errores más comunes
- Nuevos usuarios vs usuarios existentes

### Logs Importantes

```typescript
// En el componente
console.log('Google Auth iniciado');
console.log('Usuario autenticado:', userData);
console.error('Error de Google Auth:', error);

// En el backend
console.log('Google Auth request:', googleData);
console.log('Usuario creado/encontrado:', user);
```

## 🔄 Actualizaciones

### Versión 1.0.0
- ✅ Autenticación básica con Google
- ✅ Creación automática de usuarios
- ✅ Manejo de errores
- ✅ Configuración personalizable
- ✅ Tipos TypeScript completos

### Próximas Versiones
- 🔄 Sincronización de avatar
- 🔄 Vinculación de cuentas
- 🔄 Desvinculación de cuentas
- 🔄 Migración de usuarios existentes
- 🔄 Métricas avanzadas

## 📚 Recursos Adicionales

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [JWT.io](https://jwt.io/) - Para debuggear tokens

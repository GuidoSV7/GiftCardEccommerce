import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useChatStable } from '../../hooks/useChatStable';

interface ChatNotificationProps {
  enabled?: boolean;
}

export const ChatNotification = ({ enabled = true }: ChatNotificationProps) => {
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  useChatStable({
    onNewPendingSession: (data) => {
      if (!enabled) return;
      
      // Evitar notificaciones duplicadas
      if (lastNotification === data.sessionId) return;
      
      setLastNotification(data.sessionId);
      
      // Mostrar notificación toast
      toast.info(
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
          <div>
            <p className="font-medium">Nueva sesión de chat</p>
            <p className="text-sm text-gray-600">
              Usuario {data.userId.slice(-4)} necesita ayuda
            </p>
          </div>
        </div>,
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    },
    onNewMessage: (message) => {
      if (!enabled) return;
      
      // Solo notificar mensajes de usuarios (no de soporte)
      if (message.sender === 'user') {
        toast.info(
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <div>
              <p className="font-medium">Nuevo mensaje</p>
              <p className="text-sm text-gray-600 truncate max-w-xs">
                {message.message}
              </p>
            </div>
          </div>,
          {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    }
  });

  // Limpiar notificación después de un tiempo
  useEffect(() => {
    if (lastNotification) {
      const timer = setTimeout(() => {
        setLastNotification(null);
      }, 10000); // 10 segundos

      return () => clearTimeout(timer);
    }
  }, [lastNotification]);

  return null; // Este componente no renderiza nada visual
};

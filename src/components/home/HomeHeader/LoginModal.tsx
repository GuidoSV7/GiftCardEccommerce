import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  // Cerrar modal al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  const handleLogin = () => {
    navigate('/login');
    onClose();
  };

  const handleRegister = () => {
    navigate('/register');
    onClose();
  };

  if (!open) return null;

  return (
    <div ref={modalRef} className="absolute right-0 top-full mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-80 z-50">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Bienvenido a VEMPERGAMES</p>
              <p className="text-gray-400 text-xs">Inicia sesión o regístrate</p>
            </div>
          </div>
        </div>

        {/* Opciones */}
        <div className="p-4 space-y-3">
          <button
            onClick={handleLogin}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2.5 rounded-full transition-colors text-sm"
          >
            INICIAR SESIÓN
          </button>
          
          <button
            onClick={handleRegister}
            className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold py-2.5 rounded-full transition-colors text-sm"
          >
            REGISTRARSE
          </button>
        </div>
    </div>
  );
};

export default LoginModal;

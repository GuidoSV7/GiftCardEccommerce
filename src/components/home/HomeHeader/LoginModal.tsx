import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2a2d3a]/95 backdrop-blur-sm rounded-xl p-6 w-80 mx-4 relative shadow-2xl">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6 pt-2">
          <h2 className="text-white text-lg font-semibold">Bienvenido a GifCards</h2>
        </div>

        {/* Botones */}
        <div className="space-y-3">
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
    </div>
  );
};

export default LoginModal;

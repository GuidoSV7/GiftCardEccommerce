import React from 'react';

interface MobileLoginPanelProps {
  open: boolean;
  onClose: () => void;
}

const MobileLoginPanel: React.FC<MobileLoginPanelProps> = ({ open, onClose }) => (
  <div
    className={`fixed top-0 right-0 w-[280px] h-screen bg-[#23272f]/95 transform transition-transform duration-300 ease-out z-50 md:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}
  >
    <div className="pt-16 px-6 flex flex-col items-center h-full relative">
      {/* Botón de cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/90 hover:text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <span className="text-white font-bold text-xl mt-8 mb-8">VEMPERGAMES</span>
      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full mb-4 transition-colors">INICIAR SESIÓN</button>
      <button className="w-full bg-green-400 hover:bg-green-500 text-white font-bold py-3 rounded-full transition-colors">REGISTRARSE</button>
    </div>
  </div>
);

export default MobileLoginPanel;

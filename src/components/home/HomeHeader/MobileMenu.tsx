import React from 'react';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose }) => (
  <div
    className={`fixed top-0 left-0 w-[280px] h-screen bg-[#080b14]/95 transform transition-transform duration-300 ease-out z-50 md:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}
  >
    <div className="pt-16 px-6">
      {/* Botón de cerrar */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white/90 hover:text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="space-y-6 mt-6">
        <div className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
          </svg>
          <span className="text-sm font-medium">JUEGO</span>
        </div>
        <div className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span className="text-sm font-medium">TARJETA</span>
        </div>
        <div className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">RECARGA DIRECTA</span>
        </div>
        <div className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-3m0 0V8m0 7h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">RECARGA MÓVIL</span>
        </div>
      </div>
    </div>
  </div>
);

export default MobileMenu;

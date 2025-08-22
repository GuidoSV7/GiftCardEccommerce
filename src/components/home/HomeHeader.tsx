
import { useState, useEffect } from 'react';

export default function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Prevenir el scroll cuando el menú está abierto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  return (
    <header className="bg-[#080b14] py-3 fixed w-full top-0 z-50 shadow-lg">
      {/* Overlay oscuro para el menú móvil */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="container mx-auto px-4">
        {/* Vista Móvil */}
        <div className="md:hidden z-50 relative">
          <div className="flex items-center justify-between">
            {/* Menú hamburguesa */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <div className="flex items-center">
              <span className="text-white font-bold text-xl">GIFCARDS</span>
            </div>

            {/* Búsqueda */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Menú desplegable */}
          <div 
            className={`fixed top-0 left-0 w-[280px] h-screen bg-[#080b14]/95 transform transition-transform duration-300 ease-out ${
              menuOpen ? 'translate-x-0' : '-translate-x-full'
            } z-50`}
          >
            <div className="pt-16 px-6">
              {/* Botón de cerrar */}
              <button 
                onClick={() => setMenuOpen(false)}
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

          {/* Barra de búsqueda desplegable */}
          {searchOpen && (
            <div className="absolute left-0 right-0 bg-[#080b14] mt-3 p-4 border-t border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-white rounded-lg pl-10 pr-4 py-2 focus:outline-none"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Vista Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {/* Logo/Nombre */}
          <div className="flex items-center">
            <span className="text-white font-bold text-xl">GIFCARDS</span>
          </div>

          {/* Selector de Categoría */}
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 bg-[#1c1f2c] text-white px-4 py-2 rounded-lg hover:bg-[#2c2f3c] transition-colors">
              <span>Category</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Buscador */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-[#1c1f2c] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Ubicación */}
          <button className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors px-3 py-2 rounded-lg hover:bg-white/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>BO</span>
          </button>

          {/* Login */}
          <button className="flex items-center gap-2 bg-[#1c1f2c] text-white px-4 py-2 rounded-lg hover:bg-[#2c2f3c] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Login</span>
          </button>
        </div>
      </div>
    </header>
  );
}

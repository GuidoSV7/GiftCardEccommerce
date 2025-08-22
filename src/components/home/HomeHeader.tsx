
import { useState } from 'react';

export default function HomeHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[#080b14] py-3 fixed w-full top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          {/* Logo/Nombre */}
          <div className="flex items-center">
           
            <span className="text-white font-bold text-xl ml-2">GIFCARDS</span>
          </div>

          {/* Selector de Categoría */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-[#1c1f2c] text-white px-4 py-2 rounded-lg hover:bg-[#2c2f3c] transition-colors"
            >
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
                className="w-full bg-white rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
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
          <button className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors px-3 py-2 rounded-lg hover:bg-white/10 shadow-lg shadow-blue-500/20">
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

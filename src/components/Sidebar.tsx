import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Sidebar() {
  const [isGifcardsOpen, setIsGifcardsOpen] = useState(false);
  const [isOffersOpen, setIsOffersOpen] = useState(false);

  return (
    <nav className="bg-gray-800 h-screen w-64 fixed left-0 top-0 pt-20 text-white">
      <div className="p-4">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <Link
              to="/dashboard"
              className="flex items-center hover:bg-gray-700 rounded-lg p-3 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>

          {/* Métricas */}
          <li>
            <Link
              to="/metrics"
              className="flex items-center hover:bg-gray-700 rounded-lg p-3 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="ml-3">Métricas</span>
            </Link>
          </li>

          {/* Gifcards Menú */}
          <li>
            <button
              onClick={() => setIsGifcardsOpen(!isGifcardsOpen)}
              className="flex items-center justify-between w-full hover:bg-gray-700 rounded-lg p-3 transition-colors duration-200"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="ml-3">Gifcards</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isGifcardsOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Submenú de Gifcards */}
            <ul className={`mt-2 space-y-1 ${isGifcardsOpen ? 'block' : 'hidden'}`}>
              <li>
                <Link
                  to="/products"
                  className="flex items-center pl-11 pr-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Ver Gifcards
                </Link>
              </li>
              <li>
                <Link
                  to="/products/create"
                  className="flex items-center pl-11 pr-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Crear Gifcard
                </Link>
              </li>
              <li>
                <Link
                  to="/products/metrics"
                  className="flex items-center pl-11 pr-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Ver Métricas
                </Link>
              </li>
            </ul>
          </li>

          {/* Ofertas Menú */}
          <li>
            <button
              onClick={() => setIsOffersOpen(!isOffersOpen)}
              className="flex items-center justify-between w-full hover:bg-gray-700 rounded-lg p-3 transition-colors duration-200"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="ml-3">Ofertas</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isOffersOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Submenú de Ofertas */}
            <ul className={`mt-2 space-y-1 ${isOffersOpen ? 'block' : 'hidden'}`}>
              <li>
                <Link
                  to="/offers"
                  className="flex items-center pl-11 pr-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Ver Ofertas
                </Link>
              </li>
              <li>
                <Link
                  to="/offers/create"
                  className="flex items-center pl-11 pr-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Crear Oferta
                </Link>
              </li>
              <li>
                <Link
                  to="/offers/active"
                  className="flex items-center pl-11 pr-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Ofertas Activas
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}

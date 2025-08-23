import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Sidebar() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);

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

          {/* Productos Menú */}
          <li>
            <button
              onClick={() => setIsProductsOpen(!isProductsOpen)}
              className="flex items-center justify-between w-full hover:bg-gray-700 rounded-lg p-3 transition-colors duration-200"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="ml-3">Productos</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isProductsOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Submenú de Productos */}
            <ul className={`mt-2 space-y-1 ${isProductsOpen ? 'block' : 'hidden'}`}>
              <li>
                <Link
                  to="/products"
                  className="flex items-center pl-11 pr-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Ver Productos
                </Link>
              </li>
              <li>
                <Link
                  to="/products/create"
                  className="flex items-center pl-11 pr-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Crear Producto
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
        </ul>
      </div>
    </nav>
  );
}

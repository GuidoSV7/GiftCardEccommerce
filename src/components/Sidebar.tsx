import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function Sidebar() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isSmmPanelOpen, setIsSmmPanelOpen] = useState(false);
  
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 h-screen w-64 fixed left-0 top-0 pt-20 text-white">
      <div className="p-4 h-full overflow-y-auto pb-20">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <Link
              to="/dashboard"
              className="flex items-center hover:bg-gray-700 rounded-lg p-3 transition-colors duration-200"
            >
              <span>Dashboard</span>
            </Link>
          </li>

          {/* Métricas */}
          <li>
            <Link
              to="/dashboard/metrics"
              className="flex items-center hover:bg-gray-700 rounded-lg p-3 transition-colors duration-200"
            >
              <span>Métricas</span>
            </Link>
          </li>

                      {/* Products Menú */}
          <li>
            <button
              onClick={() => setIsProductsOpen(!isProductsOpen)}
              className="flex items-center justify-between w-full hover:bg-gray-700 rounded-lg p-3 transition-colors duration-200"
            >
              <div className="flex items-center">
                <span>Productos</span>
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

            {/* Submenú de Products */}
            <ul className={`mt-2 space-y-1 ${isProductsOpen ? 'block' : 'hidden'}`}>
              <li>
                <Link
                  to="/dashboard/products"
                  className="flex items-center pl-11 pr-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Ver Productos
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/products/create"
                  className="flex items-center pl-11 pr-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Crear Productos
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
                <span>Ofertas</span>
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
                  to="/dashboard/offers"
                  className="flex items-center pl-11 pr-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Ver Ofertas
                </Link>
              </li>
            </ul>
          </li>

          {/* Categorías Menú */}
          <li>
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="flex items-center justify-between w-full hover:bg-gray-700 rounded-lg p-3 transition-colors duration-200"
            >
              <div className="flex items-center">
                <span>Categorías</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Submenú de Categorías */}
            <ul className={`mt-2 space-y-1 ${isCategoriesOpen ? 'block' : 'hidden'}`}>
              <li>
                <Link
                  to="/dashboard/categories"
                  className="flex items-center pl-11 pr-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Ver Categorías
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/categories/create"
                  className="flex items-center pl-11 pr-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Crear Categoría
                </Link>
              </li>
            </ul>
          </li>

          {/* Miembros Menú */}
          <li>
            <button
              onClick={() => setIsMembersOpen(!isMembersOpen)}
              className="flex items-center justify-between w-full hover:bg-gray-700 rounded-lg p-3 transition-colors duration-200"
            >
              <div className="flex items-center">
                <span>Miembros</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isMembersOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Submenú de Miembros */}
            <ul className={`mt-2 space-y-1 ${isMembersOpen ? 'block' : 'hidden'}`}>
              <li>
                <Link
                  to="/dashboard/members"
                  className="flex items-center pl-11 pr-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Ver Miembros
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/members/create"
                  className="flex items-center pl-11 pr-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Crear Miembro
                </Link>
              </li>
            </ul>
          </li>

          {/* SMM Panel Menú */}
          <li>
            <button
              onClick={() => setIsSmmPanelOpen(!isSmmPanelOpen)}
              className="flex items-center justify-between w-full hover:bg-gray-700 rounded-lg p-3 transition-colors duration-200"
            >
              <div className="flex items-center">
                <span>SMM Panel</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isSmmPanelOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Submenú de SMM Panel */}
            <ul className={`mt-2 space-y-1 ${isSmmPanelOpen ? 'block' : 'hidden'}`}>
              <li>
                <Link
                  to="/dashboard/smm/services"
                  className="flex items-center pl-11 pr-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/smm/orders"
                  className="flex items-center pl-11 pr-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Órdenes
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/smm/tickets"
                  className="flex items-center pl-11 pr-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Tickets
                </Link>
              </li>
            </ul>
          </li>

          {/* Métodos de Pago */}
          <li>
            <Link
              to="/dashboard/payment-methods"
              className="flex items-center hover:bg-gray-700 rounded-lg p-3 transition-colors duration-200"
            >
              <span>Métodos de Pago</span>
            </Link>
          </li>
        </ul>
        
        {/* Botón de Cerrar Sesión */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

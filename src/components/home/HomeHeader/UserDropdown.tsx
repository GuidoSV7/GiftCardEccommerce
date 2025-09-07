import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import {
  AccountIcon,
  OrdersIcon,
  RechargeIcon,
  CardsIcon,
  InvoiceIcon,
  GamesIcon,
  CouponsIcon
} from '../../../icons';

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);


const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

interface UserDropdownProps {
  onLoginModalOpen?: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ onLoginModalOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // Si no hay usuario, mostrar botón de Login
  if (!user) {
    return (
      <button 
        onClick={onLoginModalOpen}
        className="flex items-center gap-2 bg-[#1c1f2c] text-white px-4 py-2 rounded-lg hover:bg-[#2c2f3c] transition-colors"
      >
        <UserIcon />
        <span>Login</span>
      </button>
    );
  }

  // Determinar el estilo del botón según el rol
  const getButtonStyle = () => {
    if (user.roles === 'admin' || user.roles === 'superadmin') {
      return "flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors";
    }
    return "flex items-center gap-2 bg-[#1c1f2c] text-white px-4 py-2 rounded-lg hover:bg-[#2c2f3c] transition-colors";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón del usuario */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={getButtonStyle()}
      >
        <UserIcon />
        <span>{user.email.split('@')[0]}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
          {/* Header del usuario */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <UserIcon />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{user.email.split('@')[0]}</p>
                <p className="text-gray-400 text-xs">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Grid de opciones - Diferentes según el rol */}
          <div className="p-4">
            {user.roles === 'member' ? (
              // Opciones para miembros
              <div className="grid grid-cols-2 gap-3">
                {/* Columna izquierda */}
                <div className="space-y-2">
                  <Link
                    to="/member/my-account"
                    className="flex items-center gap-3 p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <AccountIcon />
                    <span className="text-sm">Mi Cuenta</span>
                  </Link>
                  <Link
                    to="/member/recharge"
                    className="flex items-center gap-3 p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <RechargeIcon />
                    <span className="text-sm">Recarga</span>
                  </Link>
                  <Link
                    to="/member/my-invoice"
                    className="flex items-center gap-3 p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <InvoiceIcon />
                    <span className="text-sm">Mis Facturas</span>
                  </Link>
                  <Link
                    to="/member/my-coupons"
                    className="flex items-center gap-3 p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <CouponsIcon />
                    <span className="text-sm">Mis Cupones</span>
                  </Link>
                </div>

                {/* Columna derecha */}
                <div className="space-y-2">
                  <Link
                    to="/member/my-orders"
                    className="flex items-center gap-3 p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <OrdersIcon />
                    <span className="text-sm">Mis Pedidos</span>
                  </Link>
                  <Link
                    to="/member/my-cards"
                    className="flex items-center gap-3 p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <CardsIcon />
                    <span className="text-sm">Mis Tarjetas</span>
                  </Link>
                  <Link
                    to="/member/vemper-affiliates"
                    className="flex items-center gap-3 p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <GamesIcon />
                    <span className="text-sm">Vemper Affiliates</span>
                  </Link>
                </div>
              </div>
            ) : (
              // Opciones para admin/superadmin - Solo Panel de Administración
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 p-3 text-white hover:bg-gray-700 rounded-lg transition-colors bg-green-600/20 border border-green-600/30"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                  </svg>
                  <div>
                    <span className="text-sm font-medium">Panel de Administración</span>
                    <p className="text-xs text-gray-400">Gestionar productos, categorías y miembros</p>
                  </div>
                </Link>
              </div>
            )}

            {/* Opciones del footer */}
            <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-2 text-white hover:bg-gray-700 rounded-lg transition-colors w-full"
              >
                <LogoutIcon />
                <span className="text-sm">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;

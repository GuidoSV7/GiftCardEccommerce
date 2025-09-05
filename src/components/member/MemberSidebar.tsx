import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AccountIcon,
  OrdersIcon,
  RechargeIcon,
  CardsIcon,
  InvoiceIcon,
  GamesIcon,
  CouponsIcon
} from '../../icons';

const MemberSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/member/my-account', label: 'Mi Cuenta', icon: <AccountIcon /> },
    { path: '/member/my-orders', label: 'Mis Pedidos', icon: <OrdersIcon /> },
    { path: '/member/recharge', label: 'Recarga', icon: <RechargeIcon /> },
    { path: '/member/my-cards', label: 'Mis Tarjetas', icon: <CardsIcon /> },
    { path: '/member/my-invoice', label: 'Mis Facturas', icon: <InvoiceIcon /> },
    { path: '/member/vemper-affiliates', label: 'Vemper Affiliates', icon: <GamesIcon /> },
    { path: '/member/my-coupons', label: 'Mis Cupones', icon: <CouponsIcon /> },
  ];

  return (
    <div className="hidden lg:block bg-gray-900 p-4 min-h-[600px] overflow-y-auto">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-4 rounded-3xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/30 to-blue-400/30 text-blue-300 font-bold shadow-lg backdrop-blur-sm border border-blue-300/20'
                  : 'text-white hover:bg-gray-800'
              }`}
            >
              <span className={`mr-3 ${isActive ? 'text-blue-300' : ''}`}>{item.icon}</span>
              <span className={isActive ? 'font-bold' : 'font-medium'}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MemberSidebar;

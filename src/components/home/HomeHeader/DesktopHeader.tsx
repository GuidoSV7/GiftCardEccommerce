import React from 'react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import UserDropdown from './UserDropdown';
import CategoryDropdown from './CategoryDropdown';

interface DesktopHeaderProps {
  onLoginModalOpen: () => void;
}

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LocationButton = () => (
  <button className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors px-3 py-2 rounded-lg hover:bg-white/10">
    <LocationIcon />
    <span>BO</span>
  </button>
);

const DesktopHeader: React.FC<DesktopHeaderProps> = ({ onLoginModalOpen }) => {
  return (
    <div className="hidden md:flex items-center gap-4">
      {/* Logo/Nombre */}
      <Logo />

      {/* Selector de Categoría */}
      <div className="flex items-center gap-6">
        <CategoryDropdown />
      </div>

      {/* Buscador */}
      <div className="flex-1">
        <SearchBar variant="desktop" />
      </div>

      {/* Ubicación */}
      <LocationButton />

      {/* Login o User Dropdown */}
      <UserDropdown onLoginModalOpen={onLoginModalOpen} />
    </div>
  );
};

export default DesktopHeader;

import React from 'react';
import Logo from './Logo';
import SearchBar from './SearchBar';

interface MobileHeaderProps {
  menuOpen: boolean;
  searchOpen: boolean;
  loginPanelOpen: boolean;
  onMenuToggle: () => void;
  onSearchToggle: () => void;
  onLoginPanelOpen: () => void;
}

const HamburgerIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MobileHeader: React.FC<MobileHeaderProps> = ({
  searchOpen,
  onMenuToggle,
  onSearchToggle,
  onLoginPanelOpen
}) => {
  return (
    <div className="md:hidden z-50 relative">
      <div className="flex items-center justify-between">
        {/* Menú hamburguesa */}
        <button 
          onClick={onMenuToggle}
          className="text-white p-2"
        >
          <HamburgerIcon />
        </button>

        {/* Logo */}
        <Logo />

        {/* Búsqueda y Login */}
        <div className="flex items-center gap-1">
          <button 
            onClick={onSearchToggle}
            className="text-white p-2"
          >
            <SearchIcon />
          </button>
          
          <button
            className="flex items-center justify-center bg-[#1c1f2c] text-white rounded-full p-2 hover:bg-[#2c2f3c] transition-colors md:rounded-lg md:px-4 md:py-2 md:gap-2 md:flex-row md:w-auto w-10 h-10"
            onClick={onLoginPanelOpen}
          >
            <UserIcon />
            <span className="hidden md:inline text-sm">Login</span>
          </button>
        </div>
      </div>

      {/* Barra de búsqueda desplegable */}
      {searchOpen && (
        <div className="absolute left-0 right-0 bg-[#080b14] mt-3 p-4 border-t border-gray-700">
          <SearchBar variant="mobile" />
        </div>
      )}
    </div>
  );
};

export default MobileHeader;

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../../../stores/searchStore';
import { type SearchResult } from '../../../stores/searchStore';

interface SearchBarProps {
  variant?: 'desktop' | 'mobile';
  placeholder?: string;
  className?: string;
}

const SearchIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SearchBar: React.FC<SearchBarProps> = ({ 
  variant = 'desktop', 
  placeholder = 'Buscar productos o categorías...',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { 
    query, 
    searchResults, 
    setQuery, 
    clearSearch, 
    initializeData 
  } = useSearchStore();

  // Inicializar datos al montar el componente
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
  };

  const handleResultSelect = (result: SearchResult) => {
    if (result.type === 'product') {
      navigate(`/product/${result.id}`);
    } else {
      navigate(`/category/${result.id}`);
    }
    clearSearch();
    setIsOpen(false);
  };

  const handleClear = () => {
    clearSearch();
    setIsOpen(false);
  };

  const baseInputClasses = "w-full rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const desktopInputClasses = `${baseInputClasses} bg-[#1c1f2c] text-white`;
  const mobileInputClasses = `${baseInputClasses} bg-white text-gray-900`;

  if (variant === 'mobile') {
    return (
      <div ref={searchRef} className={`relative ${className}`}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={mobileInputClasses}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <SearchIcon />
        </div>
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <CloseIcon />
          </button>
        )}
      </div>
    );
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={desktopInputClasses}
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <SearchIcon />
      </div>
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <CloseIcon />
        </button>
      )}

      {/* Dropdown de resultados */}
      {isOpen && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 max-h-80 overflow-y-auto">
          {searchResults.map((result: SearchResult) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleResultSelect(result)}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {result.type === 'product' && result.image && (
                <img
                  src={result.image}
                  alt={result.title}
                  className="w-10 h-10 rounded object-cover"
                />
              )}
              {result.type === 'category' && (
                <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{result.title}</p>
                {result.type === 'product' && result.category && (
                  <p className="text-gray-400 text-xs truncate">{result.category}</p>
                )}
                <p className="text-gray-500 text-xs">
                  {result.type === 'product' ? 'Producto' : 'Categoría'}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {isOpen && query && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 p-4">
          <p className="text-gray-400 text-sm text-center">
            No se encontraron resultados para "{query}"
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

import React from 'react';

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

const SearchBar: React.FC<SearchBarProps> = ({ 
  variant = 'desktop', 
  placeholder = 'Search',
  className = '' 
}) => {
  if (variant === 'mobile') {
    return (
      <div className={`relative ${className}`}>
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-white rounded-lg pl-10 pr-4 py-2 focus:outline-none"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <SearchIcon />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-[#1c1f2c] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <SearchIcon />
      </div>
    </div>
  );
};

export default SearchBar;

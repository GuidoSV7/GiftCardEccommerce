import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../../services/categoryService';
import type { Category } from '../../../types';

const ChevronDownIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CategoryIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

interface CategoryDropdownProps {
  className?: string;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Handle click outside to close dropdown
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

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setIsOpen(false);
    navigate(`/category/${category.id}`);
  };

  const handleViewAllCategories = () => {
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Category Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#1c1f2c] text-white px-4 py-2 rounded-lg hover:bg-[#2c2f3c] transition-colors"
      >
        <span>{selectedCategory ? selectedCategory.name : 'Category'}</span>
        <ChevronDownIcon />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="py-2">
            {/* View All Categories Option */}
            <button
              onClick={handleViewAllCategories}
              className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors flex items-center gap-3"
            >
              <CategoryIcon />
              <span className="font-medium">Ver todas las categorías</span>
            </button>
            
            {/* Divider */}
            <div className="border-t border-gray-700 my-2"></div>
            
            {/* Categories List */}
            {isLoading ? (
              <div className="px-4 py-3 text-gray-400 text-sm">
                Cargando categorías...
              </div>
            ) : categories.length > 0 ? (
              <div className="max-h-64 overflow-y-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors flex items-center gap-3"
                  >
                    {category.imageUrl ? (
                      <img 
                        src={category.imageUrl} 
                        alt={category.name}
                        className="w-6 h-6 rounded object-cover"
                      />
                    ) : (
                      <CategoryIcon />
                    )}
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 text-gray-400 text-sm">
                No hay categorías disponibles
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;

import React from 'react';
import { CardItem } from './CardItem';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../services/productService';

interface CardGridSectionProps {
    title: string;
    products: Product[];
    categoryId?: string;
    className?: string;
}

export const CardGridSection: React.FC<CardGridSectionProps> = ({ title, products, categoryId, className = "" }) => {
    const navigate = useNavigate();

    const handleVerMas = () => {
        if (categoryId) {
            navigate(`/category/${categoryId}`);
        }
    };

    return (
        <div className={`flex-1 bg-white/4 backdrop-blur-sm rounded-xl shadow-lg p-3 sm:p-4 ${className}`}>
            <div className="flex justify-between items-center mb-2 sm:mb-3">
                <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
                {categoryId && (
                    <button 
                        onClick={handleVerMas}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                    >
                        Ver más
                    </button>
                )}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                            {products.map((product) => (
                <CardItem
                    key={product.id}
                    id={product.id}
                    image={product.rectangularImageUrl || product.squareImageUrl || product.smallSquareImageUrl || 'https://via.placeholder.com/200x200?text=No+Image'}
                    title={product.title}
                    alt={product.title}
                />
            ))}
            </div>
        </div>
    );
};

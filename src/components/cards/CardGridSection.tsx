import React from 'react';
import { CardItem } from './CardItem';
import type { Product } from '../../services/productService';

interface CardGridSectionProps {
    title: string;
    products: Product[];
    className?: string;
}

export const CardGridSection: React.FC<CardGridSectionProps> = ({ title, products, className = "" }) => {
    return (
        <div className={`flex-1 bg-white/4 backdrop-blur-sm rounded-xl shadow-lg p-3 sm:p-4 ${className}`}>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{title}</h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                            {products.map((product) => (
                <CardItem
                    key={product.id}
                    id={product.id}
                    image={product.imageUrl}
                    title={product.title}
                    alt={product.title}
                />
            ))}
            </div>
        </div>
    );
};

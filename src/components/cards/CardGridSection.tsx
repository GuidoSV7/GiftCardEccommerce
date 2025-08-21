import React from 'react';
import { CardItem } from './CardItem';

interface SectionProps {
    title: string;
    items: {
        image: string;
        title: string;
        alt: string;
    }[];
}

interface CardGridSectionProps extends SectionProps {
    className?: string;
}

export const CardGridSection: React.FC<CardGridSectionProps> = ({ title, items, className = "" }) => {
    return (
        <div className={`flex-1 bg-white rounded-xl shadow-sm p-3 sm:p-4 ${className}`}>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {items.slice(0, 4).map((item, idx) => (
                    <CardItem 
                        key={idx}
                        image={item.image}
                        title={item.title}
                        alt={item.alt}
                    />
                ))}
            </div>
        </div>
    );
};

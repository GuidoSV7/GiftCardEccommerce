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
        <div className={`flex-1 bg-white/4 backdrop-blur-sm rounded-xl shadow-lg p-3 sm:p-4 ${className}`}>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{title}</h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
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

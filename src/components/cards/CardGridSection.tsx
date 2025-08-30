import React from 'react';
import { CardItem } from './CardItem';
import type { Gifcard } from '../../services/gifcardService';

interface CardGridSectionProps {
    title: string;
    gifcards: Gifcard[];
    className?: string;
}

export const CardGridSection: React.FC<CardGridSectionProps> = ({ title, gifcards, className = "" }) => {
    return (
        <div className={`flex-1 bg-white/4 backdrop-blur-sm rounded-xl shadow-lg p-3 sm:p-4 ${className}`}>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{title}</h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                {gifcards.map((gifcard) => (
                    <CardItem 
                        key={gifcard.id}
                        image={gifcard.imageUrl}
                        title={gifcard.title}
                        alt={gifcard.title}
                    />
                ))}
            </div>
        </div>
    );
};

import React from 'react';

interface CardItemProps {
    image: string;
    title: string;
    alt: string;
}

export const CardItem: React.FC<CardItemProps> = ({ image, title, alt }) => (
    <div className="group cursor-pointer">
        <div className="p-2 sm:p-3 transition-colors">
            <img 
                src={image}
                alt={alt}
                className='w-full h-[120px] sm:h-[140px] object-cover rounded-lg mb-2'
            />
            <p className='text-center text-xs sm:text-sm font-medium text-gray-700 group-hover:text-blue-600'>{title}</p>
        </div>
    </div>
);

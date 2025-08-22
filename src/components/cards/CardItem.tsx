import React from 'react';

interface CardItemProps {
    image: string;
    title: string;
    alt: string;
}

export const CardItem: React.FC<CardItemProps> = ({ image, title, alt }) => (
    <div className="group cursor-pointer">
        <div className="p-2 sm:p-3 transition-all">
            <div className="relative overflow-hidden rounded-lg mb-2">
                <img 
                    src={image}
                    alt={alt}
                    className='w-full h-[120px] sm:h-[140px] object-cover transition-transform duration-300 group-hover:scale-110'
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <p className='text-center text-xs sm:text-sm font-medium text-gray-100 group-hover:text-blue-300 transition-colors'>{title}</p>
        </div>
    </div>
);

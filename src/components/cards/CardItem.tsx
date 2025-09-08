import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CardItemProps {
    id: string;
    image: string;
    title: string;
    alt: string;
}

export const CardItem: React.FC<CardItemProps> = ({ id, image, title, alt }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/product/${id}`);
    };

    return (
        <div className="group cursor-pointer w-full" onClick={handleClick}>
            <div className="p-2 transition-all">
                <div className="relative overflow-hidden rounded-2xl mb-2 w-full aspect-[4/3] sm:aspect-square">
                    <img 
                        src={image}
                        alt={alt}
                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <p className='text-center text-xs sm:text-sm md:text-base font-medium text-gray-100 group-hover:text-blue-300 transition-colors line-clamp-2'>{title}</p>
            </div>
        </div>
    );
};

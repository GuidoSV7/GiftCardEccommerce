import { useNavigate } from 'react-router-dom';
import type { ProductWithOffer } from '../../services/productOffersService';

interface OfferCardProps {
    product: ProductWithOffer;
}

export const OfferCard = ({ product }: OfferCardProps) => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/product/${product.id}`);
    };
    
    return (
        <div 
            className='group bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:bg-gray-750'
            onClick={handleClick}
        >
            {/* Imagen de fondo */}
            <div className='relative h-32 overflow-hidden'>
                <img 
                    src={product.rectangularImageUrl}
                    alt={product.title}
                    className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/200x128?text=Error+al+cargar';
                    }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent'></div>
                
                {/* Etiqueta de OFERTA */}
                <div className='absolute top-2 left-2'>
                    <span className='bg-green-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide'>
                        Oferta
                    </span>
                </div>

                {/* Descuento */}
                <div className='absolute top-2 right-2'>
                    <span className='bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded'>
                        -{product.offerPrice.discountPercentage}%
                    </span>
                </div>
            </div>

            {/* Información del producto */}
            <div className='p-3 flex justify-between items-center'>
                <div className='flex-1 min-w-0 mr-2'>
                    <h3 className='text-white font-medium text-sm truncate group-hover:text-blue-400 transition-colors'>
                        {product.title}
                    </h3>
                    <div className='flex items-center gap-2 mt-1'>
                        <p className='text-gray-400 text-xs line-through'>
                            ${product.offerPrice.value.toFixed(2)}
                        </p>
                        <p className='text-green-400 text-sm font-bold'>
                            ${product.offerPrice.finalPrice.toFixed(2)}
                        </p>
                    </div>
                </div>
                <div className='flex items-center'>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
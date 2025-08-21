interface OfferCardProps {
    image: string;
    price: string;
    title: string;
    discount: string; // Nuevo prop para el porcentaje
}

export const OfferCard = ({ image, price, title, discount }: OfferCardProps) => {
    // Convertir el string de descuento a número
    const discountNumber = parseFloat(discount.replace('%', ''));
    
    return (
        <div className='group bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:bg-gray-750'>
            {/* Imagen de fondo */}
            <div className='relative h-32 overflow-hidden'>
                <img 
                    src={image}
                    alt={title}
                    className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent'></div>
                
                {/* Etiqueta de PROMOCIÓN */}
                <div className='absolute top-2 left-2'>
                    <span className='bg-green-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide'>
                        Promoción
                    </span>
                </div>

                {/* Descuento */}
                {discountNumber <= -15 && (
                    <div className='absolute top-2 right-2'>
                        <span className='bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded'>
                            {discount}
                        </span>
                    </div>
                )}
            </div>

            {/* Información del juego */}
            <div className='p-3 flex justify-between items-center'>
                <div className='flex-1 min-w-0 mr-2'>
                    <h3 className='text-white font-medium text-sm truncate group-hover:text-blue-400 transition-colors'>
                        {title}
                    </h3>
                    <p className='text-gray-400 text-xs'>
                        {price}
                    </p>
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
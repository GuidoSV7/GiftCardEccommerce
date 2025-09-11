import type { Product } from '../../services/productService';
import { useImageDimensions } from '../../hooks/useImageDimensions';

interface ProductBannerProps {
    product: Product;
}

export const ProductBanner = ({ product }: ProductBannerProps) => {
    const { isHorizontal, isVertical } = useImageDimensions(product.imageUrl);
    return (
        <div className="relative">
            {/* Floating shadow for main banner */}
            <div 
                className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 rounded-lg blur-2xl opacity-30 -z-10"
                style={{
                    transform: 'translateY(10px) scale(1.02)'
                }}
            ></div>
            
            <div 
                className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 rounded-lg"
                style={{
                    boxShadow: `
                        0 30px 60px -12px rgba(0, 0, 0, 0.4),
                        0 0 0 1px rgba(255, 255, 255, 0.1),
                        0 0 40px rgba(59, 130, 246, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2)
                    `,
                    filter: 'drop-shadow(0 15px 35px rgba(0, 0, 0, 0.3))',
                    transform: 'translateY(-5px)',
                    transformStyle: 'preserve-3d',
                    paddingTop: '1.5rem',
                    paddingBottom: '0.25rem',
                    marginBottom: '0rem',
                    height: 'auto',
                    minHeight: '160px'
                }}
            >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 10px,
                        rgba(255,255,255,0.1) 10px,
                        rgba(255,255,255,0.1) 20px
                    )`
                }}></div>
            </div>

            {/* Product Image as Background - Half Effect */}
            <div className="absolute inset-0 opacity-15">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${product.imageUrl})`,
                        backgroundPosition: 'right center',
                        backgroundSize: isHorizontal 
                            ? '40% auto'  // Horizontal: más pequeño para no dominar
                            : isVertical 
                                ? '35% auto'  // Vertical: aún más pequeño
                                : '45% auto', // Default: tamaño medio
                        backgroundRepeat: 'no-repeat'
                    }}
                ></div>
                {/* Gradient overlay to blend with background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-transparent"></div>
            </div>
            
            <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
                <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center" style={{ paddingBottom: '5.5rem', paddingTop: '0.5rem' }}>
                    {/* Product Card Image */}
                    <div className="flex-shrink-0" style={{ marginBottom: '-3rem', marginTop: '1rem' }}>
                        <div className="relative">
                            {/* Floating shadow effect */}
                            <div 
                                className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-lg blur-lg opacity-30 -z-10"
                                style={{
                                    transform: 'translateY(8px) scale(1.02)'
                                }}
                            ></div>
                            {/* Card with hole at top - Dynamic sizing based on image orientation */}
                            <div className={`bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-lg relative overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                                isHorizontal 
                                    ? 'w-64 h-40 md:w-72 md:h-44' // Horizontal: más ancho
                                    : isVertical 
                                        ? 'w-40 h-56 md:w-44 md:h-64' // Vertical: más alto
                                        : 'w-48 h-48 md:w-56 md:h-56' // Square: cuadrado
                            }`}
                            style={{
                                boxShadow: `
                                    0 25px 50px -12px rgba(0, 0, 0, 0.4),
                                    0 0 0 1px rgba(255, 255, 255, 0.1),
                                    0 0 20px rgba(59, 130, 246, 0.3),
                                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                                `,
                                filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3))'
                            }}>
                                {/* Card hole */}
                                <div 
                                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gray-800 rounded-full"
                                    style={{
                                        boxShadow: `
                                            inset 0 2px 4px rgba(0, 0, 0, 0.3),
                                            0 2px 8px rgba(0, 0, 0, 0.2)
                                        `
                                    }}
                                ></div>
                                
                                {/* Product image */}
                                <div className="w-full h-full flex items-center justify-center p-4">
                                    <img 
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className={`object-contain ${
                                            isHorizontal 
                                                ? 'max-w-full max-h-full' // Horizontal: ajustar al contenedor
                                                : isVertical 
                                                    ? 'max-w-full max-h-full' // Vertical: ajustar al contenedor
                                                    : 'w-full h-full' // Square: llenar contenedor
                                        }`}
                                    />
                                </div>
                                
                                {/* Card gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
                                
                                {/* Glow effect */}
                                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-400/20 via-transparent to-purple-400/20 pointer-events-none"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Product Information */}
                    <div className="flex-1 space-y-4" style={{ marginTop: '1.5rem' }}>
                        <div className="space-y-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                                {product.title}
                            </h1>
                            
                            {/* Category with flag icon */}
                            <div className="flex items-center space-x-2 text-white">
                                <span className="text-lg">🌍</span>
                                <span className="text-sm font-medium">{product.category?.name || 'Sin categoría'}</span>
                            </div>
                            
                            {/* Important note */}
                            <div className="flex items-start space-x-2 text-white">
                                <span className="text-lg mt-0.5">💡</span>
                                <p className="text-sm leading-relaxed">
                                    Información importante: Este producto está disponible para usuarios registrados en {product.category?.name || 'la plataforma'}.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

import type { Product } from '../../services/productService';

interface ProductBannerProps {
    product: Product;
}

export const ProductBanner = ({ product }: ProductBannerProps) => {
    return (
        <div className="relative">

            
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
                        backgroundImage: `url(${product.rectangularImageUrl || product.squareImageUrl || product.smallSquareImageUrl || ''})`,
                        backgroundPosition: 'right center',
                        backgroundSize: '45% auto',
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
                            <img 
                                src={product.squareImageUrl || 'https://via.placeholder.com/200x200?text=No+Image'}
                                alt={product.title}
                                className="w-40 h-40 md:w-48 md:h-48 object-contain rounded-lg"
                            />
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

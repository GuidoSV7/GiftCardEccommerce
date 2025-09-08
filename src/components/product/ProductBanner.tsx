import type { Product } from '../../services/productService';

interface ProductBannerProps {
    product: Product;
}

export const ProductBanner = ({ product }: ProductBannerProps) => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 py-12 mb-8">
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
            
            <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
                <div className="relative flex flex-col md:flex-row gap-8 items-center">
                    {/* Product Card Image */}
                    <div className="flex-shrink-0">
                        <div className="relative">
                            {/* Card with hole at top */}
                            <div className="w-48 h-32 md:w-56 md:h-36 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-lg shadow-2xl relative overflow-hidden">
                                {/* Card hole */}
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gray-800 rounded-full"></div>
                                
                                {/* Product image */}
                                <div className="w-full h-full flex items-center justify-center p-4">
                                    <img 
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                
                                {/* Card gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Product Information */}
                    <div className="flex-1 space-y-4">
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
    );
};

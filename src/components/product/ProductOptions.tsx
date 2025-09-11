import type { Product } from '../../services/productService';

interface ProductOptionsProps {
    product: Product;
}

export const ProductOptions = ({ product }: ProductOptionsProps) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Opciones de compra</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Option 1 */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-8 rounded overflow-hidden">
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="text-white font-medium text-sm">Opción 1 - {product.title}</h4>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-white font-semibold text-sm">Precio no disponible</p>
                            <p className="text-gray-400 text-xs">Por definir</p>
                        </div>
                    </div>
                </div>

                {/* Option 2 */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-8 rounded overflow-hidden">
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="text-white font-medium text-sm">Opción 2 - {product.title}</h4>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-white font-semibold text-sm">Precio no disponible</p>
                            <p className="text-gray-400 text-xs">Por definir</p>
                        </div>
                    </div>
                </div>

                {/* Option 3 - Selected */}
                <div className="bg-gray-800/50 border-2 border-blue-500 rounded-lg p-4">
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-8 rounded overflow-hidden">
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="text-white font-medium text-sm">Opción 3 - {product.title}</h4>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-white font-semibold text-sm">Precio no disponible</p>
                            <p className="text-gray-400 text-xs">Por definir</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

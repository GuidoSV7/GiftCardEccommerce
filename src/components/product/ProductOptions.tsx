import { Product } from '../../services/productService';

interface ProductOptionsProps {
    product: Product;
}

export const ProductOptions = ({ product }: ProductOptionsProps) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Opciones de compra</h3>
            <div className="space-y-3">
                {/* Option 1 */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">LOGO</span>
                            </div>
                            <div>
                                <h4 className="text-white font-medium">Opción 1 - {product.title}</h4>
                                <p className="text-gray-400 text-sm">Descripción de la opción</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white font-semibold">Precio no disponible</p>
                            <p className="text-gray-400 text-sm">Por definir</p>
                        </div>
                    </div>
                </div>

                {/* Option 2 */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">LOGO</span>
                            </div>
                            <div>
                                <h4 className="text-white font-medium">Opción 2 - {product.title}</h4>
                                <p className="text-gray-400 text-sm">Descripción de la opción</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white font-semibold">Precio no disponible</p>
                            <p className="text-gray-400 text-sm">Por definir</p>
                        </div>
                    </div>
                </div>

                {/* Option 3 - Selected */}
                <div className="bg-gray-800/50 border-2 border-blue-500 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">LOGO</span>
                            </div>
                            <div>
                                <h4 className="text-white font-medium">Opción 3 - {product.title}</h4>
                                <p className="text-gray-400 text-sm">Descripción de la opción</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white font-semibold">Precio no disponible</p>
                            <p className="text-gray-400 text-sm">Por definir</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

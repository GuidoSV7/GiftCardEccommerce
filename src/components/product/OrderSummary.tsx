import type { Product } from '../../services/productService';

interface OrderSummaryProps {
    product: Product;
    quantity: number;
    onQuantityChange: (quantity: number) => void;
}

export const OrderSummary = ({ product, quantity, onQuantityChange }: OrderSummaryProps) => {
    return (
        <div className="bg-gray-800/50 rounded-lg p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-4">Resumen del pedido</h3>
            
            {/* Quantity */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Cantidad</label>
                <div className="flex items-center space-x-3">
                    <button 
                        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center justify-center transition-colors"
                    >
                        -
                    </button>
                    <span className="text-white font-medium min-w-[2rem] text-center">{quantity}</span>
                    <button 
                        onClick={() => onQuantityChange(quantity + 1)}
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center justify-center transition-colors"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Total */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Total</span>
                    <span className="text-white font-semibold text-lg">Precio no disponible</span>
                </div>
                <p className="text-gray-400 text-sm">Créditos: Por definir</p>
            </div>

            {/* Stars/Rewards */}
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-gray-300">STARS</span>
                    <span className="text-white">0 (estimado)</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <button 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    disabled={!product.state}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    <span>Agregar al carrito</span>
                </button>
                
                <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    disabled={!product.state}
                >
                    COMPRA AHORA
                </button>
            </div>
        </div>
    );
};

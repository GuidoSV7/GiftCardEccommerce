import { useState } from 'react';
import type { Product } from '../../services/productService';
import type { ProductPrice } from '../../services/productPricingService';

interface OrderSummaryProps {
    product: Product;
    quantity: number;
    selectedPrice: ProductPrice | null;
    onQuantityChange: (quantity: number) => void;
}

export const OrderSummary = ({ product, quantity, selectedPrice, onQuantityChange }: OrderSummaryProps) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
    // Función para calcular precio final
    const calculateFinalPrice = (price: ProductPrice): number => {
        if (price.discountPercentage && price.discountPercentage > 0) {
            return Number(price.value) * (1 - Number(price.discountPercentage) / 100);
        }
        return Number(price.value);
    };

    // Calcular total
    const unitPrice = selectedPrice ? calculateFinalPrice(selectedPrice) : 0;
    const total = unitPrice * quantity;
    const hasDiscount = selectedPrice?.discountPercentage && selectedPrice.discountPercentage > 0;

    return (
        <div className="bg-gray-800/50 rounded-lg p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-4">Resumen del pedido</h3>
            
            {/* Selected Option */}
            {selectedPrice && (
                <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-white font-medium text-sm">{selectedPrice.name}</h4>
                            {hasDiscount && (
                                <span className="text-red-400 text-xs font-medium">
                                    -{Number(selectedPrice.discountPercentage)}% descuento
                                </span>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="text-white font-bold text-sm">
                                ${unitPrice.toFixed(2)}
                            </div>
                            {hasDiscount && (
                                <div className="text-gray-400 text-xs line-through">
                                    ${Number(selectedPrice.value).toFixed(2)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
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
                    <span className="text-white font-semibold text-lg">
                        {selectedPrice ? `$${total.toFixed(2)}` : 'Selecciona una opción'}
                    </span>
                </div>
                {selectedPrice && (
                    <div className="text-gray-400 text-sm">
                        <div>Precio unitario: ${unitPrice.toFixed(2)}</div>
                        <div>Cantidad: {quantity}</div>
                    </div>
                )}
            </div>

            {/* Payment Methods */}
            {selectedPrice && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-3">Método de pago</label>
                    <div className="space-y-2">
                        {/* Credit/Debit Card */}
                        <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedPaymentMethod === 'card' 
                                ? 'border-blue-500 bg-blue-500/10' 
                                : 'border-gray-600 hover:border-gray-500'
                        }`}>
                            <input
                                type="radio"
                                name="payment-method"
                                value="card"
                                checked={selectedPaymentMethod === 'card'}
                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-3 ${
                                selectedPaymentMethod === 'card' 
                                    ? 'border-blue-500 bg-blue-500' 
                                    : 'border-gray-400'
                            }`}>
                                {selectedPaymentMethod === 'card' && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </div>
                            <div className="flex items-center space-x-3 flex-1">
                                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                <div>
                                    <div className="text-white font-medium text-sm">Tarjeta de crédito/débito</div>
                                    <div className="text-gray-400 text-xs">Visa, Mastercard, American Express</div>
                                </div>
                            </div>
                            <div className="flex space-x-1">
                                <div className="w-6 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">V</div>
                                <div className="w-6 h-4 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">M</div>
                                <div className="w-6 h-4 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">A</div>
                            </div>
                        </label>

                        {/* PayPal */}
                        <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedPaymentMethod === 'paypal' 
                                ? 'border-blue-500 bg-blue-500/10' 
                                : 'border-gray-600 hover:border-gray-500'
                        }`}>
                            <input
                                type="radio"
                                name="payment-method"
                                value="paypal"
                                checked={selectedPaymentMethod === 'paypal'}
                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-3 ${
                                selectedPaymentMethod === 'paypal' 
                                    ? 'border-blue-500 bg-blue-500' 
                                    : 'border-gray-400'
                            }`}>
                                {selectedPaymentMethod === 'paypal' && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </div>
                            <div className="flex items-center space-x-3 flex-1">
                                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">PP</span>
                                </div>
                                <div>
                                    <div className="text-white font-medium text-sm">PayPal</div>
                                    <div className="text-gray-400 text-xs">Paga con tu cuenta PayPal</div>
                                </div>
                            </div>
                        </label>

                        {/* Bank Transfer */}
                        <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedPaymentMethod === 'bank' 
                                ? 'border-blue-500 bg-blue-500/10' 
                                : 'border-gray-600 hover:border-gray-500'
                        }`}>
                            <input
                                type="radio"
                                name="payment-method"
                                value="bank"
                                checked={selectedPaymentMethod === 'bank'}
                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-3 ${
                                selectedPaymentMethod === 'bank' 
                                    ? 'border-blue-500 bg-blue-500' 
                                    : 'border-gray-400'
                            }`}>
                                {selectedPaymentMethod === 'bank' && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </div>
                            <div className="flex items-center space-x-3 flex-1">
                                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <div>
                                    <div className="text-white font-medium text-sm">Transferencia bancaria</div>
                                    <div className="text-gray-400 text-xs">Pago directo desde tu banco</div>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>
            )}

            {/* Action Button */}
            <div>
                <button 
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        !product.state || !selectedPrice 
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    disabled={!product.state || !selectedPrice}
                >
                    {!selectedPrice ? 'Selecciona una opción' : 'COMPRA AHORA'}
                </button>
            </div>
        </div>
    );
};

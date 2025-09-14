import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Product } from '../../services/productService';
import { productPricingService, type ProductPrice } from '../../services/productPricingService';

interface ProductOptionsProps {
    product: Product;
    onPriceSelected?: (price: ProductPrice | null) => void;
}

export const ProductOptions = ({ product, onPriceSelected }: ProductOptionsProps) => {
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

    // Obtener precios del producto
    const { data: prices, isLoading, error } = useQuery({
        queryKey: ['product-prices', product.id],
        queryFn: () => productPricingService.findByProduct(product.id),
        retry: 1,
        refetchOnWindowFocus: false
    });

    // Seleccionar el primer precio activo por defecto
    useEffect(() => {
        if (prices && prices.length > 0 && !selectedPrice) {
            const activePrice = prices.find(price => price.state);
            if (activePrice) {
                setSelectedPrice(activePrice.id);
            }
        }
    }, [prices, selectedPrice]);

    // Notificar al padre cuando cambie la selección
    useEffect(() => {
        if (prices && selectedPrice && onPriceSelected) {
            const selectedPriceData = prices.find(price => price.id === selectedPrice);
            onPriceSelected(selectedPriceData || null);
        }
    }, [selectedPrice, prices, onPriceSelected]);

    // Función para calcular precio final
    const calculateFinalPrice = (price: ProductPrice): number => {
        if (price.discountPercentage && price.discountPercentage > 0) {
            return Number(price.value) * (1 - Number(price.discountPercentage) / 100);
        }
        return Number(price.value);
    };


    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Opciones de compra</h3>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-600/30 rounded-xl p-4 animate-pulse flex items-center min-h-[60px]">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-3">
                                    <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
                                    <div className="h-4 bg-gray-700 rounded w-20"></div>
                                </div>
                                <div className="h-4 bg-gray-700 rounded w-16"></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center py-4">
                    <div className="inline-flex items-center space-x-2 text-blue-400">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                        <span className="text-sm font-medium">Cargando precios...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !prices || prices.length === 0) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Opciones de compra</h3>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-600/30 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h4 className="text-white font-semibold text-lg mb-2">No hay precios disponibles</h4>
                    <p className="text-gray-400 text-sm mb-4">Este producto no tiene opciones de compra configuradas</p>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3">
                        <p className="text-yellow-400 text-xs font-medium">
                            💡 Contacta al administrador para más información
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Filtrar solo precios activos
    const activePrices = prices.filter(price => price.state);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Opciones de compra</h3>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {activePrices.map((price) => {
                    const hasDiscount = price.discountPercentage && price.discountPercentage > 0;
                    const finalPrice = calculateFinalPrice(price);
                    
                    return (
                        <label 
                            key={price.id}
                            className={`relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-blue-400/50 flex items-center min-h-[60px] ${
                                selectedPrice === price.id 
                                    ? 'border-2 border-blue-500 bg-gradient-to-br from-blue-900/30 to-purple-900/30' 
                                    : 'border border-gray-600/50'
                            } ${hasDiscount ? 'ring-1 ring-red-500/30' : ''}`}
                        >
                            <input
                                type="radio"
                                name="price-option"
                                value={price.id}
                                checked={selectedPrice === price.id}
                                onChange={(e) => setSelectedPrice(e.target.value)}
                                className="sr-only"
                            />
                            
                            <div className="flex items-center h-full">
                                <div className="flex items-center space-x-3 flex-1">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                        selectedPrice === price.id 
                                            ? 'border-blue-500 bg-blue-500' 
                                            : 'border-gray-400 bg-transparent'
                                    }`}>
                                        {selectedPrice === price.id && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <h4 className="text-white font-semibold text-sm">
                                            {price.name}
                                        </h4>
                                        {hasDiscount && (
                                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                                -{Number(price.discountPercentage)}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="text-right ml-4">
                                    <div className="text-white font-bold text-base">
                                        ${finalPrice.toFixed(2)}
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        {hasDiscount ? (
                                            <span className="line-through">
                                                ${Number(price.value).toFixed(2)}
                                            </span>
                                        ) : (
                                            <span>Precio final</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../services/productService';
import type { ProductPrice } from '../services/productPricingService';
import HomeHeader from '../components/home/HomeHeader';
import { HomeFooter } from '../components/home/HomeFooter';
import { ProductBanner, ProductOptions, ExpandableSection, OrderSummary, SimilarProducts } from '../components/product';

export const ProductDetailView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [selectedPrice, setSelectedPrice] = useState<ProductPrice | null>(null);
    const [expandedSections, setExpandedSections] = useState({
        description: false,
        redeem: false,
        terms: false
    });

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getProductById(id!),
        enabled: !!id,
        retry: 2,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handlePriceSelected = (price: ProductPrice | null) => {
        setSelectedPrice(price);
    };

    // Validar que el producto esté activo
    useEffect(() => {
        if (product && !product.state) {
            // Producto inactivo - redirigir al inicio con mensaje
            navigate('/', { 
                state: { 
                    message: 'El producto que intentas ver no está disponible' 
                } 
            });
        }
    }, [product, navigate]);

    if (isLoading) {
        return (
            <div style={{fontFamily: 'Manrope, Arial, system-ui, sans-serif'}} className="min-h-screen bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900">
                <HomeHeader />
                <div className="w-full pt-20 md:pt-24">
                    <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-12">
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        </div>
                    </div>
                </div>
                <HomeFooter />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div style={{fontFamily: 'Manrope, Arial, system-ui, sans-serif'}   } className="min-h-screen bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900">
                <HomeHeader />
                <div className="w-full pt-20 md:pt-24">
                    <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-12">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Producto no encontrado</h3>
                            <p className="text-gray-400 mb-4">El producto que buscas no existe o ha sido eliminado</p>
                            <button 
                                onClick={() => navigate('/')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                Volver al inicio
                            </button>
                        </div>
                    </div>
                </div>
                <HomeFooter />
            </div>
        );
    }

    return (
        <div style={{fontFamily: 'Manrope, Arial, system-ui, sans-serif'}} className="min-h-screen bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900">
            <HomeHeader />
            
            {/* Product Detail Section */}
            <div className="w-full pt-20 md:pt-16">
                <ProductBanner product={product} />

                <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-8">
                    {/* Main Product Layout - 2 Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Left Section - Product Options and Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <ProductOptions product={product} onPriceSelected={handlePriceSelected} />

                            {/* Expandable Sections */}
                            <div className="space-y-4">
                                {product.description && (
                                    <ExpandableSection
                                        title="Descripción"
                                        content={product.description}
                                        isExpanded={expandedSections.description}
                                        onToggle={() => toggleSection('description')}
                                    />
                                )}

                                {product.redeem && (
                                    <ExpandableSection
                                        title="Cómo canjear"
                                        content={product.redeem}
                                        isExpanded={expandedSections.redeem}
                                        onToggle={() => toggleSection('redeem')}
                                    />
                                )}

                                {product.termsConditions && (
                                    <ExpandableSection
                                        title="Términos y condiciones"
                                        content={product.termsConditions}
                                        isExpanded={expandedSections.terms}
                                        onToggle={() => toggleSection('terms')}
                                        isSmallText={true}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Right Section - Order Summary */}
                        <div className="lg:col-span-1">
                            <OrderSummary 
                                product={product}
                                quantity={quantity}
                                selectedPrice={selectedPrice}
                                onQuantityChange={setQuantity}
                            />
                        </div>
                    </div>

                    {/* Similar Products Section */}
                    <div className="mt-12">
                        
                        <SimilarProducts product={product} />
                    </div>
                </div>
            </div>

            <HomeFooter />
        </div>
    );
};

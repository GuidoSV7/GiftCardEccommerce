
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getProductByCategoryId, getProducts, type Product } from '../services/productService';
import HomeHeader from '../components/home/HomeHeader';
import { HomeFooter } from '../components/home/HomeFooter';

export const CategoryProductsView: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();

    // Queries para obtener categorías, todos los productos y productos de la categoría específica
    const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });

    const { data: allProducts = [], isLoading: allProductsLoading } = useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
        retry: 2,
        staleTime: 30 * 1000,
    });

    const { data: categoryProducts = [], isLoading: productsLoading, error: productsError } = useQuery({
        queryKey: ['products', 'category', categoryId],
        queryFn: () => getProductByCategoryId(categoryId || ''),
        retry: 2,
        staleTime: 30 * 1000,
        enabled: !!categoryId, // Solo ejecutar si hay categoryId
    });

    // Función para obtener el conteo de productos por categoría
    const getProductCountByCategory = (categoryId: string) => {
        return allProducts.filter((product: Product) => 
            product && product.category && product.category.id === categoryId
        ).length;
    };

    // Encontrar la categoría actual
    const currentCategory = categories.find(cat => cat.id === categoryId);

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleCategoryClick = (newCategoryId: string) => {
        navigate(`/category/${newCategoryId}`);
    };

    if (categoriesLoading || productsLoading || allProductsLoading) {
        return (
            <div style={{fontFamily: 'Manrope, Arial, system-ui, sans-serif'}} className="min-h-screen bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900">
                <HomeHeader />
                <div className="pt-20 md:pt-24">
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

    if (categoriesError || productsError || !currentCategory) {
        return (
            <div style={{fontFamily: 'Manrope, Arial, system-ui, sans-serif'}} className="min-h-screen bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900">
                <HomeHeader />
                <div className="pt-20 md:pt-24">
                    <div className="container mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-12">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Categoría no encontrada</h3>
                            <p className="text-gray-400 mb-6">La categoría que buscas no existe o ha sido eliminada</p>
                            <button 
                                onClick={handleBackToHome}
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
            
            <div className="pt-20 md:pt-24">
                <div className="flex flex-col lg:flex-row min-h-screen">
                    {/* Sidebar con categorías */}
                    <div className="w-full lg:w-72 bg-gray-800/50 backdrop-blur-sm border-b lg:border-b-0 lg:border-r border-gray-700 lg:min-h-screen lg:rounded-2xl lg:ml-31 lg:mr-6 lg:mb-6">
                        <div className="p-4 lg:pl-6 lg:pr-8 lg:py-8">
                            <div className="mb-6">
                                <button 
                                    onClick={handleBackToHome}
                                    className="flex items-center text-gray-300 hover:text-white transition-colors mb-4"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Volver al inicio
                                </button>
                            </div>
                            
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                {categories.map((category) => {
                                    const productCount = getProductCountByCategory(category.id);
                                    const isActive = category.id === categoryId;
                                    
                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() => handleCategoryClick(category.id)}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                                                isActive 
                                                    ? 'bg-gray-600 text-white shadow-lg' 
                                                    : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/70 hover:text-white hover:shadow-md'
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                <span className="font-medium text-left text-sm">{category.name}</span>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 font-medium ${
                                                isActive 
                                                    ? 'bg-gray-500 text-white' 
                                                    : 'bg-gray-600/70 text-gray-300'
                                            }`}>
                                                {productCount}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Contenido principal */}
                    <div className="flex-1 p-6 lg:p-8 lg:pl-4">

                        {/* Grid de productos */}
                        {categoryProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {categoryProducts.map((product: Product) => (
                                    <div
                                        key={product.id}
                                        className="group relative bg-gradient-to-br from-slate-800/80 via-blue-900/60 to-slate-900/80 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-blue-800/30 hover:border-blue-600/50 hover:scale-105"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                        style={{
                                            boxShadow: `
                                                0 10px 25px -5px rgba(0, 0, 0, 0.4),
                                                0 0 0 1px rgba(59, 130, 246, 0.2),
                                                inset 0 1px 0 rgba(255, 255, 255, 0.1)
                                            `
                                        }}
                                    >
                                        {/* Background Image Effect */}
                                        <div 
                                            className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                                            style={{
                                                backgroundImage: `url(${product.imageUrl})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat'
                                            }}
                                        ></div>
                                        
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-blue-900/20 to-slate-800/30"></div>
                                        
                                        {/* Content */}
                                        <div className="relative z-10 p-5">
                                            <div className="flex items-center space-x-4">
                                                {/* Product Image */}
                                                <div className="relative">
                                                    <div 
                                                        className="w-24 h-24 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm border border-blue-500/20 flex items-center justify-center p-2 group-hover:bg-white/15 transition-colors duration-300"
                                                        style={{
                                                            boxShadow: `
                                                                0 4px 15px rgba(0, 0, 0, 0.3),
                                                                0 0 0 1px rgba(59, 130, 246, 0.3),
                                                                inset 0 1px 0 rgba(255, 255, 255, 0.1)
                                                            `
                                                        }}
                                                    >
                                                        <img
                                                            src={product.imageUrl}
                                                            alt={product.title}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    
                                                    {/* Floating glow effect */}
                                                    <div 
                                                        className="absolute inset-0 rounded-lg blur-md opacity-20 -z-10 group-hover:opacity-40 transition-opacity duration-300"
                                                        style={{
                                                            background: `linear-gradient(45deg, rgba(59, 130, 246, 0.4), rgba(30, 64, 175, 0.4))`
                                                        }}
                                                    ></div>
                                                </div>
                                                
                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-white text-base mb-2 group-hover:text-blue-200 transition-colors duration-300 line-clamp-2">
                                                        {product.title}
                                                    </h3>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                        <p className="text-gray-300 text-sm font-medium">
                                                            {product.category.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Hover Effect Indicator */}
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="w-7 h-7 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Bottom gradient accent */}
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="relative">
                                    <div 
                                        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-800/80 via-blue-900/60 to-slate-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-800/30"
                                        style={{
                                            boxShadow: `
                                                0 10px 25px -5px rgba(0, 0, 0, 0.4),
                                                0 0 0 1px rgba(59, 130, 246, 0.2),
                                                inset 0 1px 0 rgba(255, 255, 255, 0.1)
                                            `
                                        }}
                                    >
                                        <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    
                                    {/* Glow effect */}
                                    <div 
                                        className="absolute inset-0 rounded-xl blur-lg opacity-20 -z-10"
                                        style={{
                                            background: `linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(30, 64, 175, 0.3))`
                                        }}
                                    ></div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-white mb-3">No hay productos en esta categoría</h3>
                                <p className="text-gray-300 mb-8 max-w-md mx-auto">Vuelve pronto para descubrir nuevos productos increíbles en esta categoría</p>
                                
                                <button 
                                    onClick={handleBackToHome}
                                    className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                                    style={{
                                        boxShadow: `
                                            0 8px 20px rgba(59, 130, 246, 0.3),
                                            0 0 0 1px rgba(59, 130, 246, 0.2)
                                        `
                                    }}
                                >
                                    <span className="relative z-10 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Volver al inicio
                                    </span>
                                    
                                    {/* Button glow effect */}
                                    <div 
                                        className="absolute inset-0 rounded-lg blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"
                                        style={{
                                            background: `linear-gradient(45deg, rgba(59, 130, 246, 0.4), rgba(30, 64, 175, 0.4))`
                                        }}
                                    ></div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <HomeFooter />
        </div>
    );
};


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getProductByCategoryId, getProducts, type Product } from '../services/productService';
import HomeHeader from '../components/home/HomeHeader';
import { HomeFooter } from '../components/home/HomeFooter';

// Hook para extraer colores dominantes de una imagen
const useImageColors = (imageUrl: string) => {
    const [colors, setColors] = useState<{ primary: string; secondary: string } | null>(null);

    useEffect(() => {
        if (!imageUrl) return;

        const extractColors = async () => {
            try {
                console.log('🎨 Extracting colors from:', imageUrl);
                
                const img = new Image();
                
                // Para Cloudinary, configurar CORS desde el inicio
                const loadImage = () => new Promise<HTMLImageElement>((resolve, reject) => {
                    img.onload = () => {
                        console.log('✅ Image loaded successfully:', imageUrl);
                        resolve(img);
                    };
                    img.onerror = (error) => {
                        console.log('❌ Image failed to load:', imageUrl, error);
                        reject(error);
                    };
                    
                    // Para Cloudinary, usar crossOrigin desde el principio
                    img.crossOrigin = 'anonymous';
                    img.src = imageUrl;
                });

                const loadedImg = await loadImage();
                
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('Canvas context not available');

                // Tamaño óptimo para análisis
                const size = 64;
                canvas.width = size;
                canvas.height = size;
                ctx.drawImage(loadedImg, 0, 0, size, size);

                const imageData = ctx.getImageData(0, 0, size, size);
                const data = imageData.data;

                // Algoritmo mejorado de clustering de colores
                const pixels: number[][] = [];

                // Recopilar todos los píxeles válidos
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const a = data[i + 3];

                    // Filtrar píxeles transparentes, muy claros, muy oscuros y grises
                    const brightness = (r + g + b) / 3;
                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    const saturation = max === 0 ? 0 : (max - min) / max;
                    
                    if (a > 128 && 
                        brightness > 30 && brightness < 240 && // No muy oscuro ni muy claro
                        saturation > 0.1) { // Mínima saturación
                        pixels.push([r, g, b]);
                    }
                }

                if (pixels.length === 0) {
                    console.log('⚠️ No valid pixels found, trying with relaxed filters...');
                    // Segundo intento con filtros más relajados
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        const a = data[i + 3];

                        const brightness = (r + g + b) / 3;
                        if (a > 128 && brightness > 20 && brightness < 250) {
                            pixels.push([r, g, b]);
                        }
                    }
                }
                
                if (pixels.length === 0) throw new Error('No valid pixels found');

                // Algoritmo K-means simplificado para encontrar colores dominantes
                const findDominantColors = (pixels: number[][], k: number = 5) => {
                    // Inicializar centroides aleatoriamente
                    const centroids: number[][] = [];
                    for (let i = 0; i < k; i++) {
                        const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
                        centroids.push([...randomPixel]);
                    }

                    // Iterar para encontrar mejores centroides
                    for (let iteration = 0; iteration < 10; iteration++) {
                        const clusters: number[][][] = Array(k).fill(null).map(() => []);
                        
                        // Asignar cada píxel al centroide más cercano
                        pixels.forEach(pixel => {
                            let minDistance = Infinity;
                            let closestCentroid = 0;
                            
                            centroids.forEach((centroid, index) => {
                                const distance = Math.sqrt(
                                    Math.pow(pixel[0] - centroid[0], 2) +
                                    Math.pow(pixel[1] - centroid[1], 2) +
                                    Math.pow(pixel[2] - centroid[2], 2)
                                );
                                
                                if (distance < minDistance) {
                                    minDistance = distance;
                                    closestCentroid = index;
                                }
                            });
                            
                            clusters[closestCentroid].push(pixel);
                        });

                        // Actualizar centroides
                        clusters.forEach((cluster, index) => {
                            if (cluster.length > 0) {
                                centroids[index] = [
                                    Math.round(cluster.reduce((sum, p) => sum + p[0], 0) / cluster.length),
                                    Math.round(cluster.reduce((sum, p) => sum + p[1], 0) / cluster.length),
                                    Math.round(cluster.reduce((sum, p) => sum + p[2], 0) / cluster.length)
                                ];
                            }
                        });
                    }

                    // Ordenar por tamaño de cluster y saturación
                    const clustersWithInfo = centroids.map((centroid) => {
                        const clusterSize = pixels.filter(pixel => {
                            const distance = Math.sqrt(
                                Math.pow(pixel[0] - centroid[0], 2) +
                                Math.pow(pixel[1] - centroid[1], 2) +
                                Math.pow(pixel[2] - centroid[2], 2)
                            );
                            return distance < 50; // Threshold para pertenecer al cluster
                        }).length;

                        const [r, g, b] = centroid;
                        const max = Math.max(r, g, b);
                        const min = Math.min(r, g, b);
                        const saturation = max === 0 ? 0 : (max - min) / max;
                        const brightness = (r + g + b) / 3;

                        return {
                            color: centroid,
                            size: clusterSize,
                            saturation,
                            brightness,
                            score: clusterSize * (1 + saturation * 2) * (brightness > 80 && brightness < 200 ? 1.5 : brightness > 50 ? 1 : 0.3)
                        };
                    });

                    return clustersWithInfo
                        .filter(c => c.size > 0)
                        .sort((a, b) => b.score - a.score);
                };

                const dominantColors = findDominantColors(pixels);
                
                if (dominantColors.length > 0) {
                    const primaryColor = dominantColors[0].color;
                    const secondaryColor = dominantColors.length > 1 
                        ? dominantColors[1].color 
                        : primaryColor.map(c => Math.max(0, c - 40));

                    // Aplicar boost de saturación y brillo
                    const enhanceColor = (color: number[]) => {
                        const [r, g, b] = color;
                        const max = Math.max(r, g, b);
                        const min = Math.min(r, g, b);
                        const saturation = max === 0 ? 0 : (max - min) / max;
                        const brightness = (r + g + b) / 3;
                        
                        // Si el color es muy oscuro o desaturado, aplicar boost más agresivo
                        let boostFactor = 1.2;
                        if (brightness < 60) boostFactor = 2.0;
                        else if (brightness < 100) boostFactor = 1.6;
                        else if (saturation < 0.3) boostFactor = 1.8;
                        else if (saturation < 0.5) boostFactor = 1.4;
                        
                        // Asegurar que el color tenga al menos cierto brillo mínimo
                        const minBrightness = 80;
                        const enhancedR = Math.min(255, Math.max(minBrightness, Math.round(r * boostFactor)));
                        const enhancedG = Math.min(255, Math.max(minBrightness, Math.round(g * boostFactor)));
                        const enhancedB = Math.min(255, Math.max(minBrightness, Math.round(b * boostFactor)));
                        
                        return [enhancedR, enhancedG, enhancedB];
                    };

                    const enhancedPrimary = enhanceColor(primaryColor);
                    const enhancedSecondary = enhanceColor(secondaryColor);

                    const primary = `rgb(${enhancedPrimary[0]}, ${enhancedPrimary[1]}, ${enhancedPrimary[2]})`;
                    const secondary = `rgb(${enhancedSecondary[0]}, ${enhancedSecondary[1]}, ${enhancedSecondary[2]})`;

                    console.log('🎨 Colors extracted successfully:', { primary, secondary, from: imageUrl });
                    setColors({ primary, secondary });
                } else {
                    throw new Error('No dominant colors found');
                }

            } catch (error) {
                console.log('❌ Color extraction failed for:', imageUrl, error);
                
                // Fallback basado en hash del URL para consistencia
                const hash = imageUrl.split('').reduce((a, b) => {
                    a = ((a << 5) - a) + b.charCodeAt(0);
                    return a & a;
                }, 0);
                
                const fallbackColors = [
                    { primary: 'rgb(255, 193, 7)', secondary: 'rgb(255, 152, 0)' },    // Amarillo/Naranja
                    { primary: 'rgb(0, 123, 255)', secondary: 'rgb(0, 86, 179)' },     // Azul Steam
                    { primary: 'rgb(255, 87, 34)', secondary: 'rgb(216, 67, 21)' },    // Naranja Free Fire
                    { primary: 'rgb(76, 175, 80)', secondary: 'rgb(56, 142, 60)' },    // Verde
                    { primary: 'rgb(156, 39, 176)', secondary: 'rgb(123, 31, 162)' },  // Púrpura
                    { primary: 'rgb(244, 67, 54)', secondary: 'rgb(198, 40, 40)' },    // Rojo
                ];
                
                const colorIndex = Math.abs(hash) % fallbackColors.length;
                const selectedFallback = fallbackColors[colorIndex];
                console.log('🔄 Using fallback colors:', selectedFallback, 'for:', imageUrl);
                setColors(selectedFallback);
            }
        };

        extractColors();
    }, [imageUrl]);

    return colors;
};

// Componente para cada tarjeta de producto con color sólido dinámico
const ProductCard: React.FC<{ product: Product; onClick: () => void }> = ({ product, onClick }) => {
    const colors = useImageColors(product.squareImageUrl || '');
    
    // Debug: mostrar los colores que se están usando
    console.log('🎯 ProductCard rendering with colors:', colors, 'for product:', product.title);

    return (
        <div
            className="group relative rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer h-32 shadow-xl hover:shadow-2xl"
            onClick={onClick}
             style={{
                 backgroundColor: colors?.primary || 'rgb(99, 102, 241)',
                 backgroundImage: colors 
                     ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                     : 'linear-gradient(135deg, rgb(99, 102, 241), rgb(67, 56, 202))',
                 border: colors 
                     ? `1px solid ${colors.primary}`
                     : '1px solid rgb(99, 102, 241)'
             }}
        >
            <div className="flex h-full">
                {/* Product Image - Lado izquierdo */}
                <div className="w-32 h-32 flex-shrink-0 relative">
                    <img
                        src={product.squareImageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover rounded-l-xl"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/128x128/6366f1/ffffff?text=No+Image';
                        }}
                    />
                </div>
                
                {/* Product Info - Lado derecho */}
                <div className="flex-1 min-w-0 p-4 flex flex-col justify-center relative">
                    <h3 className="font-bold text-white text-base mb-2 group-hover:text-white/90 transition-colors duration-300 truncate drop-shadow-sm">
                        {product.title}
                    </h3>
                    <p className="text-white/80 text-sm drop-shadow-sm">
                        {product.category.name}
                    </p>
                    
                     {/* Decorative element */}
                     <div 
                         className="absolute bottom-2 left-4 w-8 h-0.5 rounded-full opacity-60"
                         style={{
                             background: colors?.primary || 'rgba(255, 255, 255, 0.6)'
                         }}
                     />
                </div>
                
                 {/* Arrow indicator */}
                 <div className="flex-shrink-0 p-4 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                     <div 
                         className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
                         style={{
                             background: colors
                                 ? `${colors.secondary}CC`
                                 : 'rgba(255, 255, 255, 0.2)',
                             border: `1px solid ${colors?.primary || 'rgba(255, 255, 255, 0.3)'}60`
                         }}
                     >
                         <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                     </svg>
                     </div>
                 </div>
            </div>
        </div>
    );
};

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

                        {/* Grid de productos - Estilo launcher de juegos */}
                        {categoryProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categoryProducts.map((product: Product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    />
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

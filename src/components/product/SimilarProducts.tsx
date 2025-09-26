import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../services/productService';
import { getProductByCategoryId } from '../../services/productService';

interface SimilarProductsProps {
    product: Product;
}

export const SimilarProducts = ({ product }: SimilarProductsProps) => {
    console.log('SimilarProducts component rendered with product:', product);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSimilarProducts = async () => {
            try {
                setLoading(true);
                console.log('Fetching similar products for category:', product.category.id);
                const products = await getProductByCategoryId(product.category.id);
                console.log('Products from category:', products);
                // Filter out the current product and limit to 4 similar products
                const filtered = products.filter((p: Product) => p.id !== product.id).slice(0, 4);
                console.log('Filtered similar products:', filtered);
                setSimilarProducts(filtered);
            } catch (error) {
                console.error('Error fetching similar products:', error);
                setSimilarProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (product.category.id) {
            fetchSimilarProducts();
        }
    }, [product.category.id, product.id]);

    const handleProductClick = (productId: string) => {
        navigate(`/product/${productId}`);
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Productos similares</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 animate-pulse">
                            <div className="bg-gray-700 rounded-lg mb-2 w-full aspect-[4/3]"></div>
                            <div className="bg-gray-700 h-4 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (similarProducts.length === 0 && !loading) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Productos similares</h3>
                <p className="text-gray-400">No hay productos similares disponibles en este momento.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Productos similares</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {similarProducts.map((similarProduct) => (
                    <div 
                        key={similarProduct.id}
                        className="group cursor-pointer"
                        onClick={() => handleProductClick(similarProduct.id)}
                    >
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 hover:border-blue-500 transition-colors">
                            <div className="relative overflow-hidden rounded-lg mb-2 w-full aspect-[4/3]">
                                <img 
                                    src={similarProduct.squareImageUrl}
                                    alt={similarProduct.title}
                                    className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <p className='text-center text-xs font-medium text-gray-100 group-hover:text-blue-300 transition-colors line-clamp-2'>
                                {similarProduct.title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

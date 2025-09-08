import { Product } from '../../services/productService';
import { ProductRow } from './ProductRow';

interface ProductTableProps {
    products: Product[];
    isProductSelected: (productId: string) => boolean;
    canSelectMore: () => boolean;
    onToggleProduct: (productId: string) => void;
    onEditProduct: (productId: string) => void;
}

export const ProductTable = ({
    products,
    isProductSelected,
    canSelectMore,
    onToggleProduct,
    onEditProduct
}: ProductTableProps) => {
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Producto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Categoría
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Carrusel
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product: Product) => (
                            <ProductRow
                                key={product.id}
                                product={product}
                                isSelected={isProductSelected(product.id)}
                                canSelect={canSelectMore()}
                                onToggleSelection={onToggleProduct}
                                onEdit={onEditProduct}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

import type { Product } from '../../services/productService';

interface ProductRowProps {
    product: Product;
    isSelected: boolean;
    canSelect: boolean;
    onToggleSelection: (productId: string) => void;
    onEdit: (productId: string) => void;
}

export const ProductRow = ({
    product,
    isSelected,
    canSelect,
    onToggleSelection,
    onEdit
}: ProductRowProps) => {
    const handleToggleSelection = () => {
        // Validar que el producto esté activo antes de permitir selección
        if (!product.state && !isSelected) {
            alert('No se puede agregar un producto inactivo al carrusel');
            return;
        }
        onToggleSelection(product.id);
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                        <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={product.imageUrl}
                            alt={product.title}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                            }}
                        />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {product.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category?.name || 'Sin categoría'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.state === true
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                }`}>
                    {product.state ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={handleToggleSelection}
                        disabled={!canSelect && !isSelected}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                        {isSelected ? 'En carrusel' : 'Agregar'}
                    </span>
                </label>
                {!product.state && !isSelected && (
                    <div className="text-xs text-red-500 mt-1">
                        Solo productos activos
                    </div>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                    onClick={() => onEdit(product.id)}
                    className="text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                </button>
            </td>
        </tr>
    );
};

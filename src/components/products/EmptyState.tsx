interface EmptyStateProps {
    hasProducts: boolean;
    filteredCount: number;
}

export const EmptyState = ({ hasProducts, filteredCount }: EmptyStateProps) => {
    return (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-600 mb-2">
                {!hasProducts ? 'No hay productos' : 'No se encontraron productos'}
            </h3>
            <p className="text-gray-500">
                {!hasProducts 
                    ? 'Aún no se han creado productos en el sistema.' 
                    : 'Intenta ajustar los filtros de búsqueda.'}
            </p>
        </div>
    );
};

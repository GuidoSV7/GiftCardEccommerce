interface ProductFiltersProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    categoryFilter: string;
    setCategoryFilter: (value: string) => void;
    stateFilter: string;
    setStateFilter: (value: string) => void;
    categories: string[];
    totalSelected: number;
    onClearFilters: () => void;
    onClearCarousel: () => void;
}

export const ProductFilters = ({
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    stateFilter,
    setStateFilter,
    categories,
    totalSelected,
    onClearFilters,
    onClearCarousel
}: ProductFiltersProps) => {
    const hasActiveFilters = searchTerm || categoryFilter || stateFilter;
    const hasCarouselSelection = totalSelected > 0;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Buscador por nombre */}
                <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                        Buscar por nombre
                    </label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Filtro por categoría */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría
                    </label>
                    <select
                        id="category"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map((category: string) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtro por estado */}
                <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                        Estado
                    </label>
                    <select
                        id="state"
                        value={stateFilter}
                        onChange={(e) => setStateFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Todos los estados</option>
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                    </select>
                </div>

                {/* Información del carrusel */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Carrusel
                    </label>
                    <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                        {totalSelected}/5 seleccionados
                    </div>
                </div>
            </div>

            {/* Botones de limpieza */}
            <div className="mt-4 flex gap-4">
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Limpiar filtros
                    </button>
                )}
                
                {hasCarouselSelection && (
                    <button
                        onClick={onClearCarousel}
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                        🗑️ Limpiar carrusel ({totalSelected} seleccionados)
                    </button>
                )}
            </div>
        </div>
    );
};

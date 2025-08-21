import { Link } from 'react-router-dom';

export const HomeHeader = () => {
    return (
        <header className="bg-gray-900 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo y Nombre */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3">
                            {/* <img
                                src="/logo.svg"
                                alt="Gift Card Store Logo"
                                className="h-8 w-auto"
                            /> */}
                            <span className="text-xl font-bold text-white">Gift Card Store</span>
                        </Link>
                    </div>

                    {/* Navegación Principal */}
                    <nav className="hidden md:flex space-x-8">
                        <Link to="/gift-cards" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                            Tarjetas de Regalo
                        </Link>
                        <Link to="/games" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                            Juegos
                        </Link>
                        <Link to="/offers" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                            Ofertas
                        </Link>
                    </nav>

                    {/* Botones de Acción */}
                    <div className="flex items-center space-x-4">
                        {/* Búsqueda */}
                        <button className="text-gray-300 hover:text-white">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Carrito */}
                        <button className="text-gray-300 hover:text-white relative">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                                0
                            </span>
                        </button>

                        {/* Menú Móvil */}
                        <button className="md:hidden text-gray-300 hover:text-white">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>


        </header>
    );
};

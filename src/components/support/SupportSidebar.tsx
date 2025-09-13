import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { 
    ChatIcon, 
    AccountIcon
} from '../../icons';

interface SupportSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SupportSidebar = ({ isOpen, onClose }: SupportSidebarProps) => {
    const location = useLocation();
    const { user, logout } = useAuthStore();

    const supportMenuItems = [
        {
            path: '/support/dashboard',
            label: 'Dashboard',
            icon: <ChatIcon className="w-5 h-5" />,
            description: 'Panel principal de soporte'
        },
        {
            path: '/support/chats',
            label: 'Gestión de Chats',
            icon: <ChatIcon className="w-5 h-5" />,
            description: 'Ver y responder chats'
        },
        {
            path: '/support/active-chats',
            label: 'Chats Activos',
            icon: <ChatIcon className="w-5 h-5" />,
            description: 'Chats en curso'
        },
        {
            path: '/support/pending-chats',
            label: 'Chats Pendientes',
            icon: <ChatIcon className="w-5 h-5" />,
            description: 'Chats esperando respuesta'
        },
        {
            path: '/support/closed-chats',
            label: 'Chats Cerrados',
            icon: <ChatIcon className="w-5 h-5" />,
            description: 'Historial de chats'
        }
    ];

    const handleLogout = () => {
        logout();
        onClose();
    };

    return (
        <>
            {/* Overlay para móvil */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:shadow-none
                w-64
            `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                                    <ChatIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Soporte</h2>
                                    <p className="text-blue-200 text-sm">Panel de Control</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="lg:hidden text-white hover:text-blue-200 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <AccountIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.email || 'Usuario'}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                    {user?.roles || 'support'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        <div className="px-4 space-y-2">
                            {supportMenuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={onClose}
                                        className={`
                                            flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                                            ${isActive 
                                                ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }
                                        `}
                                    >
                                        <span className={`mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                                            {item.icon}
                                        </span>
                                        <div className="flex-1">
                                            <div className="font-medium">{item.label}</div>
                                            <div className="text-xs text-gray-500">{item.description}</div>
                                        </div>
                                    </NavLink>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-gray-200 p-4">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SupportSidebar } from '../components/support/SupportSidebar';
import { ChatNotification } from '../components/chat/ChatNotification';

export default function SupportLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Notificaciones de chat */}
            <ChatNotification enabled={true} />
            
            {/* Sidebar */}
            <SupportSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            
            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Top Bar */}
                <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900 ml-2 lg:ml-0">
                                Panel de Soporte
                            </h1>
                        </div>
                        
                        {/* Status Indicator */}
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">En línea</span>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

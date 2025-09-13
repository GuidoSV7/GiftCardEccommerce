import { useState } from 'react';
import { ChatSupport } from './ChatSupport';

export const ChatButton = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleOpenChat = () => {
        setIsChatOpen(true);
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
    };

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={handleOpenChat}
                className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                aria-label="Abrir chat de soporte"
            >
                <svg 
                    className="w-6 h-6 transition-transform group-hover:scale-110" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                    />
                </svg>
                
                {/* Notification dot */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </button>

            {/* Chat Support Component */}
            <ChatSupport 
                isOpen={isChatOpen} 
                onClose={handleCloseChat} 
            />
        </>
    );
};

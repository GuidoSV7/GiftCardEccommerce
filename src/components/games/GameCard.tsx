interface GameCardProps {
    id: number;
    title: string;
    subtitle: string;
    icon: string;
    category: string;
    region: string;
}

export const GameCard = ({ title, subtitle, icon, region }: GameCardProps) => {
    return (
        <div className="bg-white hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center p-3 space-x-3">
                {/* Icono */}
                <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img 
                        src={icon}
                        alt={title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = `
                                <div class="w-full h-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                    ${title.charAt(0)}
                                </div>
                            `;
                        }}
                    />
                </div>
                
                {/* Contenido */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 font-normal text-xs truncate">
                        {title}
                    </h3>
                    <p className="text-gray-600 text-xs truncate">
                        {subtitle}
                    </p>
                    <p className="text-gray-500 text-xs">
                        {region}
                    </p>
                </div>
                
                {/* Flecha */}
                <div className="text-gray-400">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

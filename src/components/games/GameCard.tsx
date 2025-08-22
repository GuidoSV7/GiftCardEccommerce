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
        <div className="bg-white/5 hover:bg-white/10 transition-all cursor-pointer backdrop-blur-sm">
            <div className="flex items-center p-4 space-x-4">
                {/* Icono */}
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-white/10">
                    <img 
                        src={icon}
                        alt={title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
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
                    <h3 className="text-white font-medium text-xs truncate">
                        {title}
                    </h3>
                    <p className="text-gray-300 text-xs truncate">
                        {subtitle}
                    </p>
                    <p className="text-gray-400 text-xs">
                        {region}
                    </p>
                </div>
                
                {/* Flecha */}
                <div className="text-gray-300">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

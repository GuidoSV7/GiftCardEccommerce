import { GameCard } from './GameCard';
import type { GameCardData } from '../../services/gameCardService';

interface GameSectionProps {
    title: string;
    games: GameCardData[];
    isLoading: boolean;
    error: string | null;
}

export const GameSection = ({ title, games, isLoading, error }: GameSectionProps) => {
    return (
        <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
            <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-white/10 to-transparent">
                <h2 className="text-lg font-semibold text-white">
                    {title}
                </h2>
                <button className="text-gray-300 hover:text-white flex items-center text-sm transition-colors group">
                    Ver Más
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {isLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-[1px] bg-white/5">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-white/5 p-4 animate-pulse backdrop-blur-sm">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white/20 rounded-lg"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-white/20 rounded-full w-3/4 mb-2"></div>
                                    <div className="h-3 bg-white/20 rounded-full w-1/2 mb-1"></div>
                                    <div className="h-3 bg-white/20 rounded-full w-1/3"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            {!isLoading && !error && (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-[1px] bg-white/5">
                    {games.map((game) => (
                        <GameCard
                            key={game.id}
                            {...game}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

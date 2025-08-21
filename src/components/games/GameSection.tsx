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
        <div className="mb-6 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50">
                <h2 className="text-base font-medium text-gray-900">
                    {title}
                </h2>
                <button className="text-gray-600 hover:text-gray-900 flex items-center text-xs transition-colors">
                    Ver Más
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {isLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-white p-3 animate-pulse">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                                <div className="flex-1">
                                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-2 bg-gray-200 rounded w-1/2 mb-1"></div>
                                    <div className="h-2 bg-gray-200 rounded w-1/3"></div>
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
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
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

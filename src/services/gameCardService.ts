import api from "../lib/axios";

export interface GameCardData {
    id: number;
    title: string;
    subtitle: string;
    icon: string;
    category: string;
    region: string;
}

export const getGameCards = async (): Promise<GameCardData[]> => {
    const response = await api.get<GameCardData[]>('/gameCards');
    return response.data;
};

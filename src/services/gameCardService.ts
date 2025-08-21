import axios from 'axios';

const baseURL = 'http://localhost:3000';

export interface GameCardData {
    id: number;
    title: string;
    subtitle: string;
    icon: string;
    category: string;
    region: string;
}

export const getGameCards = async (): Promise<GameCardData[]> => {
    const response = await axios.get<GameCardData[]>(`${baseURL}/gameCards`);
    return response.data;
};

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export interface NewsItem {
    id: number;
    title: string;
    image: string;
    category: string;
}

export const getNewsAndPromotions = async (): Promise<NewsItem[]> => {
    try {
        const response = await axios.get<NewsItem[]>(`${baseURL}/newsAndPromotions`);
        return response.data;
    } catch (error) {
        console.error('Error al cargar las noticias y promociones:', error);
        throw error;
    }
};

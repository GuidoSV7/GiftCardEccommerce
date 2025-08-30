import api from "../lib/axios";

export interface NewsItem {
    id: number;
    title: string;
    image: string;
    category: string;
}

export const getNewsAndPromotions = async (): Promise<NewsItem[]> => {
    try {
        const response = await api.get<NewsItem[]>('/newsAndPromotions');
        return response.data;
    } catch (error) {
        console.error('Error al cargar las noticias y promociones:', error);
        throw error;
    }
};

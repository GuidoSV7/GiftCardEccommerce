import api from "../lib/axios";

export interface CardGridItem {
    id: number;
    title: string;
    image: string;
    price?: string;
    category?: string;
}

export const getCardGridItems = async (): Promise<CardGridItem[]> => {
    try {
        const response = await api.get<CardGridItem[]>('/cardGrid');
        return response.data;
    } catch (error) {
        console.error('Error fetching card grid items:', error);
        throw error;
    }
};

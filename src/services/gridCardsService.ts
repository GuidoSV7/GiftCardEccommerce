import api from "../lib/axios";

export interface GridCardItem {
    image: string;
    title: string;
    alt: string;
    bgClass?: string;
}

export interface GridSection {
    id: number;
    title: string;
    viewAllLink: string;
    items: GridCardItem[];
}

export const getGridSections = async (): Promise<GridSection[]> => {
    try {
        const response = await api.get('/gridSections');
        return response.data;
    } catch (error) {
        console.error('Error fetching grid sections:', error);
        throw error;
    }
};

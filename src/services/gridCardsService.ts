import axios from 'axios';

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

const baseURL = import.meta.env.VITE_API_URL;

export const getGridSections = async (): Promise<GridSection[]> => {
    try {
        const response = await axios.get(`${baseURL}/gridSections`);
        return response.data;
    } catch (error) {
        console.error('Error fetching grid sections:', error);
        throw error;
    }
};

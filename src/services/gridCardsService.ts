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

const API_URL = 'http://localhost:3000';

export const getGridSections = async (): Promise<GridSection[]> => {
    try {
        const response = await axios.get(`${API_URL}/gridSections`);
        return response.data;
    } catch (error) {
        console.error('Error fetching grid sections:', error);
        throw error;
    }
};

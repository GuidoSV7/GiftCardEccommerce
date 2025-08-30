import api from "../lib/axios";

export interface Category {
    id: number;
    name: string;
}

export interface Gifcard {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    redeem: string;
    termsConditions: string;
    state: string;
    categoryId: {
        name: string;
    };
}

export const getGifcards = async (): Promise<Gifcard[]> => {
    try {
        const response = await api.get('/gifcards');
        return response.data;
    } catch (error) {
        console.error('Error fetching gifcards:', error);
        throw error;
    }
};

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const getGifcardsWithCategories = async (): Promise<Gifcard[]> => {
    try {
        const response = await api.get('/gifcards');
        return response.data;
    } catch (error) {
        console.error('Error fetching gifcards with categories:', error);
        throw error;
    }
};

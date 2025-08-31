import api from "../lib/axios";

export interface Category {
    id: number;
    name: string;
}

export interface Product {
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

export const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
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

export const getProductsWithCategories = async (): Promise<Product[]> => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.error('Error fetching products with categories:', error);
        throw error;
    }
};

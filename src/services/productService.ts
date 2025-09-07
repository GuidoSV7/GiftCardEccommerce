import { isAxiosError } from "axios";
import api from "../lib/axios";
import { dashboardProductSchema, type ProductFormData } from "../types";

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
    state: boolean;
    category: {
        id: string;
        name: string;
    };
}

export async function createProduct(formData: ProductFormData) {
    try {
        const { data } = await api.post('/products', formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            
            throw error.response?.data || error;
        }
       
        throw error;
    }
}

export async function getProducts() {
    try {
        const { data } = await api.get('/products');
        const response = dashboardProductSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
        return []; // Return empty array if parsing fails
        
    } catch (error) {
        if (isAxiosError(error)) {
            
            throw error.response?.data || error;
        }
       
        throw error;
    }
}

export async function getProductsAll() {
    try {
        const { data } = await api.get('/products/admin/all');
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            
            throw error.response?.data || error;
        }
       
        throw error;
    }
}

export async function getProductById(id: string) {
    try {
        const { data } = await api.get(`/products/${id}`);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}

export async function getProductByCategoryId(id: string) {
    try {
        const { data } = await api.get(`/products/category/${id}`);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}

export async function updateProduct(id: string, formData: ProductFormData) {
    try {
        const { data } = await api.patch(`/products/${id}`, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}



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

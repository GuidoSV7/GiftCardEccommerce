import { isAxiosError } from "axios";
import api from "../lib/axios";
import type { CategoryFormData } from "../types";

export async function createCategory(formData: CategoryFormData) {
    try {
        const { data } = await api.post('/categories', formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}

export async function getCategories() {
    try {
        const { data } = await api.get('/categories');
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}

export async function getAllCategories() {
    try {
        const { data } = await api.get('/categories/admin/all');
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}

export async function deleteCategory(id: string) {
    try {
        const { data } = await api.delete(`/categories/${id}`);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}

export async function restoreCategory(id: string) {
    try {
        const { data } = await api.patch(`/categories/${id}/restore`);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}



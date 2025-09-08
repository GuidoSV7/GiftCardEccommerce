import { isAxiosError } from "axios";
import api from "../lib/axios";

export interface Member {
    id: string;
    email: string;
    userName: string;
    rol: string;
    registrationDate: string;
    balance: number;
    discount: number;
    isActive: boolean;
}

export async function getAllMembers() {
    try {
        const { data } = await api.get('/users/members/all');
        console.log('Datos recibidos de /users/members/all:', data);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}

export async function getMembers() {
    try {
        const { data } = await api.get('/users/members/all');
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}

export async function getMemberById(id: string) {
    try {
        const { data } = await api.get(`/users/${id}`);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}

export async function updateMember(id: string, updateData: Partial<Member>) {
    try {
        const { data } = await api.patch(`/users/${id}`, updateData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}

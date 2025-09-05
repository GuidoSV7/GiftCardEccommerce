import { isAxiosError } from "axios";
import api from "../lib/axios";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    id: string;
    email: string;
    rol: string;
    token: string;
    adminData: any | null;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
        const { data } = await api.post('/auth/login', credentials);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}

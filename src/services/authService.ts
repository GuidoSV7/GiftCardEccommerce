import { isAxiosError } from "axios";
import api from "../lib/axios";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    id: string;
    email: string;
    roles: string;
    token: string;
    adminData: any | null;
}

export interface CreateUserData {
    userName: string;
    email: string;
    password: string;
    roles: string;
    balance?: number;
    discount?: number;
    isActive?: boolean;
}

export interface GoogleAuthData {
    googleId: string;
    email: string;
    name: string;
    picture?: string;
}

export interface GoogleAuthResponse {
    id: string;
    email: string;
    roles: string;
    token: string;
    adminData: any | null;
    isNewUser?: boolean;
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

export async function createUser(userData: CreateUserData) {
    try {
        const { data } = await api.post('/users', userData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}

export async function googleAuth(googleData: GoogleAuthData): Promise<GoogleAuthResponse> {
    try {
        const { data } = await api.post('/auth/google', googleData);
        // The backend wraps the response in a data property
        return data.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}

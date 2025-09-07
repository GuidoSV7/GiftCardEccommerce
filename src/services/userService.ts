import api from "../lib/axios";

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    roles: "admin" | "user" | "client";
}

export interface CreateUserData {
    name: string;
    email: string;
    password: string;
    roles?: "admin" | "user" | "client";
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    password?: string;
    roles?: "admin" | "user" | "client";
}

export interface LoginCredentials {
    email: string;
    password: string;
}

// Obtener todos los usuarios
export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get<User[]>('/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Obtener un usuario por ID
export const getUserById = async (id: string): Promise<User> => {
    try {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with id ${id}:`, error);
        throw error;
    }
};

// Crear un nuevo usuario
export const createUser = async (userData: CreateUserData): Promise<User> => {
    try {
        const response = await api.post<User>('/users', {
            ...userData,
            roles: userData.roles || 'client'
        });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Actualizar un usuario
export const updateUser = async (id: string, userData: UpdateUserData): Promise<User> => {
    try {
        const response = await api.put<User>(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error(`Error updating user with id ${id}:`, error);
        throw error;
    }
};

// Eliminar un usuario
export const deleteUser = async (id: string): Promise<void> => {
    try {
        await api.delete(`/users/${id}`);
    } catch (error) {
        console.error(`Error deleting user with id ${id}:`, error);
        throw error;
    }
};

// Login de usuario
export const loginUser = async (credentials: LoginCredentials): Promise<User | null> => {
    try {
        const response = await api.get<User[]>('/users');
        const users = response.data;
        
        const user = users.find(u => 
            u.email === credentials.email && u.password === credentials.password
        );
        
        return user || null;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

// Verificar si el email ya existe
export const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
        const response = await api.get<User[]>('/users');
        const users = response.data;
        
        return users.some(user => user.email === email);
    } catch (error) {
        console.error('Error checking email existence:', error);
        throw error;
    }
};

import { isAxiosError } from "axios";
import api from "../lib/axios";

export interface UploadFileResponse {
    imageUrls: string[];
    // La API devuelve un array de URLs de Cloudinary
}

export async function uploadImage(file: File): Promise<UploadFileResponse> {
    try {
        const formData = new FormData();
        formData.append('files', file);

        const { data } = await api.post('/files/fotos', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}

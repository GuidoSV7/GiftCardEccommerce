import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export interface CarouselItem {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    brand: string;
}

export const getCarouselItems = async (): Promise<CarouselItem[]> => {
    const response = await axios.get<CarouselItem[]>(`${baseURL}/carousel`);
    return response.data;
};

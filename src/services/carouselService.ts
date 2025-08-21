import axios from 'axios';

const baseURL = 'http://localhost:3000';

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

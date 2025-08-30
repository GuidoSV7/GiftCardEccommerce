import api from "../lib/axios";

export interface CarouselItem {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    brand: string;
}

export const getCarouselItems = async (): Promise<CarouselItem[]> => {
    const response = await api.get<CarouselItem[]>('/carousel');
    return response.data;
};

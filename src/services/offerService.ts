import api from "../lib/axios";

export interface Offer {
    id: number;
    image: string;
    price: string;
    title: string;
    discount: string;
}

export const getOffers = async (): Promise<Offer[]> => {
    const response = await api.get<Offer[]>('/offers');
    return response.data;
};

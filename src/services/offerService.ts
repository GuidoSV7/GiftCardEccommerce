import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export interface Offer {
    id: number;
    image: string;
    price: string;
    title: string;
    discount: string;
}

export const getOffers = async (): Promise<Offer[]> => {
    const response = await axios.get<Offer[]>(`${baseURL}/offers`);
    return response.data;
};

import axios from 'axios';

const baseURL = 'http://localhost:3000';

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

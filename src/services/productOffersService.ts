import api from "../lib/axios";


// Interfaz para productos con ofertas
export interface ProductWithOffer {
  id: string;
  title: string;
  imageUrl: string;
  category?: {
    id: string;
    name: string;
  };
  state: boolean;
  offerPrice: {
    id: string;
    name: string;
    value: number;
    discountPercentage: number;
    finalPrice: number;
    state: boolean;
  };
}

// Función para obtener productos con ofertas activas
export const getProductsWithOffers = async (): Promise<ProductWithOffer[]> => {
  try {
    console.log('Fetching products with offers...');
    const response = await api.get('/product-prices/offers');
    console.log('Products with offers response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching products with offers:', error);
    throw error;
  }
};


// Función para obtener ofertas activas de un producto específico
export const getProductOffers = async (productId: string): Promise<ProductWithOffer[]> => {
  try {
    const response = await api.get(`/product-prices/product/${productId}/offers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product offers:', error);
    throw error;
  }
};

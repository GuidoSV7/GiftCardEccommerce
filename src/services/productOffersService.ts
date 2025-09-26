import api from "../lib/axios";


// Interfaz para productos con ofertas
export interface ProductWithOffer {
  id: string;
  title: string;
  squareImageUrl: string;
  rectangularImageUrl: string;
  smallSquareImageUrl: string;
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
    const response = await api.get('/product-prices/offers');
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


// Función para obtener ofertas activas de un producto específico
export const getProductOffers = async (productId: string): Promise<ProductWithOffer[]> => {
  try {
    const response = await api.get(`/product-prices/product/${productId}/offers`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

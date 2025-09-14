import { isAxiosError } from "axios";
import api from "../lib/axios";
import { dashboardProductSchema, type ProductFormData } from "../types";

export interface Category {
    id: string;
    name: string;
}

export interface Product {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    redeem: string;
    termsConditions: string;
    state: boolean;
    category: {
        id: string;
        name: string;
    };
}

export async function createProduct(formData: ProductFormData) {
    try {
        // Filtrar campos que no deben enviarse al backend
        const { tempPrices, ...productData } = formData;
        console.log('Enviando datos al backend:', productData);
        
        const { data } = await api.post('/products', productData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            console.error('Error del backend:', error.response?.data);
            throw error.response?.data || error;
        }
       
        throw error;
    }
}

export async function getProducts() {
    try {
        const { data } = await api.get('/products');
        const response = dashboardProductSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
        return []; // Return empty array if parsing fails
        
    } catch (error) {
        if (isAxiosError(error)) {
            
            throw error.response?.data || error;
        }
       
        throw error;
    }
}

export async function getProductsAll() {
    try {
        const { data } = await api.get('/products/admin/all');
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            
            throw error.response?.data || error;
        }
       
        throw error;
    }
}

export async function getProductById(id: string) {
    try {
        const { data } = await api.get(`/products/${id}`);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}

export async function getProductByCategoryId(id: string) {
    try {
        const { data } = await api.get(`/products/category/${id}`);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}

export async function updateProduct(id: string, formData: ProductFormData) {
    try {
        const { data } = await api.patch(`/products/${id}`, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || error;
        }
        throw error;
    }
}



export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const getProductsWithCategories = async (): Promise<Product[]> => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.error('Error fetching products with categories:', error);
        throw error;
    }
};

// Interfaz para productos con ofertas
export interface ProductWithOffer {
    id: string;
    title: string;
    imageUrl: string;
    offerPrice: {
        id: string;
        name: string;
        value: number;
        discountPercentage: number;
        finalPrice: number;
    };
}

// Función para obtener productos con ofertas activas
export const getProductsWithOffers = async (): Promise<ProductWithOffer[]> => {
    try {
        // Obtener todos los productos
        const products = await getProducts();
        
        // Obtener precios con ofertas para cada producto
        const productsWithOffers: ProductWithOffer[] = [];
        
        for (const product of products) {
            try {
                // Obtener ofertas activas del producto
                const offersResponse = await api.get(`/product-prices/product/${product.id}/offers`);
                const offers = offersResponse.data;
                
                // Si hay ofertas, agregar el producto con la primera oferta activa
                if (offers && offers.length > 0) {
                    const activeOffer = offers.find((offer: any) => offer.state && offer.discountPercentage > 0);
                    
                    if (activeOffer) {
                        const finalPrice = activeOffer.value * (1 - activeOffer.discountPercentage / 100);
                        
                        productsWithOffers.push({
                            id: product.id,
                            title: product.title,
                            imageUrl: product.imageUrl,
                            offerPrice: {
                                id: activeOffer.id,
                                name: activeOffer.name,
                                value: activeOffer.value,
                                discountPercentage: activeOffer.discountPercentage,
                                finalPrice: finalPrice
                            }
                        });
                    }
                }
            } catch (error) {
                // Si hay error al obtener ofertas de un producto específico, continuar con el siguiente
                console.warn(`Error fetching offers for product ${product.id}:`, error);
                continue;
            }
        }
        
        return productsWithOffers;
    } catch (error) {
        console.error('Error fetching products with offers:', error);
        throw error;
    }
};
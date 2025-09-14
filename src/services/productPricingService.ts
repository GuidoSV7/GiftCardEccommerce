import api from "../lib/axios";


export interface ProductPrice {
  id: string;
  name: string;
  value: number;
  discountPercentage?: number;
  state: boolean;
  productId: string;
}

export interface CreateProductPriceDto {
  name: string;
  value: number;
  discountPercentage?: number;
  state?: boolean;
  productId: string;
}

export interface UpdateProductPriceDto {
  name?: string;
  value?: number;
  discountPercentage?: number;
  state?: boolean;
}

export interface PaginationDto {
  limit?: number;
  offset?: number;
}

export const productPricingService = {
  // Crear un nuevo precio para un producto
  create: async (data: CreateProductPriceDto): Promise<ProductPrice> => {
    const response = await api.post('/product-prices', data);
    return response.data;
  },

  // Obtener todos los precios con paginación
  findAll: async (pagination?: PaginationDto): Promise<{ data: ProductPrice[]; total: number }> => {
    const response = await api.get('/product-prices', { params: pagination });
    return response.data;
  },

  // Obtener precios por producto
  findByProduct: async (productId: string): Promise<ProductPrice[]> => {
    const response = await api.get(`/product-prices/product/${productId}`);
    return response.data;
  },

  // Obtener ofertas activas de un producto
  findActiveOffersByProduct: async (productId: string): Promise<ProductPrice[]> => {
    const response = await api.get(`/product-prices/product/${productId}/offers`);
    return response.data;
  },

  // Obtener precio regular de un producto
  findRegularPriceByProduct: async (productId: string): Promise<ProductPrice> => {
    const response = await api.get(`/product-prices/product/${productId}/regular-price`);
    return response.data;
  },

  // Obtener un precio específico
  findOne: async (id: string): Promise<ProductPrice> => {
    const response = await api.get(`/product-prices/${id}`);
    return response.data;
  },

  // Actualizar un precio
  update: async (id: string, data: UpdateProductPriceDto): Promise<ProductPrice> => {
    const response = await api.patch(`/product-prices/${id}`, data);
    return response.data;
  },

  // Alternar estado de un precio
  togglePriceState: async (id: string): Promise<ProductPrice> => {
    const response = await api.patch(`/product-prices/${id}/toggle-state`);
    return response.data;
  },

  // Eliminar un precio
  remove: async (id: string): Promise<void> => {
    await api.delete(`/product-prices/${id}`);
  }
};

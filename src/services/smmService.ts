import { axiosInstance } from '../lib/axios';

// Interfaces para SMM Services
export interface SmmService {
  id: number;
  name: string;
  category: string;
  rate: number;
  min: number;
  max: number;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface SmmOrder {
  id: number;
  serviceId: number;
  serviceName: string;
  link: string;
  quantity: number;
  startCount: number;
  remains: number;
  status: 'pending' | 'in_progress' | 'completed' | 'partial' | 'canceled';
  charge: number;
  createdAt: string;
  updatedAt: string;
}

export interface SmmTicket {
  id: number;
  orderId?: number;
  subject: string;
  message: string;
  status: 'open' | 'answered' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  responses?: SmmTicketResponse[];
}

export interface SmmTicketResponse {
  id: number;
  ticketId: number;
  message: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface CreateSmmOrderRequest {
  serviceId: number;
  link: string;
  quantity: number;
}

export interface CreateSmmTicketRequest {
  orderId?: number;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
}

// SMM Services API
export const getSmmServices = async (): Promise<SmmService[]> => {
  try {
    const response = await axiosInstance.get('/smm/services');
    return response.data;
  } catch (error) {
    console.error('Error fetching SMM services:', error);
    // Datos mock para desarrollo
    return [
      {
        id: 1,
        name: 'Instagram Followers',
        category: 'Instagram',
        rate: 0.50,
        min: 100,
        max: 10000,
        description: 'High quality Instagram followers',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'YouTube Views',
        category: 'YouTube',
        rate: 0.30,
        min: 1000,
        max: 100000,
        description: 'Real YouTube views from active users',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: 'TikTok Likes',
        category: 'TikTok',
        rate: 0.25,
        min: 100,
        max: 50000,
        description: 'Organic TikTok likes',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
};

export const getSmmServiceById = async (id: number): Promise<SmmService> => {
  try {
    const response = await axiosInstance.get(`/smm/services/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching SMM service:', error);
    throw error;
  }
};

// SMM Orders API
export const getSmmOrders = async (): Promise<SmmOrder[]> => {
  try {
    const response = await axiosInstance.get('/smm/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching SMM orders:', error);
    // Datos mock para desarrollo
    return [
      {
        id: 1,
        serviceId: 1,
        serviceName: 'Instagram Followers',
        link: 'https://instagram.com/example',
        quantity: 1000,
        startCount: 5000,
        remains: 500,
        status: 'in_progress',
        charge: 5.00,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        serviceId: 2,
        serviceName: 'YouTube Views',
        link: 'https://youtube.com/watch?v=example',
        quantity: 5000,
        startCount: 1200,
        remains: 0,
        status: 'completed',
        charge: 15.00,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
};

export const createSmmOrder = async (orderData: CreateSmmOrderRequest): Promise<SmmOrder> => {
  try {
    const response = await axiosInstance.post('/smm/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating SMM order:', error);
    throw error;
  }
};

// SMM Tickets API
export const getSmmTickets = async (): Promise<SmmTicket[]> => {
  try {
    const response = await axiosInstance.get('/smm/tickets');
    return response.data;
  } catch (error) {
    console.error('Error fetching SMM tickets:', error);
    // Datos mock para desarrollo
    return [
      {
        id: 1,
        orderId: 1,
        subject: 'Order not completed',
        message: 'My Instagram followers order has been stuck for 2 days',
        status: 'open',
        priority: 'high',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        responses: [
          {
            id: 1,
            ticketId: 1,
            message: 'We are looking into this issue. Please wait 24 hours.',
            isAdmin: true,
            createdAt: new Date().toISOString(),
          }
        ]
      },
      {
        id: 2,
        subject: 'Question about service',
        message: 'What is the delivery time for YouTube views?',
        status: 'answered',
        priority: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
};

export const createSmmTicket = async (ticketData: CreateSmmTicketRequest): Promise<SmmTicket> => {
  try {
    const response = await axiosInstance.post('/smm/tickets', ticketData);
    return response.data;
  } catch (error) {
    console.error('Error creating SMM ticket:', error);
    throw error;
  }
};

export const getSmmTicketById = async (id: number): Promise<SmmTicket> => {
  try {
    const response = await axiosInstance.get(`/smm/tickets/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching SMM ticket:', error);
    throw error;
  }
};

export const updateSmmTicketStatus = async (id: number, status: SmmTicket['status']): Promise<SmmTicket> => {
  try {
    const response = await axiosInstance.patch(`/smm/tickets/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating SMM ticket status:', error);
    throw error;
  }
};

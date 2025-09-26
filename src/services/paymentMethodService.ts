import api from '../lib/axios';

// Interfaces para métodos de pago
export interface PaymentMethod {
  id: number;
  method: string;
  name: string;
  description: string;
  min: number;
  max: number;
  status: 'allowed' | 'disabled';
  newUsers: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentMethodRequest {
  method: string;
  name: string;
  description: string;
  min: number;
  max: number;
  status: 'allowed' | 'disabled';
  newUsers: boolean;
}

export interface UpdatePaymentMethodRequest extends Partial<CreatePaymentMethodRequest> {
  id: number;
}

// API de métodos de pago
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const response = await api.get('/payment-methods');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    // Datos mock para desarrollo
    return [
      {
        id: 1,
        method: 'paypal',
        name: 'PayPal | Desde 10$ USD',
        description: 'Instant Transfer Payments',
        min: 10.00,
        max: 110.00,
        status: 'allowed',
        newUsers: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        method: 'veriagos',
        name: 'QR BOLIVIA | Desde 1$ USD cercano al paralelo',
        description: 'Pago automático con QR SCT via Veriagos',
        min: 1.00,
        max: 110.00,
        status: 'allowed',
        newUsers: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        method: 'cryptomus',
        name: 'Cryptomus USDC, BTC, ETH | Desde 5$ USD',
        description: 'Cripto, BTC, etc [Automatico] Min 5$',
        min: 1.00,
        max: 500.00,
        status: 'allowed',
        newUsers: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 4,
        method: 'manual',
        name: 'Pagos Manuales se ve en Whats +591 69562311',
        description: 'Manual Payments',
        min: 10.00,
        max: 100.00,
        status: 'allowed',
        newUsers: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 5,
        method: 'binance-v2',
        name: 'Binance pay | Desde 1$ USD',
        description: 'Binance Pay with QR Code [Automatico] [USD]',
        min: 1.00,
        max: 300.00,
        status: 'disabled',
        newUsers: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 6,
        method: 'hotmart',
        name: '[Automatico] Tarjeta, Transferencias, Pago Efectivo, etc.',
        description: 'Recarga con Visa, Mastercard, etc [Automatico]',
        min: 10.00,
        max: 10.00,
        status: 'disabled',
        newUsers: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 7,
        method: 'binance_pay_gateway',
        name: 'BINANCE PAY / QR $1 USDT',
        description: 'Automated Binance Pay with QR Code',
        min: 1.00,
        max: 1000.00,
        status: 'allowed',
        newUsers: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 8,
        method: 'stripe',
        name: 'Tarjeta / Apple Pay / Amazonpay, etc. | Desde $10 USD |',
        description: 'Any Debit/Credit Card [Worldwide]',
        min: 10.00,
        max: 100.00,
        status: 'allowed',
        newUsers: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
};

export const createPaymentMethod = async (data: CreatePaymentMethodRequest): Promise<PaymentMethod> => {
  try {
    const response = await api.post('/payment-methods', data);
    return response.data;
  } catch (error) {
    console.error('Error creating payment method:', error);
    throw error;
  }
};

export const updatePaymentMethod = async (data: UpdatePaymentMethodRequest): Promise<PaymentMethod> => {
  try {
    const response = await api.put(`/payment-methods/${data.id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }
};

export const deletePaymentMethod = async (id: number): Promise<void> => {
  try {
    await api.delete(`/payment-methods/${id}`);
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};

export const togglePaymentMethodStatus = async (id: number): Promise<PaymentMethod> => {
  try {
    const response = await api.patch(`/payment-methods/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error('Error toggling payment method status:', error);
    throw error;
  }
};

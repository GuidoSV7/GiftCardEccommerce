import api from '../lib/axios';

// Interfaces para el sistema de finanzas
export interface FinancialMetrics {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  processedOrders: number;
  profitMargin: number;
  period: string;
}

export interface DailyEarnings {
  date: string;
  amount: number;
  day: number;
}

export interface MonthlyData {
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  ordersCount: number;
}

export interface FinancialFilters {
  period: 'day' | 'week' | 'month' | 'year' | 'custom';
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
}

// API de Finanzas
export const getFinancialMetrics = async (filters: FinancialFilters): Promise<FinancialMetrics> => {
  try {
    const response = await api.get('/finance/metrics', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching financial metrics:', error);
    // Datos mock para desarrollo
    return {
      totalIncome: 77.35,
      totalExpenses: 39.82,
      netProfit: 37.53,
      processedOrders: 79,
      profitMargin: 48.5,
      period: 'Septiembre 2025'
    };
  }
};

export const getDailyEarnings = async (month: number, year: number): Promise<DailyEarnings[]> => {
  try {
    const response = await api.get('/finance/daily-earnings', { 
      params: { month, year } 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching daily earnings:', error);
    // Datos mock para desarrollo - generar datos para el mes
    const daysInMonth = new Date(year, month, 0).getDate();
    const mockData: DailyEarnings[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const amount = Math.random() * 15 + 2; // Entre 2 y 17 USD
      mockData.push({
        date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        amount: parseFloat(amount.toFixed(2)),
        day
      });
    }
    
    return mockData;
  }
};

export const getMonthlyData = async (year: number): Promise<MonthlyData[]> => {
  try {
    const response = await api.get('/finance/monthly-data', { 
      params: { year } 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    // Datos mock para desarrollo
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    return months.map((month) => ({
      month,
      year,
      totalIncome: Math.random() * 200 + 50,
      totalExpenses: Math.random() * 100 + 20,
      netProfit: Math.random() * 100 + 10,
      ordersCount: Math.floor(Math.random() * 150 + 20)
    }));
  }
};

export const exportFinancialReport = async (filters: FinancialFilters, format: 'pdf' | 'excel'): Promise<Blob> => {
  try {
    const response = await api.get('/finance/export', {
      params: { ...filters, format },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting financial report:', error);
    throw error;
  }
};

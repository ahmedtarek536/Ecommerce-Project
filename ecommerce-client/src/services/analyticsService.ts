import axios from 'axios';
import { API_URL } from '../config';

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  salesByCategory: Array<{
    category: string;
    total: number;
  }>;
  recentOrders: Array<{
    id: number;
    customerName: string;
    totalAmount: number;
    status: string;
    date: string;
  }>;
  salesOverTime: Array<{
    date: string;
    total: number;
  }>;
  topProducts: Array<{
    productId: number;
    product: {
      name: string;
      color: string;
    };
    totalSold: number;
    revenue: number;
  }>;
}

export const analyticsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axios.get(`${API_URL}/api/analytics/dashboard`);
    return response.data.data;
  },

  getSalesByCategory: async () => {
    const response = await axios.get(`${API_URL}/api/analytics/sales-by-category`);
    return response.data.data;
  },

  getCustomerGrowth: async () => {
    const response = await axios.get(`${API_URL}/api/analytics/customer-growth`);
    return response.data.data;
  },

  getTopProducts: async () => {
    const response = await axios.get(`${API_URL}/api/analytics/top-products`);
    return response.data.data;
  }
}; 
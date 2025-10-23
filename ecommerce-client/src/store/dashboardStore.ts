import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:44352';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  salesByCategory: {
    category: string;
    total: number;
  }[];
  recentOrders: {
    id: number;
    customerName: string;
    total: number;
    status: string;
    date: string;
  }[];
  salesOverTime: {
    date: string;
    total: number;
  }[];
}

interface DashboardStore {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  fetchDashboardStats: (token: string) => Promise<void>;
  fetchSalesByCategory: (token: string) => Promise<void>;
  fetchCustomerGrowth: (token: string) => Promise<void>;
  fetchTopProducts: (token: string) => Promise<void>;
}

const useDashboardStore = create<DashboardStore>((set) => ({
  stats: null,
  loading: false,
  error: null,

  fetchDashboardStats: async (token: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${API_URL}/api/Analytics/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        set({ stats: response.data.data, loading: false });
      } else {
        set({ error: response.data.message || 'Failed to fetch dashboard stats', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch dashboard stats', loading: false });
      console.error('Error fetching dashboard stats:', error);
    }
  },

  fetchSalesByCategory: async (token: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${API_URL}/api/Analytics/sales-by-category`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        set((state) => ({
          stats: state.stats ? { ...state.stats, salesByCategory: response.data.data } : null,
          loading: false,
        }));
      } else {
        set({ error: response.data.message || 'Failed to fetch sales by category', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch sales by category', loading: false });
      console.error('Error fetching sales by category:', error);
    }
  },

  fetchCustomerGrowth: async (token: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${API_URL}/api/Analytics/customer-growth`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        set((state) => ({
          stats: state.stats ? { ...state.stats, customerGrowth: response.data.data } : null,
          loading: false,
        }));
      } else {
        set({ error: response.data.message || 'Failed to fetch customer growth', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch customer growth', loading: false });
      console.error('Error fetching customer growth:', error);
    }
  },

  fetchTopProducts: async (token: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${API_URL}/api/Analytics/top-products`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        set((state) => ({
          stats: state.stats ? { ...state.stats, topProducts: response.data.data } : null,
          loading: false,
        }));
      } else {
        set({ error: response.data.message || 'Failed to fetch top products', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch top products', loading: false });
      console.error('Error fetching top products:', error);
    }
  },
}));

export default useDashboardStore; 
import { create } from 'zustand';
import { orderService } from '@/services/orderService';
import { Order, CreateOrderDTO, OrderStatus } from '@/types/order';

interface OrderStore {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  fetchOrders: (token: string) => Promise<void>;
  fetchOrderById: (id: number, token: string) => Promise<void>;
  updateOrderStatus: (id: number, status: OrderStatus, token: string) => Promise<void>;
  createOrder: (orderData: CreateOrderDTO, token: string) => Promise<void>;
  clearError: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,

  fetchOrders: async (token: string) => {
    set({ loading: true, error: null });
    try {
      const orders = await orderService.getOrders(token);
      set({ orders, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch orders', loading: false });
    }
  },

  fetchOrderById: async (id: number, token: string) => {
    set({ loading: true, error: null });
    try {
      const order = await orderService.getOrderById(id, token);
      set({ selectedOrder: order, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch order', loading: false });
    }
  },

  updateOrderStatus: async (id: number, status: OrderStatus, token: string) => {
    set({ loading: true, error: null });
    try {
      const updatedOrder = await orderService.updateOrderStatus(id, status, token);
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? updatedOrder : order
        ),
        selectedOrder: state.selectedOrder?.id === id
          ? updatedOrder
          : state.selectedOrder,
        loading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update order status', loading: false });
    }
  },

  createOrder: async (orderData: CreateOrderDTO, token: string) => {
    set({ loading: true, error: null });
    try {
      const newOrder = await orderService.createOrder(orderData, token);
      set((state) => ({
        orders: [...state.orders, newOrder],
        loading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create order', loading: false });
    }
  },

  clearError: () => set({ error: null }),
})); 
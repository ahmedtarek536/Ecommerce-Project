import { apiClient } from '@/utils/apiClient';
import { CreateOrderDTO, Order, OrderStatus } from '@/types/order';

class OrderService {
  async getOrders(token: string): Promise<Order[]> {
    const res = await apiClient.get<any>(`/api/Orders`, token);
    const payload = (res as any)?.data ?? (res as any)?.Data ?? res; 
    return (payload ?? []).map((order: any) => ({
      id: order.id,
      customerId: order.customerId,
      totalAmount: order.totalAmount ?? order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.orderDetails ?? order.items ?? [],
    }));
  }

  async getOrderById(id: number, token: string): Promise<Order> {
    const res = await apiClient.get<any>(`/api/Orders/${id}`, token);
    const order = ((res as any)?.data ?? (res as any)?.Data ?? res);
    return {
      id: order.id,
      customerId: order.customerId,
      totalAmount: order.totalAmount ?? order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.orderDetails ?? order.items ?? [],
    } as Order;
  }

  async createOrder(orderData: CreateOrderDTO, token: string): Promise<Order> {
    // Normalize PaymentMethod to server enum (numeric) to avoid binding issues
    const pmMap: Record<string, number> = {
      CreditCard: 0,
      PayPal: 1,
      CashOnDelivery: 2,
    };
    const normalizedPayload = {
      ...orderData,
      paymentMethod: pmMap[(orderData as any).paymentMethod] ?? (orderData as any).paymentMethod,
    } as any;

    const res = await apiClient.post<any>(`/api/Orders`, normalizedPayload, token);
    const created = ((res as any)?.data ?? (res as any)?.Data ?? res);
    return {
      id: created.id,
      customerId: created.customerId,
      totalAmount: created.totalAmount ?? created.total,
      status: created.status,
      paymentMethod: created.paymentMethod,
      shippingAddress: created.shippingAddress,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      items: created.orderDetails ?? created.items ?? [],
    } as Order;
  }

  async updateOrderStatus(id: number, status: OrderStatus, token: string): Promise<Order> {
    const res = await apiClient.patch<any>(`/api/Orders/${id}`, { status }, token as any);
    const updated = ((res as any)?.data ?? (res as any)?.Data ?? res);
    return updated as Order;
  }
}

export const orderService = new OrderService();
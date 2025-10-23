export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
  Completed = 'Completed'
}

export enum PaymentMethod {
  CreditCard = 'CreditCard',
  DebitCard = 'DebitCard',
  PayPal = 'PayPal',
  BankTransfer = 'BankTransfer',
  CashOnDelivery = 'CashOnDelivery'
}

export interface OrderItem {
  id: number;
  productId: number;
  productVariantId: number;
  sizeId: number;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl: string;
  };
}

export interface Order {
  id: number;
  customerId: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface CreateOrderDTO {
  customerId: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  items: {
    productId: number;
    productVariantId: number;
    sizeId: number;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
} 
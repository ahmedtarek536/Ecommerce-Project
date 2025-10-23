import { Order, OrderStatus, PaymentMethod } from '@/types/order';

export const mockOrders: Order[] = [
  {
    id: 1,
    customerId: 101,
    totalAmount: 299.99,
    status: OrderStatus.Pending,
    paymentMethod: PaymentMethod.CreditCard,
    shippingAddress: "123 Main St, New York, NY 10001",
    createdAt: "2024-03-15T10:30:00Z",
    updatedAt: "2024-03-15T10:30:00Z",
    items: [
      {
        id: 1,
        productId: 1,
        productVariantId: 1,
        sizeId: 1,
        quantity: 2,
        price: 149.99,
        product: {
          name: "Classic White T-Shirt",
          imageUrl: "/images/products/tshirt-white.jpg"
        }
      }
    ]
  },
  {
    id: 2,
    customerId: 102,
    totalAmount: 599.98,
    status: OrderStatus.Processing,
    paymentMethod: PaymentMethod.PayPal,
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90001",
    createdAt: "2024-03-14T15:45:00Z",
    updatedAt: "2024-03-14T16:20:00Z",
    items: [
      {
        id: 2,
        productId: 2,
        productVariantId: 2,
        sizeId: 2,
        quantity: 1,
        price: 399.99,
        product: {
          name: "Premium Denim Jacket",
          imageUrl: "/images/products/jacket-denim.jpg"
        }
      },
      {
        id: 3,
        productId: 3,
        productVariantId: 3,
        sizeId: 3,
        quantity: 1,
        price: 199.99,
        product: {
          name: "Leather Boots",
          imageUrl: "/images/products/boots-leather.jpg"
        }
      }
    ]
  },
  {
    id: 3,
    customerId: 103,
    totalAmount: 149.99,
    status: OrderStatus.Shipped,
    paymentMethod: PaymentMethod.DebitCard,
    shippingAddress: "789 Pine Rd, Chicago, IL 60601",
    createdAt: "2024-03-13T09:15:00Z",
    updatedAt: "2024-03-13T14:30:00Z",
    items: [
      {
        id: 4,
        productId: 4,
        productVariantId: 4,
        sizeId: 4,
        quantity: 1,
        price: 149.99,
        product: {
          name: "Casual Hoodie",
          imageUrl: "/images/products/hoodie-casual.jpg"
        }
      }
    ]
  },
  {
    id: 4,
    customerId: 104,
    totalAmount: 899.97,
    status: OrderStatus.Delivered,
    paymentMethod: PaymentMethod.CreditCard,
    shippingAddress: "321 Elm St, Miami, FL 33101",
    createdAt: "2024-03-12T11:20:00Z",
    updatedAt: "2024-03-12T16:45:00Z",
    items: [
      {
        id: 5,
        productId: 5,
        productVariantId: 5,
        sizeId: 5,
        quantity: 3,
        price: 299.99,
        product: {
          name: "Designer Watch",
          imageUrl: "/images/products/watch-designer.jpg"
        }
      }
    ]
  },
  {
    id: 5,
    customerId: 105,
    totalAmount: 449.98,
    status: OrderStatus.Cancelled,
    paymentMethod: PaymentMethod.BankTransfer,
    shippingAddress: "654 Maple Dr, Seattle, WA 98101",
    createdAt: "2024-03-11T14:10:00Z",
    updatedAt: "2024-03-11T15:30:00Z",
    items: [
      {
        id: 6,
        productId: 6,
        productVariantId: 6,
        sizeId: 6,
        quantity: 2,
        price: 224.99,
        product: {
          name: "Wireless Headphones",
          imageUrl: "/images/products/headphones-wireless.jpg"
        }
      }
    ]
  }
]; 
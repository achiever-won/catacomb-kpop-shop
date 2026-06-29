import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderItem, CartItem, ShippingAddress, PaymentInfo } from '../types';
import { generateOrderId, calculateEstimatedDelivery, calculateOrderTotal } from '../utils/order';
import { demoOrders } from '../data/demo';

interface OrderStore {
  orders: Order[];
  createOrder: (cart: CartItem[], shipping: ShippingAddress, payment: PaymentInfo) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  initDemoOrders: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (cart: CartItem[], shipping: ShippingAddress, _payment: PaymentInfo): Order => {
        const now = new Date();
        const shippingFee = 3000;

        const items: OrderItem[] = cart.map((cartItem) => ({
          productId: cartItem.productId,
          productName: cartItem.product.name,
          quantity: cartItem.quantity,
          unitPrice: cartItem.product.price,
          subtotal: cartItem.product.price * cartItem.quantity,
        }));

        const totalAmount = calculateOrderTotal(cart, shippingFee);
        const estimatedDelivery = calculateEstimatedDelivery(now);

        const order: Order = {
          orderId: generateOrderId(now),
          items,
          shippingAddress: shipping,
          totalAmount,
          shippingFee,
          orderDate: now.toISOString(),
          estimatedDelivery: estimatedDelivery.toISOString(),
          status: '배송준비중',
        };

        set((state) => ({
          orders: [order, ...state.orders],
        }));

        return order;
      },

      getOrderById: (orderId: string): Order | undefined => {
        return get().orders.find((order) => order.orderId === orderId);
      },

      initDemoOrders: () => {
        const { orders } = get();
        if (orders.length === 0) {
          set({ orders: demoOrders });
        }
      },
    }),
    {
      name: 'catacomb-orders',
    }
  )
);

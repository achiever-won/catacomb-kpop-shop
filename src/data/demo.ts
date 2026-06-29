import { User, ShippingAddress, PaymentInfo, Order, OrderItem } from '../types';
import { products } from './products';

// Demo User
export const demoUser: User = {
  email: 'demo@catacomb.kr',
  name: '홍깡',
  shippingAddress: {
    recipientName: '홍깡',
    street: '테헤란로 123',
    city: '서울특별시 강남구',
    postalCode: '06234',
    phone: '010-1234-5678',
  },
};

export const demoPassword = 'demo1234';

// Demo Address
export const demoAddress: ShippingAddress = {
  recipientName: '홍깡',
  street: '테헤란로 123',
  city: '서울특별시 강남구',
  postalCode: '06234',
  phone: '010-1234-5678',
};

// Demo Card (4111111111111111 passes Luhn check)
export const demoCard: PaymentInfo = {
  cardNumber: '4111111111111111',
  cardholderName: 'Demo User',
  expirationDate: '12/28',
  cvv: '123',
};

// Demo Orders - 3 orders with distinct statuses
function createDemoOrders(): Order[] {
  // Pick some products for demo orders
  const orderProducts = products.filter((p) => p.inStock).slice(0, 8);

  const order1Items: OrderItem[] = [
    {
      productId: orderProducts[0].id,
      productName: orderProducts[0].name,
      quantity: 2,
      unitPrice: orderProducts[0].price,
      subtotal: orderProducts[0].price * 2,
    },
    {
      productId: orderProducts[1].id,
      productName: orderProducts[1].name,
      quantity: 1,
      unitPrice: orderProducts[1].price,
      subtotal: orderProducts[1].price,
    },
  ];

  const order2Items: OrderItem[] = [
    {
      productId: orderProducts[2].id,
      productName: orderProducts[2].name,
      quantity: 1,
      unitPrice: orderProducts[2].price,
      subtotal: orderProducts[2].price,
    },
    {
      productId: orderProducts[3].id,
      productName: orderProducts[3].name,
      quantity: 3,
      unitPrice: orderProducts[3].price,
      subtotal: orderProducts[3].price * 3,
    },
    {
      productId: orderProducts[4].id,
      productName: orderProducts[4].name,
      quantity: 1,
      unitPrice: orderProducts[4].price,
      subtotal: orderProducts[4].price,
    },
  ];

  const order3Items: OrderItem[] = [
    {
      productId: orderProducts[5].id,
      productName: orderProducts[5].name,
      quantity: 1,
      unitPrice: orderProducts[5].price,
      subtotal: orderProducts[5].price,
    },
    {
      productId: orderProducts[6].id,
      productName: orderProducts[6].name,
      quantity: 2,
      unitPrice: orderProducts[6].price,
      subtotal: orderProducts[6].price * 2,
    },
  ];

  const shippingFee = 3000;

  const order1Total = order1Items.reduce((sum, item) => sum + item.subtotal, 0) + shippingFee;
  const order2Total = order2Items.reduce((sum, item) => sum + item.subtotal, 0) + shippingFee;
  const order3Total = order3Items.reduce((sum, item) => sum + item.subtotal, 0) + shippingFee;

  return [
    {
      orderId: 'ORD-20241201-00001',
      items: order1Items,
      shippingAddress: demoAddress,
      totalAmount: order1Total,
      shippingFee,
      orderDate: '2024-12-01T09:30:00.000Z',
      estimatedDelivery: '2024-12-05T09:30:00.000Z',
      status: '배송준비중',
    },
    {
      orderId: 'ORD-20241115-00002',
      items: order2Items,
      shippingAddress: demoAddress,
      totalAmount: order2Total,
      shippingFee,
      orderDate: '2024-11-15T14:00:00.000Z',
      estimatedDelivery: '2024-11-20T14:00:00.000Z',
      status: '배송중',
    },
    {
      orderId: 'ORD-20241020-00003',
      items: order3Items,
      shippingAddress: demoAddress,
      totalAmount: order3Total,
      shippingFee,
      orderDate: '2024-10-20T11:15:00.000Z',
      estimatedDelivery: '2024-10-24T11:15:00.000Z',
      status: '배송완료',
    },
  ];
}

export const demoOrders: Order[] = createDemoOrders();

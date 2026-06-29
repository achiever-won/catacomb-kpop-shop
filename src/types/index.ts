// Product domain

export interface Product {
  id: string;                    // e.g., "kpop-album-001"
  name: string;                  // max 100 chars, Korean/English mix
  description: string;           // product description
  price: number;                 // integer, KRW (no decimals)
  imageUrl: string;              // placeholder image path
  mainCategory: 'K-POP Goods' | 'K-WEBTOON Goods';
  subCategory: string;           // e.g., "Albums", "Photocards"
  inStock: boolean;              // true = 재고 있음, false = 품절
  createdAt: string;             // ISO date for "newest first" sort
}

export interface Category {
  name: string;                  // "K-POP Goods" or "K-WEBTOON Goods"
  subCategories: string[];       // ["Albums", "Photocards", ...]
}

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'newest';

export interface PaginatedResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

// Cart domain

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;              // 1-99
}

// User domain

export interface User {
  email: string;                 // max 254 chars
  name: string;                  // max 50 chars
  shippingAddress: ShippingAddress;
}

export interface ShippingAddress {
  recipientName: string;
  street: string;
  city: string;
  postalCode: string;
  phone: string;
  deliveryNotes?: string;
}

export interface RegistrationData {
  email: string;
  password: string;              // 8-64 chars
  name: string;
  shippingAddress: ShippingAddress;
}

// Payment domain

export interface PaymentInfo {
  cardNumber: string;            // 16 digits
  cardholderName: string;        // max 50 chars
  expirationDate: string;        // MM/YY format
  cvv: string;                   // 3 digits
}

// Order domain

export interface Order {
  orderId: string;               // "ORD-YYYYMMDD-XXXXX"
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;           // KRW including shipping
  shippingFee: number;           // ₩3,000
  orderDate: string;             // ISO date
  estimatedDelivery: string;     // ISO date (3-5 business days)
  status: OrderStatus;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type OrderStatus = '배송준비중' | '배송중' | '배송완료' | '주문취소';

// Validation results

export interface LoginResult {
  success: boolean;
  error?: string;
}

export interface RegistrationResult {
  success: boolean;
  errors?: Record<string, string>;
}

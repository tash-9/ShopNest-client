export interface User {
  _id: string;
  email: string;
  name: string;
  avatar: string;
  role: "buyer" | "seller" | "admin";
  status: "active" | "blocked";
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  tags: string[];
  specifications: Record<string, string>;
  sellerEmail: string;
  sellerName: string;
  sellerId: string;
  status: string;
  createdAt: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  buyerEmail: string;
  buyerName: string;
  buyerId: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
}

export interface CartItem extends OrderItem {
  product?: Product;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

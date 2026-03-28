// ─── Product ─────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock?: number;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;          // cart-item id
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  isConfirmed: boolean;
}

// ─── Order ────────────────────────────────────────────────────────────────────
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';

export interface Order {
  id: string;
  memberId?: string;
  memberEmail?: string;
  memberName?: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
}

// ─── Member ───────────────────────────────────────────────────────────────────
export interface Member {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: 'Member' | 'Admin';

}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface LoginResponse {
  token: string;
  user: Member;
}

export interface RegisterPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

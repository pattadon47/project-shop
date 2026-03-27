import axios from 'axios';
import type { Product, Cart, Order, Member, LoginResponse, RegisterPayload } from '../types';

// ─── Base axios instance ───────────────────────────────────────────────────────
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach JWT from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCT SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const productService = {
  /** GET /products — ดูสินค้าทั้งหมด [Member+Admin] */
  getAll: (): Promise<Product[]> =>
    api.get('/products').then((r) => r.data),

  /** GET /products/:id — ดูข้อมูลสินค้าแต่ละชิ้น [Member+Admin] */
  getById: (id: string): Promise<Product> =>
    api.get(`/products/${id}`).then((r) => r.data),

  /** POST /products — เพิ่มสินค้า [Admin] */
  create: (data: Omit<Product, 'id'>): Promise<Product> =>
    api.post('/products', data).then((r) => r.data),

  /** PUT /products/:id — แก้ไขสินค้า [Admin] */
  update: (id: string, data: Partial<Omit<Product, 'id'>>): Promise<Product> =>
    api.put(`/products/${id}`, data).then((r) => r.data),

  /** DELETE /products/:id — ลบสินค้า [Admin] */
  delete: (id: string): Promise<void> =>
    api.delete(`/products/${id}`).then(() => undefined),
};

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const authService = {
  /** POST /auth/login — เข้าใช้ระบบ [Member+Admin] */
  login: (email: string, password: string): Promise<LoginResponse> =>
    api.post('/auth/login', { email, password }).then((r) => r.data),

  /** POST /auth/register — สมัครสมาชิก [Public] */
  register: (payload: RegisterPayload): Promise<LoginResponse> =>
    api.post('/auth/register', payload).then((r) => r.data),
};

// ═══════════════════════════════════════════════════════════════════════════════
// MEMBER SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const memberService = {
  /** GET /members/me — ดูโปรไฟล์ตัวเอง [Member] */
  getProfile: (): Promise<Member> =>
    api.get('/members/me').then((r) => r.data),

  /** PUT /members/me — แก้ไขข้อมูลสมาชิก [Member] */
  updateProfile: (data: { firstname: string; lastname: string }): Promise<Member> =>
    api.put('/members/me', data).then((r) => r.data),

  /** GET /members — ดูสมาชิกทั้งหมด [Admin] */
  getAll: (): Promise<Member[]> =>
    api.get('/members').then((r) => r.data),

  /** PATCH /members/:id/status — เปลี่ยน status active/inactive [Admin] */
  changeStatus: (id: string, status: 'active' | 'inactive'): Promise<Member> =>
    api.patch(`/members/${id}/status`, { status }).then((r) => r.data),

  /** PATCH /members/:id/role — เปลี่ยน role Member/Admin [Admin] */
  changeRole: (id: string, role: 'Member' | 'Admin'): Promise<Member> =>
    api.patch(`/members/${id}/role`, { role }).then((r) => r.data),
};

// ═══════════════════════════════════════════════════════════════════════════════
// CART SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const cartService = {
  /** GET /cart — ดูตะกร้าของตัวเอง [Member] */
  getCart: (): Promise<Cart> =>
    api.get('/cart').then((r) => r.data),

  /** POST /cart/items — เพิ่มสินค้าลงตะกร้า [Member] */
  addItem: (productId: string, quantity: number): Promise<Cart> =>
    api.post('/cart/items', { productId, quantity }).then((r) => r.data),

  /** DELETE /cart/items/:itemId — ลบสินค้ารายการเดียว [Member] */
  removeItem: (itemId: string): Promise<Cart> =>
    api.delete(`/cart/items/${itemId}`).then((r) => r.data),

  /** DELETE /cart — ล้างตะกร้าสินค้าทั้งหมด [Member] */
  clearCart: (): Promise<void> =>
    api.delete('/cart').then(() => undefined),
};

// ═══════════════════════════════════════════════════════════════════════════════
// ORDER SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const orderService = {
  /** POST /orders — ยืนยันสั่งซื้อ (ซื้อสินค้า) [Member] */
  confirmOrder: (): Promise<Order> =>
    api.post('/orders').then((r) => r.data),

  /** GET /orders/me — ดูรายการซื้อทั้งหมดของตัวเอง [Member] */
  getMyOrders: (): Promise<Order[]> =>
    api.get('/orders/me').then((r) => r.data),

  /** GET /orders/:id — ดูรายละเอียดการซื้อแต่ละครั้ง [Member+Admin] */
  getById: (id: string): Promise<Order> =>
    api.get(`/orders/${id}`).then((r) => r.data),

  /** GET /orders — ดูรายการซื้อทั้งหมด (ทุก member) [Admin] */
  getAll: (): Promise<Order[]> =>
    api.get('/orders').then((r) => r.data),

  /** GET /orders/member/:memberId — ดูรายการซื้อของ member คนนั้น [Admin] */
  getMemberOrders: (memberId: string): Promise<Order[]> =>
    api.get(`/orders/member/${memberId}`).then((r) => r.data),
};

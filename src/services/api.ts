import axios from 'axios';

// ─── Base instance — ใช้ relative URL (Vite proxy → localhost:3000) ───────────
const api = axios.create({
  baseURL: '',
  withCredentials: true,          // ส่ง cookie ทุก request
  headers: { 'Content-Type': 'application/json' },
});

export default api;

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCT SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const productService = {
  /** GET /products */
  getAll: () => api.get('/products').then(r => r.data),
  /** GET /products/featured */
  getFeatured: () => api.get('/products/featured').then(r => r.data),
  /** GET /products/pdtypes */
  getAllTypes: () => api.get('/products/pdtypes').then(r => r.data),

  /** GET /products/:id */
  getById: (id: string) => api.get(`/products/${id}`).then(r => r.data),
  /** GET /products/search/:keyword */
  search: (keyword: string) => api.get(`/products/search/${keyword}`).then(r => r.data),
  /** POST /products — Admin */
  create: (data: { pdId: string; pdName: string; pdPrice: number; pdTypeId: string }) =>
    api.post('/products', data).then(r => r.data),
  /** PUT /products/:id — Admin, multipart/form-data */
  update: (id: string, formData: FormData) =>
    api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  /** DELETE /products/:id — Admin */
  delete: (id: string) => api.delete(`/products/${id}`).then(r => r.data),
};

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const authService = {
  /** POST /members/login  body: { loginName, password } */
  login: (loginName: string, password: string) =>
    api.post('/members/login', { loginName, password }).then(r => r.data),
  /** POST /members/register  body: { memEmail, memName, password } */
  register: (payload: { memEmail: string; memName: string; password: string }) =>
    api.post('/members/register', payload).then(r => r.data),
  /** POST /members/logout */
  logout: () => api.post('/members/logout').then(r => r.data),
  /** GET /members/detail — ตรวจสอบ session จาก cookie */
  getProfile: () => api.get('/members/detail').then(r => r.data),
};

// ═══════════════════════════════════════════════════════════════════════════════
// MEMBER SERVICE (Admin)
// ═══════════════════════════════════════════════════════════════════════════════
export const memberService = {
  /** GET /members — Admin */
  getAll: () => api.get('/members').then(r => r.data),
  /** PUT /members/profile — multipart/form-data */
  updateProfile: (formData: FormData) =>
    api.put('/members/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  /** PUT /members/role — Admin  body: { memEmail, dutyId } */
  changeRole: (memEmail: string, dutyId: 'admin' | 'member') =>
    api.put('/members/role', { memEmail, dutyId }).then(r => r.data),
};

// ═══════════════════════════════════════════════════════════════════════════════
// CART SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const cartService = {
  /** POST /carts/chkcart — ตรวจสอบตะกร้าที่ active */
  checkCart: () => api.post('/carts/chkcart').then(r => r.data),
  /** POST /carts/addcart — สร้างตะกร้าใหม่ */
  createCart: () => api.post('/carts/addcart').then(r => r.data),
  /** POST /carts/addcartdtl — เพิ่มสินค้าลงตะกร้า */
  addItem: (cartId: string, pdId: string) =>
    api.post('/carts/addcartdtl', { cartId, pdId }).then(r => r.data),
  /** GET /carts/getcartdtl/:id — ดึงรายการสินค้าในตะกร้า */
  getCartDetail: (cartId: string) => api.get(`/carts/getcartdtl/${cartId}`).then(r => r.data),
  /** GET /carts/getcart/:id — ดึง header ตะกร้า */
  getCartHeader: (cartId: string) => api.get(`/carts/getcart/${cartId}`).then(r => r.data),
  /** DELETE /carts/delcartdtl — ลบสินค้าออกจากตะกร้า */
  removeItem: (cartId: string, pdId: string) =>
    api.delete('/carts/delcartdtl', { data: { cartId, pdId } }).then(r => r.data),
  /** DELETE /carts/delcart — ลบตะกร้าทั้งหมด */
  deleteCart: (cartId: string) =>
    api.delete('/carts/delcart', { data: { cartId } }).then(r => r.data),
  /** PUT /carts/updateqtydtl/:cartId/:pdId — อัปเดตจำนวนสินค้า */
  updateQty: (cartId: string, pdId: string, qty: number) =>
    api.put(`/carts/updateqtydtl/${cartId}/${pdId}`, { qty }).then(r => r.data),
  /** POST /carts/confirm/:id — ยืนยันตะกร้า */
  confirmCart: (cartId: string) => api.post(`/carts/confirm/${cartId}`).then(r => r.data),
  /** GET /carts/history — ประวัติคำสั่งซื้อของ member */
  getHistory: () => api.get('/carts/history').then(r => r.data),
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN SERVICE
// ═══════════════════════════════════════════════════════════════════════════════
export const adminService = {
  /** GET /admin/orders — ดึงคำสั่งซื้อทั้งหมด */
  getAllOrders: () => api.get('/admin/orders').then(r => r.data),
  /** POST /admin/history — ดูประวัติตาม email */
  getOrdersByEmail: (targetEmail: string) =>
    api.post('/admin/history', { targetEmail }).then(r => r.data),
};

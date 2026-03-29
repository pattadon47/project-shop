
export interface ProductType {
  pdTypeId: string;
  pdTypeName: string;
}

export interface Product {
  pdId: string;
  pdName: string;
  pdPrice: number;
  pdRemark: string | null;
  pdTypeId: string;
  pdt?: ProductType;
  pd_image_url?: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartHeader {
  cartId: string;
  cusId: string;
  cartDate: string;
  cartCf: boolean;
  sqty: number | null;
  sprice: number | null;
}

export interface CartDetailItem {
  row_number: number;
  pdId: string;
  pdName: string;
  qty: number;
  price: number;
}

// ─── Order / History ──────────────────────────────────────────────────────────
export interface OrderHistory {
  cartId: string;
  itemCount: number;
  totalPrice: number;
}

export interface AdminOrder {
  cartId: string;
  memEmail: string;
  itemCount: number;
  totalPrice: number;
}

// ─── Member / Auth ────────────────────────────────────────────────────────────
export interface User {
  memEmail: string;
  memName: string;
  dutyId: 'admin' | 'member';
}

export interface RegisterPayload {
  memEmail: string;
  memName: string;
  password: string;
}

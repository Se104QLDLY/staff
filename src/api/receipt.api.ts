import axiosClient from './axiosClient';
// Import types from export.api.ts
import { type Item, type PaginatedItems } from './export.api';

// Kiểu dữ liệu cho phiếu xuất (receipt)
export interface Receipt {
  receipt_id: number;
  receipt_date: string;
  agency_id: number;
  agency_name: string;
  user_id: number;
  user_name: string;
  total_amount: number;
  paid_amount?: number;
  status: string;
  created_at: string;
  updated_at?: string;
  item_count?: number; // Số lượng sản phẩm khác nhau
  details?: Array<{
    receipt_detail_id: number;
    item: number;
    item_name: string;
    quantity: number;
    unit_price: string;
    line_total: string;
  }>;
}

export interface PaginatedReceipts {
  count: number;
  next: string | null;
  previous: string | null;
  results: Receipt[];
}

export interface ReceiptApi {
  /** Lấy danh sách receipts với phân trang và filter theo agency */
  getReceipts: (params?: { agency_id?: number; limit?: number; offset?: number; search?: string }) => Promise<PaginatedReceipts>;
  /** Tạo mới một receipt từ issue */
  createReceipt: (payload: { agency_id: number; receipt_date: string; items: { item_id: number; quantity: number; unit_price: number }[] }) => Promise<Receipt>;
  getReceiptById: (id: number) => Promise<Receipt>;
  /** Cập nhật một receipt */
  updateReceipt: (id: number, payload: { receipt_date: string; items: { item_id: number; quantity: number; unit_price: number }[] }) => Promise<Receipt>;
  /** Xóa một receipt */
  deleteReceipt: (id: number) => Promise<void>;
  /** Lấy danh sách items */
  getItems: (params?: { limit?: number; offset?: number; search?: string }) => Promise<PaginatedItems>;
}

export const receiptApi: ReceiptApi = {
  getReceipts: async (params) => {
    const response = await axiosClient.get<PaginatedReceipts>('/inventory/receipts/', { params });
    return response.data;
  },
  createReceipt: async (payload) => {
    const response = await axiosClient.post<Receipt>('/inventory/receipts/', payload);
    return response.data;
  },
  getReceiptById: async (id: number): Promise<Receipt> => {
    const response = await axiosClient.get<Receipt>(`/inventory/receipts/${id}/`);
    return response.data;
  },
  updateReceipt: async (id: number, payload) => {
    const response = await axiosClient.put<Receipt>(`/inventory/receipts/${id}/`, payload);
    return response.data;
  },
  deleteReceipt: async (id: number) => {
    await axiosClient.delete(`/inventory/receipts/${id}/`);
  },
  getItems: async (params) => {
    const response = await axiosClient.get<PaginatedItems>('/inventory/items/', { params });
    return response.data;
  },
};

// Hàm tiện ích cho backward compatibility
export const getReceipts = receiptApi.getReceipts;
export const createReceipt = receiptApi.createReceipt;
export const getReceiptById = receiptApi.getReceiptById;
export const updateReceipt = receiptApi.updateReceipt;
export const deleteReceipt = receiptApi.deleteReceipt;
export const getItems = receiptApi.getItems;
import axiosClient from './axiosClient';

export interface ReceiptItem {
  receipt_id: number;
  receipt_date: string;
  agency_id: number;
  agency_name: string;
  user_id: number;
  user_name: string;
  total_amount: string; // string hoặc number
  status: string;
  status_reason?: string;
}

/**
 * Lấy danh sách phiếu nhập
 * @returns Promise<ReceiptItem[]>
 */
export const fetchReceipts = async (): Promise<ReceiptItem[]> => {
  const { data } = await axiosClient.get<ReceiptItem[]>('/inventory/receipts/');
  return data;
};

/**
 * Xóa một phiếu nhập theo ID
 */
export const deleteReceipt = async (id: number): Promise<void> => {
  await axiosClient.delete(`/inventory/receipts/${id}/`);
}; 
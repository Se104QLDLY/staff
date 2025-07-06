import axiosClient from './axiosClient';

export interface PaymentItem {
  payment_id: number;
  payment_date: string;
  agency_id: number;
  agency_name: string;
  user_id: number;
  user_name: string;
  amount_collected: string;
  status: string;
  status_reason?: string;
}

// Định nghĩa kiểu response phân trang cho payment
interface PaginatedPayments {
  count: number;
  next: string | null;
  previous: string | null;
  results: PaymentItem[];
}

/**
 * Lấy danh sách phiếu thu
 */
export const fetchPayments = async (): Promise<PaymentItem[]> => {
  const { data } = await axiosClient.get<PaginatedPayments>('/finance/payments/');
  return data.results;
};

/**
 * Xóa một phiếu thu theo ID
 */
export const deletePayment = async (id: number): Promise<void> => {
  await axiosClient.delete(`/finance/payments/${id}/`);
};

/**
 * Cập nhật trạng thái thanh toán
 */
export const updatePaymentStatus = async (id: number, status: 'pending' | 'completed' | 'failed'): Promise<void> => {
  await axiosClient.patch(`/finance/payments/${id}/status/`, { status });
};

// Tạo phiếu thu mới
export const createPayment = async (
  payload: { agency_id: number; payment_date: string; amount_collected: number }
): Promise<PaymentItem> => {
  const { data } = await axiosClient.post<PaymentItem>('/finance/payments/', payload);
  return data;
};

/**
 * Lấy chi tiết một phiếu thu theo ID
 */
export const getPaymentById = async (id: number): Promise<PaymentItem> => {
  const { data } = await axiosClient.get<PaymentItem>(`/finance/payments/${id}/`);
  return data;
};

/**
 * Cập nhật một phiếu thu theo ID
 */
export const updatePayment = async (id: number, payload: Partial<PaymentItem>): Promise<PaymentItem> => {
  const { data } = await axiosClient.patch<PaymentItem>(`/finance/payments/${id}/`, payload);
  return data;
}; 
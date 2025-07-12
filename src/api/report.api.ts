import axiosClient from './axiosClient';

// ======================================================================================
// REPORT API (Staff) - reuse backend endpoints
// ======================================================================================

export interface SalesReportParams {
  from?: string;
  to?: string;
  agency_id?: number;
}

export interface DebtReportParams {
  agency_id?: number;
}

export interface SalesReportItem {
  month: string;
  total_revenue: number;
  total_issues: number;
  new_debt_generated: number;
}

export interface DebtReportData {
  agency_id: number;
  agency_name: string;
  total_debt: number;
  debt_beginning?: number;
  debt_incurred?: number;
  debt_paid?: number;
  debt_ending?: number;
}

export interface ReportGenerateParams {
  report_type: 'sales' | 'debt' | 'inventory';
  start_date: string;
  end_date: string;
  agency_id?: number;
}

export interface AgencyOption {
  agency_id: number;
  agency_name: string;
}

export interface ReportDetail {
  report_id: number;
  report_type: 'sales' | 'debt' | 'inventory';
  report_date: string;
  data: ReportData;
  created_by: number;
  created_at: string;
}

export interface ReportData {
  sales?: SalesData[];
  summary?: DebtData[];
  items?: InventoryData[];
  total_items?: number;
  total_value?: number;
}

export interface SalesData {
  agency_id: number;
  agency_name: string;
  total_sales: number;
  total_issues: number;
}

export interface DebtData {
  agency_id: number;
  agency_name: string;
  debt_incurred: number;
  debt_paid: number;
}

export interface InventoryData {
  item_id: number;
  item_name: string;
  unit_name: string;
  stock_quantity: number;
  price: number;
  total_value: number;
}

/**
 * API để lấy báo cáo doanh số
 * @param params - Các tham số filter (from, to, agency_id)
 * @returns - Mảng dữ liệu báo cáo doanh số
 */
export const getSalesReport = async (params: SalesReportParams) => {
  const { data } = await axiosClient.get('/finance/debts/sales/', { params });
  return data;
};

/**
 * API để lấy báo cáo công nợ
 * @param params - Tham số filter (agency_id)
 * @returns - Dữ liệu báo cáo công nợ
 */
export const getDebtReport = async (params: DebtReportParams) => {
  const { data } = await axiosClient.get('/finance/debts/aging/', { params });
  return data;
};

/**
 * API để tạo báo cáo mới
 * @param params - Tham số tạo báo cáo
 * @returns - Dữ liệu báo cáo đã tạo
 */
export const generateReport = async (params: ReportGenerateParams) => {
  const { data } = await axiosClient.post('/finance/reports/generate/', params);
  return data;
};

/**
 * API để lấy danh sách đại lý cho dropdown
 * @returns - Mảng các đại lý
 */
export const getAgencies = async (): Promise<AgencyOption[]> => {
  const { data } = await axiosClient.get('/finance/reports/agencies/');
  return data;
};

/**
 * API để xuất báo cáo Excel
 * @param reportId - ID báo cáo
 * @returns - File Excel
 */
export const exportReportExcel = async (reportId: number) => {
  const response = await axiosClient.get(`/finance/reports/${reportId}/export_excel/`, {
    responseType: 'blob'
  });
  return response.data;
};

/**
 * API để xuất báo cáo PDF
 * @param reportId - ID báo cáo
 * @returns - File PDF
 */
export const exportReportPDF = async (reportId: number) => {
  const response = await axiosClient.get(`/finance/reports/${reportId}/export_pdf/`, {
    responseType: 'blob'
  });
  return response.data;
};

/**
 * API để lấy chi tiết báo cáo theo ID
 * @param reportId - ID báo cáo
 * @returns - Chi tiết báo cáo
 */
export const getReportDetail = async (reportId: number) => {
  const { data } = await axiosClient.get(`/finance/reports/${reportId}/`);
  return data;
}; 
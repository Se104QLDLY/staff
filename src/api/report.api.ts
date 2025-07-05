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
  aging_buckets?: {
    '0-30': { count: number; amount: number };
    '31-60': { count: number; amount: number };
    '61-90': { count: number; amount: number };
    '90+': { count: number; amount: number };
  };
}

export const getSalesReport = async (params: SalesReportParams) => {
  const { data } = await axiosClient.get<SalesReportItem[]>('/finance/debts/sales/', { params });
  return data;
};

export const getDebtReport = async (params: DebtReportParams) => {
  const { data } = await axiosClient.get<DebtReportData>('/finance/debts/aging/', { params });
  return data;
}; 
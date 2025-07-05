import axiosClient from './axiosClient';

export interface Issue {
  issue_id: number;
  issue_date: string;
  agency_id: number;
  agency_name: string;
  user_id: number;
  user_name: string;
  total_amount: number;
  paid_amount: number;
  status: string;
  created_at: string;
  updated_at?: string;
  debt_impact?: {
    previous_debt: number;
    issue_amount: number;
    new_debt: number;
  };
  details?: Array<{
    issue_detail_id: number;
    item: number;
    item_name: string;
    quantity: number;
    unit_price: string;
    line_total: string;
  }>;
}


export interface Item {
  item_id: number;
  item_name: string;
  unit: number;
  unit_name: string;
  price: string;
  stock_quantity: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedIssues {
  count: number;
  next: string | null;
  previous: string | null;
  results: Issue[];
}

export interface PaginatedItems {
  count: number;
  next: string | null;
  previous: string | null;
  results: Item[];
}

export interface CreateIssueRequest {
  agency_id: number;
  issue_date: string;
  paid_amount?: number;
  items: {
    item_id: number;
    quantity: number;
    unit_price: number;
  }[];
}

export interface ExportApi {
  getIssues: () => Promise<PaginatedIssues>;
  getIssueById: (id: number) => Promise<Issue>;
  createIssue: (payload: CreateIssueRequest) => Promise<Issue>;
  updateIssue: (id: number, payload: Partial<Issue>) => Promise<Issue>;
  updateIssueStatus: (id: number, status: string, reason?: string) => Promise<Issue>;
  deleteIssue: (id: number) => Promise<void>;
  getItems: (params?: {
    limit?: number;
    offset?: number;
    search?: string;
  }) => Promise<PaginatedItems>;
  getItemById: (id: number) => Promise<Item>;
}

export const exportApi: ExportApi = {
  // Get all issues
  getIssues: async (): Promise<PaginatedIssues> => {
    const response = await axiosClient.get<PaginatedIssues>('/inventory/issues/');
    return response.data;
  },

  // Get issue by ID
  getIssueById: async (id: number): Promise<Issue> => {
    const response = await axiosClient.get<Issue>(`/inventory/issues/${id}/`);
    return response.data;
  },

  // Create new issue
  createIssue: async (payload: CreateIssueRequest): Promise<Issue> => {
    const response = await axiosClient.post<Issue>('/inventory/issues/', payload);
    return response.data;
  },

  // Update issue
  updateIssue: async (id: number, payload: Partial<Issue>): Promise<Issue> => {
    const response = await axiosClient.put<Issue>(`/inventory/issues/${id}/`, payload);
    return response.data;
  },

  // Update issue status (confirm, postpone, cancel)
  updateIssueStatus: async (id: number, status: string, reason?: string): Promise<Issue> => {
    const response = await axiosClient.patch<Issue>(`/inventory/issues/${id}/status/`, {
      status,
      status_reason: reason
    });
    return response.data;
  },

  // Delete issue
  deleteIssue: async (id: number): Promise<void> => {
    await axiosClient.delete(`/inventory/issues/${id}/`);
  },

  // Get all items for selection
  getItems: async (params?: {
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<PaginatedItems> => {
    const response = await axiosClient.get<PaginatedItems>('/inventory/items/', { params });
    return response.data;
  },

  getItemById: async (id: number): Promise<Item> => {
    const response = await axiosClient.get<Item>(`/inventory/items/${id}/`);
    return response.data;
  },
};

// Legacy exports for backward compatibility
export const getIssues = exportApi.getIssues;
export const getIssueById = exportApi.getIssueById;
export const createIssue = exportApi.createIssue;
export const updateIssue = exportApi.updateIssue;
export const updateIssueStatus = exportApi.updateIssueStatus;
export const deleteIssue = exportApi.deleteIssue;
export const getItems = exportApi.getItems;
export const getItemById = exportApi.getItemById; 
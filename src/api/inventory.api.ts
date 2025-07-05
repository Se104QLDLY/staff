import axiosClient from './axiosClient';

export interface Item {
  item_id: number;
  item_name: string;
  unit: number;
  unit_name: string;
  price: number;
  stock_quantity: number;
}

export interface PaginatedItems {
  count: number;
  next: string | null;
  previous: string | null;
  results: Item[];
}

export const getItems = async (): Promise<Item[]> => {
  const response = await axiosClient.get<PaginatedItems>('/inventory/items/');
  return response.data.results;
};

export const updateItem = async (id: number, payload: { stock_quantity: number }): Promise<Item> => {
  const response = await axiosClient.patch<Item>(`/inventory/items/${id}/`, payload);
  return response.data;
}; 
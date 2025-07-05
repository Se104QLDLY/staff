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
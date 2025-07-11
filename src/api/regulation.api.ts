// File này được copy từ Frontend/Admin/src/api/regulation.api.ts để staff có thể dùng API quy định
// Nếu muốn dùng chung, nên chuyển sang shared trong tương lai

import axiosClient from './axiosClient';

export interface Regulation {
  regulation_key: string;
  regulation_value: string;
  description: string;
  updated_at: string;
  last_updated_by: number | null;
  last_updated_by_name: string | null;
}

export const getRegulations = async (): Promise<Regulation[]> => {
  const res = await axiosClient.get('/regulation/');
  return res.data;
};

export const getRegulationDetail = async (key: string): Promise<Regulation> => {
  const res = await axiosClient.get(`/regulation/${key}/`);
  return res.data;
}; 
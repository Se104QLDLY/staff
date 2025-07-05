import axiosClient from './axiosClient';

// Individual function exports
export const getAgencies = async (): Promise<any> => {
  const response = await axiosClient.get('/agency/');
  return response.data;
};

// Get a single agency by ID
export const getAgencyById = async (id: number): Promise<any> => {
  const response = await axiosClient.get(`/agency/${id}/`);
  return response.data;
};

// Create a new agency
export const createAgency = async (payload: any): Promise<any> => {
  const response = await axiosClient.post('/agency/', payload);
  return response.data;
};

// Update an existing agency
export const updateAgency = async (id: number, payload: any): Promise<any> => {
  const response = await axiosClient.patch(`/agency/${id}/`, payload);
  return response.data;
};

// Fetch all agency types (paginated)
export const getAgencyTypes = async (): Promise<any[]> => {
  const response = await axiosClient.get('/agency-types/');
  return response.data.results;
};

// Fetch all districts (paginated)
export const getDistricts = async (): Promise<any[]> => {
  const response = await axiosClient.get('/districts/');
  return response.data.results;
};

// Export agencyApi object for consistent usage
export const agencyApi = {
  getAgencies,
  getAgencyById,
  createAgency,
  updateAgency,
  getAgencyTypes,
  getDistricts,
}; 
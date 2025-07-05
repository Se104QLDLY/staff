import axiosClient from './axiosClient';

// Kiểu dữ liệu đại lý cơ bản cho staff view
export interface StaffAgencyAssignment {
  staff_id: number;
  agency_count: number;
  agencies: Array<{
    id: number;
    code: string;
    name: string;
    type: string;
    type_id: number;
    district: string;
    district_id: number;
    address: string;
    phone: string;
    email: string;
    current_debt: string;
    debt_limit: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }>;
}

// Kiểu thông tin agency cho phần staff view
export interface AgencyInfo {
  agency_id: number;
  agency_name: string;
  address: string;
  phone_number: string;
  email: string;
  debt_amount: number;
}

/**
 * Lấy danh sách agency staff được phân công
 * @param staffId - ID của staff
 * @returns Danh sách agencies (agency_id và agency_name)
 */
export const fetchAssignedAgencies = async (staffId: number): Promise<AgencyInfo[]> => {
  const { data } = await axiosClient.get<StaffAgencyAssignment>('/staff-agency/by_staff/', {
    params: { staff_id: staffId }
  });
  return data.agencies.map(a => ({
    agency_id: a.id,
    agency_name: a.name,
    address: a.address,
    phone_number: a.phone,
    email: a.email,
    debt_amount: parseFloat(a.current_debt)
  }));
}; 
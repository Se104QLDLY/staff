import { useState, useEffect } from 'react';
import type { ReactNode, MouseEventHandler } from 'react';
import { useParams } from 'react-router-dom';
import { getAgencyById } from '../../api/agency.api';
// In a real app, you would use: import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Users, BadgeCheck, Edit, ArrowLeft, Info, Phone, Mail, Building, MapPin, User, Calendar, Clock, DollarSign } from 'lucide-react';

type DashboardLayoutProps = { children: ReactNode };
const DashboardLayout = ({ children }: DashboardLayoutProps) => (
    <div>
        {/* You could have a navbar or sidebar here */}
        <main>{children}</main>
    </div>
);

type LinkProps = { to: string; children: ReactNode; className?: string };
const Link = ({ to, children, className }: LinkProps) => <a href={to} className={className}>{children}</a>;


// --- Main Component ---

interface Agency {
  agency_id: number;
  agency_name: string;
  agency_type: {
    agency_type_id: number;
    type_name: string;
    max_debt: number;
    description?: string;
  };
  district: {
    district_id: number;
    district_name: string;
    city_name?: string;
    max_agencies: number;
  };
  address: string;
  phone_number: string;
  email?: string;
  representative?: string;
  reception_date: string;
  debt_amount: number;
  created_at: string;
  updated_at: string;
  user_id?: number;
}

// --- Helper Functions for Styling ---

const getStatusChipStyle = (status: string) => {
    switch (status) {
        case 'Hoạt động':
            return 'bg-green-100 text-green-700 ring-1 ring-inset ring-green-600/20';
        case 'Tạm dừng':
            return 'bg-yellow-100 text-yellow-700 ring-1 ring-inset ring-yellow-600/20';
        case 'Ngừng hợp tác':
            return 'bg-red-100 text-red-700 ring-1 ring-inset ring-red-600/20';
        default:
            return 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/20';
    }
};

const getAgencyTypeChipStyle = (typeName: string) => {
    switch (typeName) {
        case 'Cấp 1':
            return 'bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-600/20';
        case 'Cấp 2':
            return 'bg-indigo-100 text-indigo-700 ring-1 ring-inset ring-indigo-600/20';
        case 'Cấp 3':
            return 'bg-purple-100 text-purple-700 ring-1 ring-inset ring-purple-600/20';
        default:
            return 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/20';
    }
};

// --- Reusable Components ---
type InfoFieldProps = {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
};
const InfoField = ({ label, value, icon, className = '' }: InfoFieldProps) => (
    <div>
        <label className="flex items-center text-sm font-medium text-slate-500 mb-1">
            {icon}
            {label}
        </label>
        <p className={`bg-slate-100 px-4 py-2.5 rounded-lg border border-slate-200/90 text-slate-800 font-semibold ${className}`}>
            {value}
        </p>
    </div>
);

type TabButtonProps = {
  label: string;
  icon?: ReactNode;
  isActive: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};
const TabButton = ({ label, icon, isActive, onClick }: TabButtonProps) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
            isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
        }`}
    >
        {icon}
        {label}
    </button>
);


// --- ViewAgencyPage Component ---

const ViewAgencyPage = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('overview');
    const [agencyData, setAgencyData] = useState<Agency | null>(null);
    useEffect(() => {
      getAgencyById(Number(id)).then(data => setAgencyData(data)).catch(console.error);
    }, [id]);
    if (!agencyData) return <div>Loading...</div>;
    
    // Real agency data
    const agency: Agency = agencyData;
    
    const debtPercentage = ((agency.debt_amount || 0) / (agency.agency_type.max_debt || 1)) * 100;
    const getProgressBarColor = () => {
        if (debtPercentage > 80) return 'bg-red-500';
        if (debtPercentage > 60) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'overview':
            default:
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200/80">
                            <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3"><Info className="h-6 w-6 text-[#007bff]"/>Thông tin cơ bản</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <InfoField label="Tên đại lý" value={agency.agency_name} icon={<Building className="w-4 h-4 mr-2"/>} className="md:col-span-2"/>
                                <InfoField label="Mã đại lý" value={`DL${agency.agency_id.toString().padStart(3, '0')}`} icon={<Building className="w-4 h-4 mr-2"/>} />
                                 <div>
                                     <label className="flex items-center text-sm font-medium text-slate-500 mb-1">
                                        <BadgeCheck className="w-4 h-4 mr-2"/>Loại đại lý
                                    </label>
                                    <span className={`inline-block px-3 py-1.5 rounded-md text-sm font-bold ${getAgencyTypeChipStyle(agency.agency_type.type_name)}`}>{agency.agency_type.type_name}</span>
                                </div>
                                <InfoField label="Địa chỉ" value={agency.address} icon={<MapPin className="w-4 h-4 mr-2"/>} className="md:col-span-2"/>
                                <InfoField label="Quận/Huyện" value={agency.district.district_name} icon={<MapPin className="w-4 h-4 mr-2"/>}/>
                                <InfoField label="Thành phố" value={agency.district.city_name || 'Chưa có thông tin'} icon={<MapPin className="w-4 h-4 mr-2"/>}/>
                                <InfoField label="Người đại diện" value={agency.representative || 'Chưa có thông tin'} icon={<User className="w-4 h-4 mr-2"/>}/>
                                <InfoField label="Ngày tiếp nhận" value={new Date(agency.reception_date).toLocaleDateString('vi-VN')} icon={<Calendar className="w-4 h-4 mr-2"/>}/>
                            </div>
                        </div>
                        
                        {agency.agency_type.description && (
                        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200/80">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><BadgeCheck className="h-6 w-6 text-indigo-600"/>Thông tin loại đại lý</h2>
                            <div className="space-y-3">
                                <InfoField 
                                    label="Mô tả" 
                                    value={agency.agency_type.description} 
                                    icon={<Info className="w-4 h-4 mr-2"/>}
                                />
                                <InfoField 
                                    label="Số đại lý tối đa trong quận" 
                                    value={`${agency.district.max_agencies} đại lý`} 
                                    icon={<Users className="w-4 h-4 mr-2"/>}
                                />
                            </div>
                        </div>
                        )}
                         <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200/80">
                            <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3"><Phone className="h-6 w-6 text-green-600"/>Thông tin liên hệ</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <InfoField label="Số điện thoại" value={<a href={`tel:${agency.phone_number}`} className="text-blue-600 hover:underline">{agency.phone_number}</a>} icon={<Phone className="w-4 h-4 mr-2"/>}/>
                                <InfoField label="Email" value={agency.email ? <a href={`mailto:${agency.email}`} className="text-blue-600 hover:underline">{agency.email}</a> : 'Chưa có thông tin'} icon={<Mail className="w-4 h-4 mr-2"/>}/>
                            </div>
                        </div>
                    </div>
                )
        }
    }

    return (
        <DashboardLayout>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
            <div className="bg-slate-100 font-sans p-4 sm:p-6 lg:p-8 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                         <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0A4A7D] to-[#007bff] flex items-center justify-center shadow-xl shadow-blue-500/20">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">{agency.agency_name}</h1>
                                <p className="text-slate-500 text-base mt-1">Mã đại lý: <span className="font-semibold text-slate-600">DL{agency.agency_id.toString().padStart(3, '0')}</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Link to="/agencies" className="hidden sm:flex items-center justify-center px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold gap-2">
                                <ArrowLeft className="h-4 w-4" /><span>Quay lại</span>
                            </Link>
                             <Link to={`/agencies/edit/${agency.agency_id}`} className="flex items-center justify-center px-4 py-2 bg-[#007bff] text-white rounded-lg hover:bg-[#0A4A7D] transition-colors font-semibold gap-2 shadow-sm">
                                <Edit className="h-4 w-4" /><span>Chỉnh sửa</span>
                            </Link>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Tabs & Main Content */}
                        <div className="lg:col-span-8">
                           {/* Tab Navigation */}
                            <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-lg mb-6">
                                <TabButton label="Tổng quan" icon={<Info className="h-4 w-4" />} isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                            </div>
                            {renderContent()}
                        </div>

                        {/* Right Column: Summaries & Metadata */}
                        <div className="lg:col-span-4 space-y-6">
                           <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200/80">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Trạng thái</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 font-medium">Tình trạng:</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 ${getStatusChipStyle('Hoạt động')}`}>
                                        <BadgeCheck className="h-4 w-4" />
                                        Hoạt động
                                    </span>
                                </div>
                            </div>

                             <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200/80">
                                <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-3"><DollarSign className="h-5 w-5 text-teal-600"/>Tài chính</h3>
                                 <div className="space-y-4">
                                     <div>
                                        <label className="text-sm font-medium text-slate-500">Nợ hiện tại</label>
                                        <p className="text-red-600 font-bold text-xl">{Number(agency.debt_amount).toLocaleString('vi-VN')} VND</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-500">Hạn mức tín dụng</label>
                                        <p className="text-green-700 font-bold text-xl">{Number(agency.agency_type.max_debt).toLocaleString('vi-VN')} VND</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-slate-600">Đã sử dụng:</span>
                                            <span className="font-bold text-slate-800">{debtPercentage.toFixed(1)}%</span>
                                        </div>
                                        <div className="bg-slate-200 rounded-full h-2.5">
                                            <div className={`h-2.5 rounded-full transition-all duration-500 ${getProgressBarColor()}`} style={{ width: `${Math.min(100, debtPercentage)}%` }}></div>
                                        </div>
                                    </div>
                                 </div>
                            </div>
                            
                            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200/80">
                                 <h3 className="text-lg font-bold text-slate-800 mb-4">Thời gian</h3>
                                 <div className="space-y-4">
                                     <div className="flex items-start gap-3"><Calendar className="w-5 h-5 text-slate-400 mt-0.5"/><div><p className="block text-slate-500 font-medium text-sm">Ngày tiếp nhận</p><p className="text-slate-700 font-semibold">{new Date(agency.reception_date).toLocaleDateString('vi-VN')}</p></div></div>
                                     {agency.created_at && <div className="flex items-start gap-3"><Calendar className="w-5 h-5 text-slate-400 mt-0.5"/><div><p className="block text-slate-500 font-medium text-sm">Ngày tạo</p><p className="text-slate-700 font-semibold">{new Date(agency.created_at).toLocaleDateString('vi-VN')}</p></div></div>}
                                     {agency.updated_at && <div className="flex items-start gap-3"><Clock className="w-5 h-5 text-slate-400 mt-0.5"/><div><p className="block text-slate-500 font-medium text-sm">Cập nhật lần cuối</p><p className="text-slate-700 font-semibold">{new Date(agency.updated_at).toLocaleDateString('vi-VN')}</p></div></div>}
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ViewAgencyPage;

import React, { useState, useEffect, ReactNode, MouseEventHandler } from 'react';
import { useParams } from 'react-router-dom';
import { getAgencyById } from '../../api/agency.api';
// In a real app, you would use: import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Users, BadgeCheck, AlertCircle, Edit, ArrowLeft, Info, Phone, Mail, Building, MapPin, User, Calendar, Clock, DollarSign, List, Settings, Trash2, ShieldAlert } from 'lucide-react';

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
  id: string;
  code: string;
  name: string;
  type: {
    id: number;
    name: string;
  };
  district: string;
  address: string;
  phone: string;
  email: string;
  createdDate: string;
  updatedDate: string;
  manager?: string;
  debt?: number;
  creditLimit?: number;
  status: 'Hoạt động' | 'Tạm dừng' | 'Ngừng hợp tác';
  debtHistory: {
    date: string;
    description: string;
    amount: number;
    balance: number;
  }[];
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
    
    const debtPercentage = ((agency.debt || 0) / (agency.creditLimit || 1)) * 100;
    const getProgressBarColor = () => {
        if (debtPercentage > 80) return 'bg-red-500';
        if (debtPercentage > 60) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'debt-history':
                return (
                    <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200/80 animate-fade-in">
                        <h2 className="text-xl font-bold text-slate-800 mb-5">Lịch sử công nợ</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 rounded-l-lg">Ngày</th>
                                        <th scope="col" className="px-6 py-3">Diễn giải</th>
                                        <th scope="col" className="px-6 py-3 text-right">Số tiền (VND)</th>
                                        <th scope="col" className="px-6 py-3 text-right rounded-r-lg">Số dư cuối</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {agency.debtHistory.map((item, index) => (
                                        <tr key={index} className="bg-white border-b last:border-b-0 hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-900">{new Date(item.date).toLocaleDateString('vi-VN')}</td>
                                            <td className="px-6 py-4">{item.description}</td>
                                            <td className={`px-6 py-4 text-right font-semibold ${item.amount > 0 ? 'text-red-600' : 'text-green-600'}`}>{item.amount.toLocaleString('vi-VN')}</td>
                                            <td className="px-6 py-4 text-right font-semibold text-slate-800">{item.balance.toLocaleString('vi-VN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'overview':
            default:
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200/80">
                            <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3"><Info className="h-6 w-6 text-[#007bff]"/>Thông tin cơ bản</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <InfoField label="Tên đại lý" value={agency.name} icon={<Building className="w-4 h-4 mr-2"/>} className="md:col-span-2"/>
                                <InfoField label="Mã đại lý" value={agency.code} icon={<Building className="w-4 h-4 mr-2"/>} />
                                 <div>
                                     <label className="flex items-center text-sm font-medium text-slate-500 mb-1">
                                        <BadgeCheck className="w-4 h-4 mr-2"/>Loại đại lý
                                    </label>
                                    <span className={`inline-block px-3 py-1.5 rounded-md text-sm font-bold ${getAgencyTypeChipStyle(agency.type.name)}`}>{agency.type.name}</span>
                                </div>
                                <InfoField label="Địa chỉ" value={agency.address} icon={<MapPin className="w-4 h-4 mr-2"/>} className="md:col-span-2"/>
                                <InfoField label="Quận/Huyện" value={agency.district} icon={<MapPin className="w-4 h-4 mr-2"/>}/>
                                <InfoField label="Người quản lý" value={agency.manager || 'Chưa có thông tin'} icon={<User className="w-4 h-4 mr-2"/>}/>
                            </div>
                        </div>
                         <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200/80">
                            <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3"><Phone className="h-6 w-6 text-green-600"/>Thông tin liên hệ</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <InfoField label="Số điện thoại" value={<a href={`tel:${agency.phone}`} className="text-blue-600 hover:underline">{agency.phone}</a>} icon={<Phone className="w-4 h-4 mr-2"/>}/>
                                <InfoField label="Email" value={<a href={`mailto:${agency.email}`} className="text-blue-600 hover:underline">{agency.email}</a>} icon={<Mail className="w-4 h-4 mr-2"/>}/>
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
                                <h1 className="text-3xl font-bold text-slate-800">{agency.name}</h1>
                                <p className="text-slate-500 text-base mt-1">Mã đại lý: <span className="font-semibold text-slate-600">{agency.code}</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Link to="/agencies" className="hidden sm:flex items-center justify-center px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold gap-2">
                                <ArrowLeft className="h-4 w-4" /><span>Quay lại</span>
                            </Link>
                             <Link to={`/agencies/edit/${agency.id}`} className="flex items-center justify-center px-4 py-2 bg-[#007bff] text-white rounded-lg hover:bg-[#0A4A7D] transition-colors font-semibold gap-2 shadow-sm">
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
                                <TabButton label="Lịch sử công nợ" icon={<List className="h-4 w-4" />} isActive={activeTab === 'debt-history'} onClick={() => setActiveTab('debt-history')} />
                            </div>
                            {renderContent()}
                        </div>

                        {/* Right Column: Summaries & Metadata */}
                        <div className="lg:col-span-4 space-y-6">
                           <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200/80">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Trạng thái</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 font-medium">Tình trạng:</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 ${getStatusChipStyle(agency.status)}`}>
                                        {agency.status === 'Hoạt động' && <BadgeCheck className="h-4 w-4" />}
                                        {agency.status === 'Tạm dừng' && <AlertCircle className="h-4 w-4" />}
                                        {agency.status === 'Ngừng hợp tác' && <AlertCircle className="h-4 w-4" />}
                                        {agency.status}
                                    </span>
                                </div>
                            </div>

                             <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200/80">
                                <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-3"><DollarSign className="h-5 w-5 text-teal-600"/>Tài chính</h3>
                                 <div className="space-y-4">
                                     <div>
                                        <label className="text-sm font-medium text-slate-500">Nợ hiện tại</label>
                                        <p className="text-red-600 font-bold text-xl">{agency.debt?.toLocaleString('vi-VN')} VND</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-500">Hạn mức tín dụng</label>
                                        <p className="text-green-700 font-bold text-xl">{agency.creditLimit?.toLocaleString('vi-VN')} VND</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-slate-600">Đã sử dụng:</span>
                                            <span className="font-bold text-slate-800">{debtPercentage.toFixed(1)}%</span>
                                        </div>
                                        <div className="bg-slate-200 rounded-full h-2.5">
                                            <div className={`h-2.5 rounded-full transition-all duration-500 ${getProgressBarColor()}`} style={{ width: `${debtPercentage}%` }}></div>
                                        </div>
                                    </div>
                                 </div>
                            </div>
                            
                            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200/80">
                                 <h3 className="text-lg font-bold text-slate-800 mb-4">Thời gian</h3>
                                 <div className="space-y-4">
                                     <div className="flex items-start gap-3"><Calendar className="w-5 h-5 text-slate-400 mt-0.5"/><div><p className="block text-slate-500 font-medium text-sm">Ngày tạo</p><p className="text-slate-700 font-semibold">{new Date(agency.createdDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p></div></div>
                                     <div className="flex items-start gap-3"><Clock className="w-5 h-5 text-slate-400 mt-0.5"/><div><p className="block text-slate-500 font-medium text-sm">Cập nhật lần cuối</p><p className="text-slate-700 font-semibold">{new Date(agency.updatedDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p></div></div>
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

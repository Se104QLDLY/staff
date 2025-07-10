import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRegulationDetail, Regulation } from '../../api/regulation.api';
import { DashboardLayout } from '../../components/layout/DashboardLayout/DashboardLayout';

const RegulationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [regulation, setRegulation] = useState<Regulation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getRegulationDetail(id).then(data => {
        setRegulation(data);
        setLoading(false);
      });
    }
  }, [id]);

  return (
    <DashboardLayout>
      <div className="p-8 max-w-2xl mx-auto">
        <Link to="/regulations" className="text-blue-600 hover:underline">← Quay lại danh sách</Link>
        <h1 className="text-2xl font-bold mb-4 mt-4">Chi tiết quy định</h1>
        {loading ? (
          <div>Đang tải...</div>
        ) : regulation ? (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="mb-2"><span className="font-semibold">Mã quy định:</span> {regulation.regulation_key}</div>
            <div className="mb-2"><span className="font-semibold">Nội dung:</span> {regulation.regulation_value}</div>
            <div className="mb-2"><span className="font-semibold">Mô tả:</span> {regulation.description}</div>
            <div className="mb-2"><span className="font-semibold">Cập nhật lần cuối:</span> {new Date(regulation.updated_at).toLocaleString('vi-VN')}</div>
            {regulation.last_updated_by_name && (
              <div className="mb-2"><span className="font-semibold">Người cập nhật:</span> {regulation.last_updated_by_name}</div>
            )}
          </div>
        ) : (
          <div>Không tìm thấy quy định.</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RegulationDetailPage; 
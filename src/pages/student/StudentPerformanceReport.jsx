import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { PrintableReport } from '../../components/reports/PrintableReport';

export const StudentPerformanceReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await apiService.getStudentReport('std_101');
      setReportData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-400">Generating Academic Performance Report...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PrintableReport reportData={reportData} />
    </div>
  );
};

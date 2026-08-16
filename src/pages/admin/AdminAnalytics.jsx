import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Cpu, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { apiService } from '../../services/api';
import { Card } from '../../components/common/Card';
import { themeColors } from '../../styles/theme';

export const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await apiService.getAdminDashboard();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-400">Loading Comparative Analytics...</div>;

  const pieData = [
    { name: 'Low Risk', value: data.riskDistribution.low, color: '#10b981' },
    { name: 'Medium Risk', value: data.riskDistribution.medium, color: '#f59e0b' },
    { name: 'High Risk', value: data.riskDistribution.high, color: '#f97316' },
    { name: 'Critical Risk', value: data.riskDistribution.critical, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Institutional Comparative Analytics</h1>
        <p className="text-xs text-slate-400">Department performance distribution & risk segmentation heatmaps</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Department GPA & Attendance Comparison">
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.departmentPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke={themeColors.chartGrid} />
                <XAxis dataKey="department" stroke="#9ca3af" fontSize={11} />
                <YAxis domain={[50, 100]} stroke="#9ca3af" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: themeColors.chartTooltipBg,
                    borderColor: themeColors.chartTooltipBorder,
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="avgScore" name="Avg Score %" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Campus Risk Profile Pie Breakdown">
          <div className="h-72 w-full flex items-center justify-center pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

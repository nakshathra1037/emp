import React, { useState, useEffect } from 'react';
import { Activity, Clock, User, Shield } from 'lucide-react';
import { apiService } from '../../services/api';
import { Card } from '../../components/common/Card';

export const AdminActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const res = await apiService.getAdminDashboard();
      setActivities(res.recentActivities);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-400">Loading Activity Log...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Campus Activity & System Audit Logs</h1>
        <p className="text-xs text-slate-400">Real-time audit log of student, teacher, and administrative events</p>
      </div>

      <Card title="System Activity Timeline">
        <div className="space-y-3">
          {activities.map((act) => (
            <div key={act.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-100">{act.user}</span>{' '}
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-[10px]">{act.role}</span>
                  <p className="text-slate-300 mt-0.5">{act.action}</p>
                </div>
              </div>
              <span className="text-slate-500 font-mono flex-shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

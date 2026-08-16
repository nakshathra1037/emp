import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { apiService } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';

export const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [newAsg, setNewAsg] = useState({
    title: '',
    courseCode: 'CS-301',
    courseName: 'CS-301 Algorithms',
    dueDate: '',
    totalPoints: 100,
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const data = await apiService.getStudentAssignments('std_101');
      setAssignments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const res = await apiService.createAssignment(newAsg);
      setToastMessage('New assignment published to student portal!');
      setCreateModalOpen(false);
      fetchAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-600 font-semibold">Loading assignments...</div>;

  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Course Assignments & Tasks Manager</h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Publish problem sets, evaluate student submissions, and award scores</p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={() => setCreateModalOpen(true)}>
          Create New Assignment
        </Button>
      </div>

      <div className="space-y-4">
        {assignments.map((asg) => (
          <Card key={asg.id} className="space-y-3 bg-white border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                {asg.courseCode}
              </span>
              <span className="text-xs font-semibold text-slate-500">Due: {asg.dueDate}</span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">{asg.title}</h3>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">{asg.courseName} • Max Score: {asg.totalPoints} Marks</p>
            </div>

            {asg.status === 'Graded' ? (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="text-emerald-700 font-bold block">Evaluated Submission:</span>
                <p className="text-slate-800 font-semibold italic">"{asg.feedback}"</p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-bold">
                Pending student submissions for review
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Create Assignment Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Publish New Assignment">
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Title</label>
            <input
              type="text"
              required
              value={newAsg.title}
              onChange={(e) => setNewAsg({ ...newAsg, title: e.target.value })}
              placeholder="e.g. Dynamic Programming Problem Set 4"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Course Code</label>
              <select
                value={newAsg.courseCode}
                onChange={(e) => setNewAsg({ ...newAsg, courseCode: e.target.value })}
                className="w-full"
              >
                <option value="CS-301">CS-301 Algorithms</option>
                <option value="CS-305">CS-305 Machine Learning</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Points</label>
              <input
                type="number"
                required
                value={newAsg.totalPoints}
                onChange={(e) => setNewAsg({ ...newAsg, totalPoints: e.target.value })}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              required
              value={newAsg.dueDate}
              onChange={(e) => setNewAsg({ ...newAsg, dueDate: e.target.value })}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Publish Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {toastMessage && <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />}
    </div>
  );
};

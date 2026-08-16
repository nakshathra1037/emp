import React, { useState, useEffect } from 'react';
import { Upload, Clock, MessageSquare } from 'lucide-react';
import { apiService } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';
import { Tabs } from '../../components/common/Tabs';

export const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedAsg, setSelectedAsg] = useState(null);
  const [submissionNote, setSubmissionNote] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleOpenSubmitModal = (asg) => {
    setSelectedAsg(asg);
    setSubmissionNote('');
    setSubmitModalOpen(true);
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!selectedAsg) return;
    setSubmitting(true);
    try {
      const res = await apiService.submitAssignment(selectedAsg.id, submissionNote);
      setToastMessage(res.message || 'Assignment submitted successfully!');
      setSubmitModalOpen(false);
      fetchAssignments();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = assignments.filter((a) => {
    if (filter === 'pending') return a.status === 'Pending';
    if (filter === 'submitted') return a.status === 'Submitted';
    if (filter === 'graded') return a.status === 'Graded';
    return true;
  });

  const tabItems = [
    { id: 'all', label: 'All Assignments', count: assignments.length },
    { id: 'pending', label: 'Pending', count: assignments.filter((a) => a.status === 'Pending').length },
    { id: 'submitted', label: 'Submitted', count: assignments.filter((a) => a.status === 'Submitted').length },
    { id: 'graded', label: 'Graded', count: assignments.filter((a) => a.status === 'Graded').length },
  ];

  if (loading) return <div className="py-12 text-center text-slate-600 font-semibold">Loading assignments...</div>;

  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Course Assignments & Tasks</h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">Submit homework assignments and review teacher evaluations</p>
      </div>

      <Tabs tabs={tabItems} activeTab={filter} onChange={setFilter} />

      <div className="space-y-4">
        {filtered.map((asg) => (
          <Card key={asg.id} className="space-y-3 bg-white border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                  {asg.courseCode}
                </span>
                <StatusBadge status={asg.status} />
              </div>
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Due Date: {asg.dueDate}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">{asg.title}</h3>
              <p className="text-xs font-semibold text-slate-600">{asg.courseName}</p>
            </div>

            {asg.status === 'Graded' && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-red-700">Grade Evaluation</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {asg.earnedPoints} / {asg.totalPoints} Marks
                  </span>
                </div>
                {asg.feedback && (
                  <div className="flex items-start gap-2 text-slate-800 font-semibold italic">
                    <MessageSquare className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>Teacher Feedback: "{asg.feedback}"</span>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Max Score: {asg.totalPoints} Points</span>
              {asg.status === 'Pending' && (
                <Button variant="primary" size="sm" icon={Upload} onClick={() => handleOpenSubmitModal(asg)}>
                  Submit Solution
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Submission Modal */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title={`Submit Solution: ${selectedAsg?.courseCode}`}
      >
        <form onSubmit={handleSubmitAssignment} className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">{selectedAsg?.title}</h4>
            <p className="text-xs font-semibold text-slate-500">Due: {selectedAsg?.dueDate}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Submission Code / Notes</label>
            <textarea
              rows={4}
              required
              value={submissionNote}
              onChange={(e) => setSubmissionNote(e.target.value)}
              placeholder="Paste solution algorithm link, code summary, or notes..."
              className="w-full"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
            <Upload className="w-4 h-4 text-red-600" />
            <span>Attachment simulation ready (code_solution.cpp auto-attached).</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setSubmitModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={submitting}>
              Confirm Submission
            </Button>
          </div>
        </form>
      </Modal>

      {toastMessage && <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />}
    </div>
  );
};

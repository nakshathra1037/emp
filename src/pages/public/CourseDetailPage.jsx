import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, User } from 'lucide-react';
import { apiService } from '../../services/api';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';

export const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchCourseDetail();
  }, []);

  const fetchCourseDetail = async () => {
    setLoading(true);
    try {
      const data = await apiService.getCourseById(id);
      setCourse(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = () => {
    setToastMessage(`Success! Enrollment request registered for ${course?.code} - ${course?.name}.`);
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto py-12 text-center text-slate-600 font-semibold">Loading course syllabus...</div>;
  }

  if (!course) {
    return <div className="max-w-4xl mx-auto py-12 text-center text-slate-600 font-semibold">Course not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 bg-slate-50 text-slate-900">
      <Link to="/courses" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-red-600">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </Link>

      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 space-y-4 border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-red-50 text-red-700 border border-red-200">
              {course.code}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {course.department}
            </span>
          </div>
          <span className="text-sm font-black text-red-600">{course.credits} Credit Hours</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">{course.name}</h1>
        <p className="text-sm text-slate-600 font-medium leading-relaxed">{course.description}</p>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-red-600" />
              <span>{course.instructor}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-red-600" />
              <span>{course.schedule}</span>
            </div>
          </div>
          <Button variant="primary" size="md" onClick={handleEnroll}>
            Request Enrollment
          </Button>
        </div>
      </div>

      {/* Syllabus Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-panel p-6 space-y-4 bg-white border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-600" />
            Curriculum & Module Breakdown
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-extrabold text-red-700">Module 1: Foundations & Fundamentals</span>
              <p className="text-slate-600 font-medium">Core theoretical concepts, notation, mathematical foundations, and setup.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-extrabold text-red-700">Module 2: Advanced Implementation & Algorithms</span>
              <p className="text-slate-600 font-medium">Data pipelines, complexity optimization, hands-on lab exercises, and mid-term exam review.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-extrabold text-red-700">Module 3: Cloud & Industry Systems Integration</span>
              <p className="text-slate-600 font-medium">Final capstone project implementation, real-world case studies, and end-term evaluation.</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 space-y-4 bg-white border border-slate-200">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Course Specs</h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 font-bold">Prerequisites</span>
              <div className="font-bold text-slate-900 mt-0.5">{course.prerequisites}</div>
            </div>
            <div>
              <span className="text-slate-500 font-bold">Course Level</span>
              <div className="font-bold text-slate-900 mt-0.5">{course.level}</div>
            </div>
            <div>
              <span className="text-slate-500 font-bold">Capacity & Enrolled</span>
              <div className="font-bold text-slate-900 mt-0.5">{course.enrolledCount} / {course.maxCapacity} Seats</div>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
};

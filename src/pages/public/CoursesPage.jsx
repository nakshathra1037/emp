import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, Users } from 'lucide-react';
import { apiService } from '../../services/api';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Toast } from '../../components/common/Toast';

export const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, [search, department]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await apiService.getCourses(search, department);
      setCourses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = (courseName) => {
    setToastMessage(`Enrollment request for "${courseName}" sent! Log in to access your course material.`);
  };

  const departments = ['All', 'Computer Science', 'Mathematics', 'Software Engineering', 'Artificial Intelligence'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 bg-slate-50 text-slate-900">
      {/* Page Title Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Course Catalog & Schedules</h1>
        <p className="text-sm text-slate-600 font-medium">Explore accredited university courses, schedules, and faculty profiles</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course code or title..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-xs text-slate-600 font-bold mr-1">Dept:</span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartment(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                department === dept
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:text-red-600 border border-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-white animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col justify-between space-y-4 bg-white border border-slate-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                    {course.code}
                  </span>
                  <span className="text-xs font-bold text-red-600">{course.credits} Credits</span>
                </div>

                <h3 className="text-lg font-black text-slate-900 hover:text-red-600 transition-colors">
                  <Link to={`/courses/${course.id}`}>{course.name}</Link>
                </h3>

                <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">{course.description}</p>

                <div className="space-y-1.5 text-xs font-semibold text-slate-700 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-red-600" />
                    <span>Instructor: {course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-red-600" />
                    <span>{course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-red-600" />
                    <span>Enrolled: {course.enrolledCount} / {course.maxCapacity}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link to={`/courses/${course.id}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleEnrollClick(course.name)}
                  className="w-full"
                >
                  Enroll Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500 glass-panel bg-white border border-slate-200">
          <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="font-bold text-slate-900">No courses match your filter criteria.</p>
          <p className="text-xs text-slate-500 font-medium">Try clearing search term or department filter.</p>
        </div>
      )}

      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
};

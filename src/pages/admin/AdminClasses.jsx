import React from 'react';
import { Layers, Clock, MapPin, Users } from 'lucide-react';
import { Card } from '../../components/common/Card';

export const AdminClasses = () => {
  const classes = [
    { id: 'sec-1', section: 'CS-301 Section A', room: 'Lab 402 Tech Building', instructor: 'Dr. Sarah Jenkins', time: 'Mon, Wed, Fri (10:00 - 11:30 AM)', capacity: '42 / 50' },
    { id: 'sec-2', section: 'CS-305 Section B', room: 'Hall 108 Innovation Center', instructor: 'Prof. David Miller', time: 'Tue, Thu (02:00 - 04:00 PM)', capacity: '38 / 45' },
    { id: 'sec-3', section: 'MATH-202 Section A', room: 'Audit 2 Science Annex', instructor: 'Dr. Robert Vance', time: 'Mon, Wed (01:00 - 02:30 PM)', capacity: '48 / 50' },
    { id: 'sec-4', section: 'SE-401 Section A', room: 'Lab 201 Software Wing', instructor: 'Prof. Elena Rostova', time: 'Tue, Fri (09:00 - 10:30 AM)', capacity: '35 / 40' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Class Section & Lecture Allocations</h1>
        <p className="text-xs text-slate-400">Classroom timetables, hall assignments, and capacity tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((cls) => (
          <Card key={cls.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100">{cls.section}</h3>
              <span className="text-xs font-mono text-indigo-400 font-bold">{cls.capacity} Enrolled</span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>Location: {cls.room}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Faculty: {cls.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Time Slot: {cls.time}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

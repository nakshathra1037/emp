import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ArrowRight, Sparkles, GraduationCap, Users, BarChart2, Award, BookOpen } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { AIWorkflowVisualizer } from '../../components/ai/AIWorkflowVisualizer';

export const HomePage = () => {
  return (
    <div className="py-8 sm:py-12 space-y-20 bg-slate-50 text-slate-900 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold tracking-wide shadow-xs">
              <img src="/assets/kit-logo.png" alt="KIT Logo" className="w-5 h-5 rounded-full bg-white p-0.5 border border-red-600" />
              <span>BUILDATHON 2026 • KIT Coimbatore Student Project</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              AI-Powered Academic <br />
              <span className="text-red-600">Intelligence Portal</span>
            </h1>
            <div className="w-16 h-1.5 bg-red-600 rounded-full" />

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
              Accelerating high-fidelity academic modeling, weak subject identification, and intelligent performance diagnostics for KIT Coimbatore students and faculty.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/login">
                <Button variant="primary" size="lg" icon={ArrowRight}>
                  Explore Portal Demo
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="outline" size="lg">
                  View Course Catalog
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Showcase Card: KIT Campus Landscape Photo (kit-campus-2.jpg) */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden relative group">
              <img
                src="/assets/kit-campus-2.jpg"
                alt="KIT Coimbatore Engineering Campus"
                className="w-full h-80 sm:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-6 flex items-end justify-between">
                <div>
                  <span className="px-3 py-1 rounded-md text-xs font-extrabold bg-red-600 text-white shadow-md">
                    Coimbatore Campus
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">KIT Coimbatore Engineering Campus</h3>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 2. QUICK FEATURES STRIP */}
        <div className="mt-12 bg-white rounded-3xl shadow-xl shadow-red-500/5 border border-slate-200/80 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-20">
          
          <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">High-Fidelity AI</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Accurate term performance modeling for student progress.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Weak Subject AI</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Instant pinpointing of vulnerable subjects & root cause.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">AI & Risk Analytics</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Predictive drop-out risk matrix & teacher intervention.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Visualization Suite</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Interactive progress charts & printable transcripts.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SECTION 2: ABOUT THE PLATFORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-600 uppercase tracking-widest">
              <span>ABOUT THE PLATFORM</span>
              <div className="w-8 h-0.5 bg-red-600" />
            </div>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Building Smarter Education for KIT Students
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Our platform leverages AI algorithms, term analytics, and multi-variate risk engine scanning to create high-fidelity academic progress models. It helps in analyzing attendance, assignment scores, and exam marks to prevent academic drop-outs.
            </p>

            <div className="pt-2">
              <Link to="/courses">
                <Button variant="primary" size="md" icon={ArrowRight}>
                  Explore Academic Intelligence
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Showcase Card: KIT Campus Front Building Photo (kit-campus-1.jpg) */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
              <img
                src="/assets/kit-campus-1.jpg"
                alt="KIT Campus Building View"
                className="w-full h-72 sm:h-80 object-cover"
              />
            </div>
          </div>

        </div>

        {/* 4. STATS STRIP */}
        <div className="mt-12 bg-white rounded-3xl border border-slate-200/80 shadow-lg p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">1,240+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Students</div>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">78+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Faculty Members</div>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto shadow-xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">56+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Programs</div>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">94.2%</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Accuracy</div>
          </div>
        </div>
      </section>

      {/* 5. AI PIPELINE FLOW VISUALIZER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <AIWorkflowVisualizer />
      </section>

    </div>
  );
};

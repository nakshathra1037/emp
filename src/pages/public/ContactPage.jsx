import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';

export const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-white">Contact & Academic Support</h1>
        <p className="text-sm text-slate-400">
          Have questions regarding portal access, AI diagnostic insights, or course enrollments? Get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="glass-panel p-5 space-y-2">
            <div className="flex items-center gap-3 text-indigo-400">
              <Mail className="w-5 h-5" />
              <h3 className="font-bold text-slate-100 text-sm">Academic Registrar</h3>
            </div>
            <p className="text-xs text-slate-400">registrar@edupulse.edu</p>
          </div>

          <div className="glass-panel p-5 space-y-2">
            <div className="flex items-center gap-3 text-purple-400">
              <Phone className="w-5 h-5" />
              <h3 className="font-bold text-slate-100 text-sm">Technical Helpdesk</h3>
            </div>
            <p className="text-xs text-slate-400">+1 (800) 555-EDUPULSE</p>
          </div>

          <div className="glass-panel p-5 space-y-2">
            <div className="flex items-center gap-3 text-cyan-400">
              <MapPin className="w-5 h-5" />
              <h3 className="font-bold text-slate-100 text-sm">Campus Headquarters</h3>
            </div>
            <p className="text-xs text-slate-400">Tech Park Annex B, Innovation Way</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 glass-panel p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            Send Support Ticket
          </h2>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-emerald-200">Support Ticket Submitted!</h3>
              <p className="text-xs text-emerald-300">Our academic administrative team will respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Alex Mercer"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@edupulse.edu"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Inquiry Category</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full"
                >
                  <option value="General">General Inquiry</option>
                  <option value="Enrollment">Course Enrollment Issue</option>
                  <option value="AI Engine">AI Intelligence Diagnostic Feedback</option>
                  <option value="Tech Support">Technical Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry..."
                  className="w-full"
                />
              </div>

              <Button type="submit" variant="primary" size="md" icon={Send} className="w-full sm:w-auto">
                Submit Support Request
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

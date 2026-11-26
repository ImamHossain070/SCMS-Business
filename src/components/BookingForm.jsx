import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Building, Camera, Sparkles, Loader2 } from 'lucide-react';
import { DETECTION_DOMAINS } from '../data/scmsData';

export default function BookingForm({ initialModule = '', onSuccessClose }) {
  const [form, setForm] = useState({
    name: '',
    organization: '',
    email: '',
    cameras: '25-100 Cameras (1-3 Facilities)',
    preferred_datetime: '',
    deployment_type: 'Live Pilot Deployment',
    modules: initialModule ? [initialModule] : ['Violence & Fight', 'Fall Detection'],
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (initialModule) {
      setForm((prev) => ({
        ...prev,
        modules: prev.modules.includes(initialModule)
          ? prev.modules
          : [...prev.modules, initialModule],
      }));
    }
  }, [initialModule]);

  const toggleModule = (shortTitle) => {
    setForm((prev) => {
      const exists = prev.modules.includes(shortTitle);
      return {
        ...prev,
        modules: exists
          ? prev.modules.filter((m) => m !== shortTitle)
          : [...prev.modules, shortTitle],
      };
    });
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your full name.';
    if (form.organization.trim().length < 2) next.organization = 'Institution or company name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Valid work email is required.';
    if (!form.preferred_datetime) next.preferred_datetime = 'Please choose a preferred date & time.';
    if (form.modules.length === 0) next.modules = 'Select at least one detection module.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const saveLocalBooking = (record) => {
    try {
      const existing = JSON.parse(localStorage.getItem('scms_bookings') || '[]');
      localStorage.setItem('scms_bookings', JSON.stringify([record, ...existing]));
    } catch {
      // ignore storage errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('API offline');
      const data = await res.json();
      saveLocalBooking(
        data.booking || {
          reference_id: data.reference_id,
          status: 'Pending',
          created_at: new Date().toISOString(),
          ...form,
        }
      );
      setConfirmation({
        reference_id: data.reference_id,
        message: data.message,
      });
    } catch {
      // Graceful offline simulation fallback when FastAPI isn't running
      await new Promise((r) => setTimeout(r, 650));
      const refId = `SCMS-${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
      saveLocalBooking({
        reference_id: refId,
        status: 'Pending',
        created_at: new Date().toISOString(),
        ...form,
      });
      setConfirmation({
        reference_id: refId,
        message:
          'Consultation scheduled. An edge-AI solutions architect will reach out within 4 business hours.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 px-4 space-y-5"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <span className="font-mono-tech text-xs px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-300">
            REF: {confirmation.reference_id}
          </span>
          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white pt-1">
            Pilot & Consultation Confirmed
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            {confirmation.message}
          </p>
        </div>

        <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-1.5 font-mono-tech">
          <div className="flex justify-between">
            <span className="text-slate-500">Organization:</span>
            <span className="text-slate-900 dark:text-white font-semibold">{form.organization}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Scale:</span>
            <span className="text-slate-900 dark:text-white">{form.cameras}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Scheduled:</span>
            <span className="text-cyan-600 dark:text-cyan-400">
              {form.preferred_datetime.replace('T', ' ')}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setConfirmation(null)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-cyan-500 cursor-pointer"
          >
            Book Another Session
          </button>
          {onSuccessClose && (
            <button
              type="button"
              onClick={onSuccessClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-cyan-500 text-slate-950 cursor-pointer"
            >
              Done
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            placeholder="Dr. Elena Vance"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
          />
          {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Institution / Company Name *
          </label>
          <div className="relative">
            <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Pacific Tech University"
              value={form.organization}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          {errors.organization && <p className="text-xs text-rose-500 mt-1">{errors.organization}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Work Email *
          </label>
          <input
            type="email"
            placeholder="security@institution.edu"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
          />
          {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Number of Cameras / Facilities
          </label>
          <div className="relative">
            <Camera className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <select
              value={form.cameras}
              onChange={(e) => setForm({ ...form, cameras: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            >
              <option>8-24 Cameras (Single Facility Pilot)</option>
              <option>25-100 Cameras (1-3 Facilities)</option>
              <option>100-300 Cameras (Multi-Campus)</option>
              <option>300+ Cameras (District / Enterprise)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Preferred Date & Time *
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="datetime-local"
              value={form.preferred_datetime}
              onChange={(e) => setForm({ ...form, preferred_datetime: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          {errors.preferred_datetime && (
            <p className="text-xs text-rose-500 mt-1">{errors.preferred_datetime}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Engagement Type
          </label>
          <select
            value={form.deployment_type}
            onChange={(e) => setForm({ ...form, deployment_type: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
          >
            <option>Live Pilot Deployment</option>
            <option>On-Premises Security Audit</option>
            <option>Edge Architecture Consultation</option>
          </select>
        </div>
      </div>

      {/* Module Multi-Select Chips */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
          Specific Module Interests *
        </label>
        <div className="flex flex-wrap gap-2">
          {DETECTION_DOMAINS.map((mod) => {
            const active = form.modules.includes(mod.shortTitle);
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => toggleModule(mod.shortTitle)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  active
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-700 dark:text-cyan-300 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/40'
                }`}
              >
                {mod.shortTitle}
              </button>
            );
          })}
        </div>
        {errors.modules && <p className="text-xs text-rose-500 mt-1">{errors.modules}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Scheduling Consultation...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Confirm Pilot / Demo Booking</span>
          </>
        )}
      </button>
    </form>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import {
  FileCheck2,
  ServerCog,
  CloudDownload,
  CalendarCheck,
  ArrowRight,
} from 'lucide-react';

export default function BusinessImpactSection({ onOpenBooking }) {
  const pillars = [
    {
      icon: ServerCog,
      title: 'Hardware-Agnostic Setup',
      desc: 'Connects to your existing RTSP/ONVIF IP cameras in under 30 minutes—zero proprietary camera lock-in.',
    },
    {
      icon: CloudDownload,
      title: 'Continuous OTA Model Updates',
      desc: 'Federated weight improvements are signed and deployed over-the-air with zero campus downtime.',
    },
    {
      icon: FileCheck2,
      title: 'GDPR & Safety Code Compliance',
      desc: 'One-click institutional safety audit logs, incident response SLAs, and privacy-by-design certifications.',
    },
  ];

  return (
    <section id="business" className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header + 3 Enterprise Pillars */}
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold">
              Appointment-Based Enterprise Deployment
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Tailored On-Premises Integration. Measurable Safety Impact.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              SCMS works exclusively by appointment to architect, deploy, and tune edge inference
              directly for your facility’s RTSP topology, compliance requirements, and response workflows.
            </p>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-3 gap-4">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  whileHover={{ y: -4 }}
                  className="glass-panel rounded-2xl p-5 space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {p.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Appointment-Based Consultation Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/25 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-600 dark:text-cyan-400">
              <CalendarCheck className="w-4 h-4" />
              <span>BY APPOINTMENT ONLY · SOLUTIONS ARCHITECTURE</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              Ready to Evaluate SCMS on Your Campus Network?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Book a private consultation with our edge-AI engineers to scope your camera feeds,
              select your detection models, and schedule a 14-day on-premises pilot.
            </p>
          </div>

          <button
            onClick={onOpenBooking}
            className="shrink-0 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Schedule Appointment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

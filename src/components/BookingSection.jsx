import React from 'react';
import { ShieldCheck, Clock, Cpu } from 'lucide-react';
import BookingForm from './BookingForm';

export default function BookingSection({ selectedModule }) {
  return (
    <section
      id="booking"
      className="py-20 lg:py-24 bg-slate-100/60 dark:bg-[#070d1b] border-y border-slate-200/70 dark:border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-5">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
              14-Day On-Premises Pilot
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Schedule a Live Pilot or Security Audit
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Test SCMS directly on your existing RTSP/ONVIF camera streams. Our solutions
              architects will benchmark FPS, latency, and privacy compliance on your campus network.
            </p>

            <div className="space-y-3 pt-2">
              {[
                {
                  icon: ShieldCheck,
                  title: 'Zero Video Leaves Your LAN',
                  desc: 'Full GDPR & institutional privacy review included in every pilot.',
                },
                {
                  icon: Cpu,
                  title: 'Rapid Edge Node Provisioning',
                  desc: 'Dockerized deployment on NVIDIA T4, L4, or Jetson Orin appliances.',
                },
                {
                  icon: Clock,
                  title: '4-Hour Architect Response',
                  desc: 'Direct engineering channel for custom RTSP & SIEM integration.',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 shadow-xl">
            <BookingForm initialModule={selectedModule} />
          </div>
        </div>
      </div>
    </section>
  );
}

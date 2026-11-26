import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Lock,
  Zap,
  Building2,
  ArrowRight,
  CalendarCheck,
  Activity,
  Cpu,
} from 'lucide-react';
import MotionVisionSimulator from './MotionVisionSimulator';

const HERO_MODES = [
  { id: 'fall', label: 'Fall Pose' },
  { id: 'fight', label: 'Violence' },
  { id: 'vaping', label: 'Smoking' },
];

export default function HeroSection({ telemetry, history, onOpenBooking }) {
  const [simMode, setSimMode] = useState('fall');

  const metrics = [
    {
      label: 'Inference Speed',
      value: `${telemetry.fps} FPS`,
      sub: '15–30 FPS per stream',
      icon: Zap,
      color: 'text-cyan-500',
    },
    {
      label: 'Alert Latency',
      value: `${telemetry.latency_ms} ms`,
      sub: 'Sub-500ms SLA',
      icon: Activity,
      color: 'text-emerald-500',
    },
    {
      label: 'Raw Video Uploaded',
      value: '0.00 MB',
      sub: '100% On-Premises RAM',
      icon: Lock,
      color: 'text-cyan-500',
    },
    {
      label: 'Multi-Facility Scale',
      value: `${telemetry.edge_nodes_online} Nodes`,
      sub: `${telemetry.active_cameras} Active RTSP Streams`,
      icon: Building2,
      color: 'text-emerald-500',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-tech-grid pt-14 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/70 dark:border-slate-800/80">
      {/* Ambient motion glow orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -bottom-24 right-0 w-[28rem] h-[28rem] rounded-full bg-emerald-500/12 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-mono-tech uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              <span>B2B / B2G Privacy-First Edge AI Platform</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              Smart Campus Monitoring,{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Zero Raw Video Egress.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Transform existing RTSP/ONVIF cameras into real-time safety sensors. SCMS executes
              YOLOv8/v11 computer vision and pose estimation on-premises, syncing only encrypted
              Federated Learning weights across campuses with sub-500ms alert automation.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-cyan-500/25 hover:brightness-110 transition-all cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book a Demo</span>
              </button>

              <a
                href="#solutions"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-800 dark:text-slate-100 hover:border-cyan-500/60 transition-all"
              >
                <span>Explore Modules</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Live Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              {metrics.map((m) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.label}
                    className="glass-panel rounded-2xl p-3.5 transition-transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                      <span className="truncate">{m.label}</span>
                    </div>
                    <div className="font-mono-tech font-bold text-lg text-slate-900 dark:text-white">
                      {m.value}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {m.sub}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Interactive Motion-Graphic Telemetry Console */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <div className="glass-panel rounded-3xl p-4 sm:p-5 shadow-2xl shadow-cyan-950/20">
              {/* Console Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200/70 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono-tech text-xs font-semibold text-slate-800 dark:text-slate-200">
                    SCMS EDGE NODE · LIVE INFERENCE
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                  {HERO_MODES.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSimMode(mode.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                        simMode === mode.id
                          ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motion-Graphic Vision Feed */}
              <MotionVisionSimulator simType={simMode} />

              {/* Live WebSocket Event Stream */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-500 dark:text-slate-400">
                  <span>REAL-TIME ALERT STREAM (METADATA ONLY)</span>
                  <span>FEDAVG ROUND #{telemetry.fedavg_round}</span>
                </div>

                <div className="space-y-1.5">
                  {(history.length ? history.slice(0, 3) : [telemetry.event]).map((ev, idx) => (
                    <motion.div
                      key={`${ev.id}-${idx}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <ShieldAlert
                          className={`w-3.5 h-3.5 shrink-0 ${
                            ev.severity === 'critical'
                              ? 'text-rose-500'
                              : ev.severity === 'warning'
                              ? 'text-amber-500'
                              : 'text-cyan-500'
                          }`}
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {ev.module}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 truncate hidden sm:inline">
                          · {ev.zone}
                        </span>
                      </div>
                      <span className="font-mono-tech text-[11px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 shrink-0">
                        {Math.round(ev.confidence * 100)}% conf
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

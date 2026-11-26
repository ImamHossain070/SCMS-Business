import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  Wind,
  PersonStanding,
  AlertTriangle,
  CheckCircle2,
  Gauge,
} from 'lucide-react';
import { DETECTION_DOMAINS } from '../data/scmsData';
import MotionVisionSimulator from './MotionVisionSimulator';

const ICON_MAP = {
  'violence-fight': Swords,
  'smoking-vaping': Wind,
  'fall-detection': PersonStanding,
};

export default function DetectionShowcase({ onSelectModuleForBooking }) {
  const [selectedId, setSelectedId] = useState(DETECTION_DOMAINS[0].id);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Behavioral Safety', 'Health & Policy', 'Medical & EHS'];

  const filtered =
    filter === 'All'
      ? DETECTION_DOMAINS
      : DETECTION_DOMAINS.filter((d) => d.category === filter);

  const activeDomain =
    DETECTION_DOMAINS.find((d) => d.id === selectedId) || DETECTION_DOMAINS[0];

  return (
    <section id="solutions" className="py-20 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold">
              3 Core Edge-AI Detection Domains
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Modular Computer Vision Built for High-Stakes Facilities
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              Deploy individual safety models or run all 3 domains concurrently on a single NVIDIA T4
              edge node. Click any module to inspect its live inference simulation.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  filter === cat
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Split Layout: 8-Domain Grid + Live Motion Inspector */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {filtered.map((domain) => {
              const Icon = ICON_MAP[domain.id] || AlertTriangle;
              const isSelected = domain.id === activeDomain.id;
              return (
                <motion.button
                  key={domain.id}
                  layout
                  whileHover={{ y: -3 }}
                  onClick={() => setSelectedId(domain.id)}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500 shadow-lg shadow-cyan-500/10'
                      : 'glass-panel hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-100 dark:bg-slate-800/90 text-cyan-600 dark:text-cyan-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono-tech text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                      {domain.accuracy} mAP
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white mb-1">
                    {domain.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {domain.summary}
                  </p>
                </motion.button>
              );
            })}
          </div>

          {/* Right: Deep-Dive Motion Inspector */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDomain.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="glass-panel rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-tech text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300">
                    {activeDomain.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono-tech text-emerald-600 dark:text-emerald-400">
                    <Gauge className="w-3.5 h-3.5" />
                    <span>{activeDomain.latency} latency</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    {activeDomain.title}
                  </h3>
                  <p className="text-xs font-mono-tech text-slate-500 dark:text-slate-400 mt-1">
                    Pipeline: {activeDomain.model}
                  </p>
                </div>

                <MotionVisionSimulator simType={activeDomain.simType} compact />

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeDomain.summary}
                </p>

                <ul className="space-y-2">
                  {activeDomain.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelectModuleForBooking(activeDomain.shortTitle)}
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Pilot "{activeDomain.shortTitle}" Module
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

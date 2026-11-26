import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, ArrowUpRight, Radio, Lock } from 'lucide-react';

export default function Navbar({ darkMode, setDarkMode, onOpenBooking, onOpenAdmin, wsConnected }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Solutions', href: '#solutions' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Deployment', href: '#business' },
    { label: 'Book Pilot', href: '#booking' },
    { label: 'FAQ & Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 dark:border-cyan-500/15 bg-white/80 dark:bg-[#050914]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <a href="#" className="flex items-center gap-2.5 group">
          <img
            src="/logo.jpg"
            alt="SCMS"
            className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-cyan-500/20"
          />
          <div className="leading-tight">
            <span className="font-display font-bold text-lg tracking-tight text-slate-900 dark:text-white">
              SCMS<span className="text-cyan-500">.ai</span>
            </span>
            <p className="text-[10px] font-mono-tech uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Smart Campus Edge AI
            </p>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono-tech border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            title={wsConnected ? 'Connected to FastAPI WebSocket' : 'Simulated Edge Telemetry Active'}
          >
            <Radio className="w-3 h-3 animate-pulse text-emerald-500" />
            <span>{wsConnected ? 'WS LIVE' : 'EDGE SIM'}</span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle color theme"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 hover:border-cyan-500/50 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            onClick={onOpenAdmin}
            aria-label="Open Admin Portal"
            title="Admin Portal"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 hover:border-cyan-500/50 transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenBooking}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:brightness-110 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <span>Book a Demo</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
            className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#050914]"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-500"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenBooking();
                }}
                className="mt-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950"
              >
                Book a Demo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

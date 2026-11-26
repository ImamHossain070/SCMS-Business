import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import BookingForm from './BookingForm';

export default function BookingModal({ open, onClose, initialModule }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel bg-white dark:bg-[#0b1120] rounded-3xl p-6 sm:p-8 shadow-2xl border border-cyan-500/30"
          >
            <div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  Book an SCMS Enterprise Demo
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Schedule a live edge-AI pilot or architecture consultation
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <BookingForm initialModule={initialModule} onSuccessClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

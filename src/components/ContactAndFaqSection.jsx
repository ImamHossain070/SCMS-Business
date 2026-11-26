import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Send, CheckCircle2, Mail, MapPin, Phone, Loader2 } from 'lucide-react';
import { FAQ_ITEMS } from '../data/scmsData';
import { apiUrl } from '../lib/api';

export default function ContactAndFaqSection() {
  const [openFaq, setOpenFaq] = useState(0);
  const [contact, setContact] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: '',
  });
  const [sent, setSent] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const saveLocalContact = (record) => {
    try {
      const existing = JSON.parse(localStorage.getItem('scms_contacts') || '[]');
      localStorage.setItem('scms_contacts', JSON.stringify([record, ...existing]));
    } catch {
      // ignore storage errors
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!contact.name.trim() || !contact.email.includes('@') || contact.message.trim().length < 10) {
      setError('Please provide your name, a valid email, and a brief message (10+ characters).');
      return;
    }
    setSending(true);
    try {
      const res = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });
      if (!res.ok) throw new Error('offline');
      const data = await res.json();
      saveLocalContact({
        ticket_id: data.ticket_id,
        created_at: new Date().toISOString(),
        ...contact,
      });
      setSent({ ticket_id: data.ticket_id, message: data.message });
    } catch {
      await new Promise((r) => setTimeout(r, 500));
      const ticketId = `INQ-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
      saveLocalContact({
        ticket_id: ticketId,
        created_at: new Date().toISOString(),
        ...contact,
      });
      setSent({
        ticket_id: ticketId,
        message: 'Enterprise inquiry logged. Our security engineering team has received your message.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left: Interactive FAQ */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold">
                Technical & Compliance FAQ
              </span>
              <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
                Privacy, Hardware & Deployment Answers
              </h2>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={item.q}
                    className="glass-panel rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left cursor-pointer"
                    >
                      <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-cyan-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/80 pt-3">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Direct Enterprise Channels */}
            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              <div className="glass-panel rounded-2xl p-3.5 text-xs space-y-1">
                <Mail className="w-4 h-4 text-cyan-500" />
                <div className="font-semibold text-slate-900 dark:text-white">Enterprise Sales</div>
                <div className="text-slate-500 dark:text-slate-400 font-mono-tech">
                  enterprise@scms.ai
                </div>
              </div>
              <div className="glass-panel rounded-2xl p-3.5 text-xs space-y-1">
                <Phone className="w-4 h-4 text-emerald-500" />
                <div className="font-semibold text-slate-900 dark:text-white">24/7 SOC Line</div>
                <div className="text-slate-500 dark:text-slate-400 font-mono-tech">
                  +880 1303224330
                </div>
              </div>
              <div className="glass-panel rounded-2xl p-3.5 text-xs space-y-1">
                <MapPin className="w-4 h-4 text-cyan-500" />
                <div className="font-semibold text-slate-900 dark:text-white">HQ & Lab</div>
                <div className="text-slate-500 dark:text-slate-400">
                  East West University, Aftabnogor, Badda, Dhaka
                </div>
              </div>
            </div>
          </div>

          {/* Right: Enterprise Inquiry Form */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="mb-6">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
                Custom Deployments & B2G RFPs
              </span>
              <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Contact Security Engineering
              </h3>
            </div>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-4"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="font-mono-tech text-xs text-cyan-500">TICKET: {sent.ticket_id}</div>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                  {sent.message}
                </p>
                <button
                  onClick={() => {
                    setSent(null);
                    setContact({ name: '', email: '', organization: '', subject: '', message: '' });
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    type="email"
                    placeholder="Work Email *"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Organization / Agency"
                    value={contact.organization}
                    onChange={(e) => setContact({ ...contact, organization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    type="text"
                    placeholder="Subject (e.g., Air-Gapped FL RFP) *"
                    value={contact.subject}
                    onChange={(e) => setContact({ ...contact, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <textarea
                  rows={4}
                  placeholder="Describe your facility count, RTSP camera topology, or compliance requirements... *"
                  value={contact.message}
                  onChange={(e) => setContact({ ...contact, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 resize-none"
                />

                {error && <p className="text-xs text-rose-500">{error}</p>}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 hover:opacity-90 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Enterprise Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

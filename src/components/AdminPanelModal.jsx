import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lock,
  LogOut,
  RefreshCw,
  Calendar,
  Mail,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  Building2,
  Camera,
  Loader2,
} from 'lucide-react';

import { apiUrl } from '../lib/api';
const STORAGE_CONTACTS_KEY = 'scms_contacts';
const STORAGE_TOKEN_KEY = 'scms_admin_token';

const STATUS_STYLES = {
  Pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30',
  Confirmed: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
  Completed: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/30',
  Cancelled: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30',
};

function readLocal(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

export default function AdminPanelModal({ open, onClose }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN_KEY) || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState('bookings');
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState('local');

  const fetchAdminData = useCallback(async (activeToken) => {
    if (!activeToken) return;
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/admin/data'), {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (res.status === 401) {
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        setToken('');
        return;
      }
      if (!res.ok) throw new Error('offline');
      const data = await res.json();
      setBookings(data.bookings || []);
      setContacts(data.contacts || []);
      setDataSource('api');
    } catch {
      setBookings(readLocal(STORAGE_BOOKINGS_KEY));
      setContacts(readLocal(STORAGE_CONTACTS_KEY));
      setDataSource('local');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && token) {
      fetchAdminData(token);
    }
  }, [open, token, fetchAdminData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoggingIn(true);
    try {
      const res = await fetch(apiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (res.status === 401) {
        setAuthError('Invalid email or password.');
        setLoggingIn(false);
        return;
      }
      if (!res.ok) throw new Error('offline');
      const data = await res.json();
      localStorage.setItem(STORAGE_TOKEN_KEY, data.token);
      setToken(data.token);
      setPassword('');
    } catch {
      if (email.trim().toLowerCase() === 'enterprise@scms.ai' && password === '12345678') {
        const localToken = `local-${Date.now()}`;
        localStorage.setItem(STORAGE_TOKEN_KEY, localToken);
        setToken(localToken);
        setPassword('');
      } else {
        setAuthError('Invalid email or password.');
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    setToken('');
    setBookings([]);
    setContacts([]);
  };

  const updateBookingStatus = async (referenceId, status) => {
    setBookings((prev) =>
      prev.map((b) => (b.reference_id === referenceId ? { ...b, status } : b))
    );
    if (dataSource === 'api') {
      try {
        await fetch(apiUrl(`/api/admin/bookings/${referenceId}`), {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        });
      } catch {
        // ignore
      }
    } else {
      const updated = readLocal(STORAGE_BOOKINGS_KEY).map((b) =>
        b.reference_id === referenceId ? { ...b, status } : b
      );
      localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(updated));
    }
  };

  const deleteBooking = async (referenceId) => {
    setBookings((prev) => prev.filter((b) => b.reference_id !== referenceId));
    if (dataSource === 'api') {
      try {
        await fetch(apiUrl(`/api/admin/bookings/${referenceId}`), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // ignore
      }
    } else {
      const updated = readLocal(STORAGE_BOOKINGS_KEY).filter(
        (b) => b.reference_id !== referenceId
      );
      localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(updated));
    }
  };

  const query = search.trim().toLowerCase();
  const filteredBookings = bookings.filter(
    (b) =>
      !query ||
      b.name?.toLowerCase().includes(query) ||
      b.organization?.toLowerCase().includes(query) ||
      b.email?.toLowerCase().includes(query) ||
      b.reference_id?.toLowerCase().includes(query)
  );
  const filteredContacts = contacts.filter(
    (c) =>
      !query ||
      c.name?.toLowerCase().includes(query) ||
      c.organization?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.subject?.toLowerCase().includes(query)
  );

  const pendingCount = bookings.filter((b) => (b.status || 'Pending') === 'Pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className={`relative w-full ${
              token ? 'max-w-5xl' : 'max-w-md'
            } max-h-[90vh] overflow-y-auto glass-panel bg-white dark:bg-[#0b1120] rounded-3xl p-6 sm:p-8 shadow-2xl border border-cyan-500/30`}
          >
            <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
<div className="w-9 h-9 rounded-xl overflow-hidden">
                    <img src="/logo.jpg" alt="SCMS" className="w-full h-full object-cover" />
                  </div>
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    SCMS Admin Portal
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {token
                      ? `Appointment & Inquiry Management (${
                          dataSource === 'api' ? 'FastAPI Backend' : 'Browser Storage'
                        })`
                      : 'Sign in to view scheduled appointments'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {token && (
                  <>
                    <button
                      onClick={() => fetchAdminData(token)}
                      title="Refresh"
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-cyan-500 cursor-pointer"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      onClick={handleLogout}
                      title="Log out"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-rose-500 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  aria-label="Close admin panel"
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!token ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="enterprise@scms.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {authError && <p className="text-xs text-rose-500">{authError}</p>}

                <button
                  type="submit"
                  disabled={loggingIn}
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loggingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  <span>Sign In to Admin Panel</span>
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <div className="text-[11px] font-mono-tech text-slate-500">Total Appointments</div>
                    <div className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                      {bookings.length}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <div className="text-[11px] font-mono-tech text-slate-500">Pending</div>
                    <div className="font-display text-2xl font-bold text-amber-500 mt-0.5">
                      {pendingCount}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <div className="text-[11px] font-mono-tech text-slate-500">Confirmed</div>
                    <div className="font-display text-2xl font-bold text-emerald-500 mt-0.5">
                      {confirmedCount}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <div className="text-[11px] font-mono-tech text-slate-500">Inquiries</div>
                    <div className="font-display text-2xl font-bold text-cyan-500 mt-0.5">
                      {contacts.length}
                    </div>
                  </div>
                </div>

                {/* Tabs & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTab('bookings')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                        tab === 'bookings'
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Appointments ({bookings.length})</span>
                    </button>
                    <button
                      onClick={() => setTab('contacts')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                        tab === 'contacts'
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Inquiries ({contacts.length})</span>
                    </button>
                  </div>

                  <div className="relative sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search name, org, ref..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* List Content */}
                {tab === 'bookings' ? (
                  filteredBookings.length === 0 ? (
                    <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                      No appointments found yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredBookings.map((b) => {
                        const status = b.status || 'Pending';
                        return (
                          <div
                            key={b.reference_id}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-3"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono-tech text-xs px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-600 dark:text-cyan-300">
                                    {b.reference_id}
                                  </span>
                                  <span
                                    className={`text-[11px] font-mono-tech px-2 py-0.5 rounded border ${
                                      STATUS_STYLES[status] || STATUS_STYLES.Pending
                                    }`}
                                  >
                                    {status}
                                  </span>
                                  <span className="text-[11px] text-slate-500 font-mono-tech">
                                    {b.deployment_type}
                                  </span>
                                </div>
                                <h4 className="font-display font-semibold text-base text-slate-900 dark:text-white mt-1.5">
                                  {b.name} —{' '}
                                  <span className="text-cyan-600 dark:text-cyan-400">
                                    {b.organization}
                                  </span>
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{b.email}</p>
                              </div>

                              <div className="flex items-center gap-2">
                                <select
                                  value={status}
                                  onChange={(e) =>
                                    updateBookingStatus(b.reference_id, e.target.value)
                                  }
                                  className="px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                                <button
                                  onClick={() => deleteBooking(b.reference_id)}
                                  title="Delete appointment"
                                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200/70 dark:border-slate-800">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                                <span>{b.preferred_datetime?.replace('T', ' ')}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Camera className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span>{b.cameras}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                                <span className="truncate">
                                  {(b.modules || []).join(', ') || 'No modules listed'}
                                </span>
                              </div>
                            </div>

                            {b.notes && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-950/50 p-2.5 rounded-xl">
                                {b.notes}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : filteredContacts.length === 0 ? (
                  <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                    No inquiries found yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredContacts.map((c) => (
                      <div
                        key={c.ticket_id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono-tech text-xs px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                            {c.ticket_id}
                          </span>
                          <span className="text-[11px] font-mono-tech text-slate-400">
                            {c.created_at?.slice(0, 16).replace('T', ' ')}
                          </span>
                        </div>
                        <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-white">
                          {c.subject}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>
                            {c.name} ({c.email}) {c.organization ? `· ${c.organization}` : ''}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                          {c.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export const API_BASE = import.meta.env.VITE_API_BASE || '';

export const apiUrl = (path) => `${API_BASE}${path}`;

export const wsUrl = (path) => {
  if (API_BASE) {
    const u = new URL(API_BASE);
    const proto = u.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${proto}//${u.host}${path}`;
  }
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${window.location.host}${path}`;
};
import React from 'react';

export default function Footer({ onOpenAdmin }) {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#040710] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src="/logo.jpg" alt="SCMS" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-display font-bold text-base text-slate-900 dark:text-white">
                SCMS<span className="text-cyan-500">.ai</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Smart Campus Monitoring System — Privacy-preserving Edge AI & Federated Learning for
              universities, enterprises, and public-sector facilities.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><a href="#solutions" className="hover:text-cyan-500">3 Detection Domains</a></li>
              <li><a href="#architecture" className="hover:text-cyan-500">Flower FL Architecture</a></li>
              <li><a href="#business" className="hover:text-cyan-500">Enterprise Deployment</a></li>
              <li><a href="#booking" className="hover:text-cyan-500">Book a 14-Day Pilot</a></li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-cyan-500 cursor-pointer">
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Documentation
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-mono-tech">
              <li><a href="#architecture" className="hover:text-cyan-500">RTSP / ONVIF Spec</a></li>
              <li><a href="#architecture" className="hover:text-cyan-500">NVIDIA T4 Sizing Guide</a></li>
              <li><a href="#contact" className="hover:text-cyan-500">FastAPI + WS Reference</a></li>
              <li><a href="#contact" className="hover:text-cyan-500">FedAvg Security Whitepaper</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Privacy & Compliance
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              GDPR Art. 25 Privacy-by-Design. Zero raw video frames leave on-premises edge nodes.
              All federated weight updates are mTLS-encrypted.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>
            © {new Date().getFullYear()} SCMS · Developed by Imam Hossain, Masum Khan, Md. Imran Hossain, Jannatul Ferdos Umama
          </span>
          <span className="font-mono-tech">
            EDGE-AI · ZERO RAW VIDEO · SUB-500MS SLA
          </span>
        </div>
      </div>
    </footer>
  );
}

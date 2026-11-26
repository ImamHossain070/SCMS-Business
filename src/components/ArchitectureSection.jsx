import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Cpu,
  Shield,
  Network,
  Database,
  Lock,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { TECH_STACK } from '../data/scmsData';

const LAYERS = [
  {
    id: 'edge',
    title: 'On-Premises Edge AI Node',
    subtitle: 'RTSP / ONVIF -> NVIDIA T4 / YOLOv11',
    icon: Cpu,
    details:
      'Raw video streams are decoded directly in volatile GPU/RAM memory on your local campus appliance. YOLOv8/v11 + PyTorch run 15–30 FPS inference and immediately discard raw frames—zero video ever touches disk or external networks.',
    metrics: ['0 Bytes Raw Video Uploaded', '15–30 FPS per RTSP Stream', 'Containerized Docker/K8s'],
  },
  {
    id: 'airgap',
    title: 'Privacy Air-Gap & Encryption',
    subtitle: 'GDPR & Institutional Data Sovereignty',
    icon: Shield,
    details:
      'An outbound-only mTLS gateway enforces strict data minimization. Only anonymized JSON alert events and differential-privacy-hardened PyTorch weight deltas (.pt gradients) are permitted across the perimeter.',
    metrics: ['TLS 1.3 + mTLS Auth', 'No Facial Biometrics Stored', 'GDPR Art. 25 Compliant'],
  },
  {
    id: 'flower',
    title: 'Flower FL (FedAvg) Aggregator',
    subtitle: 'Collaborative Cross-Campus Intelligence',
    icon: Network,
    details:
      'Every night, the Flower Federated Learning server aggregates encrypted model weight updates from participating facilities using FedAvg, producing a stronger global model that is pushed back via zero-downtime OTA updates.',
    metrics: ['Flower Framework FedAvg', 'Continuous Accuracy Drift Guard', 'Signed OTA Model Weights'],
  },
  {
    id: 'dataplane',
    title: 'Enterprise Telemetry & Storage',
    subtitle: 'FastAPI · Redis · PostgreSQL · InfluxDB · MinIO',
    icon: Database,
    details:
      'FastAPI orchestrates real-time WebSocket alerts and REST control APIs. Redis handles sub-millisecond event pub/sub, InfluxDB logs time-series FPS/latency metrics, PostgreSQL manages RBAC audit logs, and MinIO stores signed model artifacts.',
    metrics: ['Sub-500ms Alert Routing', 'Time-Series SLA Metrics', 'S3-Compatible Artifact Store'],
  },
];

export default function ArchitectureSection({ fedavgRound }) {
  const [activeLayer, setActiveLayer] = useState('edge');
  const current = LAYERS.find((l) => l.id === activeLayer) || LAYERS[0];

  return (
    <section
      id="architecture"
      className="py-20 lg:py-24 bg-slate-100/60 dark:bg-[#070d1b] border-y border-slate-200/70 dark:border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <span className="font-mono-tech text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
            Privacy-First Federated Architecture
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Raw Video Never Leaves Your Premises. Intelligence Scales Globally.
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Powered by Flower Federated Learning (FedAvg) and Ultralytics YOLOv8/v11, SCMS decouples
            local video processing from global model improvement.
          </p>
        </div>

        {/* Motion-Graphic Architecture Pipeline */}
        <div className="glass-panel rounded-3xl p-5 sm:p-8 mb-10 shadow-xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left: Animated SVG Flow Diagram */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl bg-[#040812] border border-cyan-500/25 p-4 sm:p-6 overflow-hidden">
                <div className="flex items-center justify-between text-[11px] font-mono-tech text-cyan-300/80 mb-4">
                  <span>FEDERATED LEARNING TOPOLOGY</span>
                  <span className="text-emerald-400">ROUND #{fedavgRound} · CONVERGED</span>
                </div>

                <svg viewBox="0 0 640 310" className="w-full h-auto">
                  {/* Animated Flow Lines: Campus Nodes -> Air-Gap -> Flower FL */}
                  {[60, 155, 250].map((y, idx) => (
                    <g key={idx}>
                      {/* Local RTSP -> Edge Node */}
                      <line
                        x1="92"
                        y1={y}
                        x2="170"
                        y2={y}
                        stroke="#1e293b"
                        strokeWidth="2.5"
                      />
                      <motion.circle
                        cx="92"
                        cy={y}
                        r="3.5"
                        fill="#38bdf8"
                        animate={{ cx: [92, 168], opacity: [1, 0.2] }}
                        transition={{ duration: 1.4, delay: idx * 0.3, repeat: Infinity }}
                      />

                      {/* Edge Node -> Flower Aggregator (Encrypted Weights Only) */}
                      <path
                        d={`M 285 ${y} C 350 ${y}, 365 155, 425 155`}
                        fill="none"
                        stroke="#0e7490"
                        strokeWidth="2"
                        strokeDasharray="5 5"
                      />
                      <motion.circle
                        r="4"
                        fill="#10b981"
                        animate={{
                          cx: [285, 355, 425],
                          cy: [y, (y + 155) / 2, 155],
                          opacity: [0, 1, 0],
                        }}
                        transition={{ duration: 2.2, delay: idx * 0.45, repeat: Infinity }}
                      />
                    </g>
                  ))}

                  {/* Campus Camera + Edge Node Boxes */}
                  {[
                    { y: 34, label: 'Campus A · T4 Node' },
                    { y: 129, label: 'Campus B · T4 Node' },
                    { y: 224, label: 'Facility C · Orin' },
                  ].map((node, i) => (
                    <g key={node.label}>
                      {/* Camera icon box */}
                      <rect
                        x="14"
                        y={node.y + 6}
                        width="78"
                        height="40"
                        rx="8"
                        fill="#0f172a"
                        stroke="#38bdf8"
                        strokeOpacity="0.45"
                      />
                      <text
                        x="53"
                        y={node.y + 24}
                        textAnchor="middle"
                        fill="#bae6fd"
                        fontSize="9"
                        fontFamily="JetBrains Mono"
                      >
                        RTSP/ONVIF
                      </text>
                      <text
                        x="53"
                        y={node.y + 36}
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="8"
                        fontFamily="JetBrains Mono"
                      >
                        LOCAL LAN
                      </text>

                      {/* Edge AI Box */}
                      <rect
                        x="170"
                        y={node.y}
                        width="116"
                        height="52"
                        rx="10"
                        fill="#0b1324"
                        stroke="#06b6d4"
                        strokeWidth="1.5"
                      />
                      <text
                        x="228"
                        y={node.y + 22}
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize="10"
                        fontWeight="600"
                        fontFamily="Inter"
                      >
                        {node.label}
                      </text>
                      <text
                        x="228"
                        y={node.y + 38}
                        textAnchor="middle"
                        fill="#34d399"
                        fontSize="8.5"
                        fontFamily="JetBrains Mono"
                      >
                        YOLOv11 · RAM ONLY
                      </text>
                    </g>
                  ))}

                  {/* Privacy Air-Gap Barrier */}
                  <line
                    x1="336"
                    y1="18"
                    x2="336"
                    y2="292"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />
                  <rect x="296" y="10" width="80" height="20" rx="6" fill="#064e3b" stroke="#10b981" />
                  <text
                    x="336"
                    y="23"
                    textAnchor="middle"
                    fill="#6ee7b7"
                    fontSize="8.5"
                    fontWeight="700"
                    fontFamily="JetBrains Mono"
                  >
                    VIDEO AIR-GAP
                  </text>

                  {/* Flower FL Central Aggregator */}
                  <motion.rect
                    x="426"
                    y="98"
                    width="196"
                    height="114"
                    rx="14"
                    fill="#081226"
                    stroke="#10b981"
                    strokeWidth="1.8"
                    animate={{ strokeOpacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                  <text
                    x="524"
                    y="128"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="12"
                    fontWeight="700"
                    fontFamily="Space Grotesk"
                  >
                    Flower FL Aggregator
                  </text>
                  <text
                    x="524"
                    y="146"
                    textAnchor="middle"
                    fill="#34d399"
                    fontSize="9.5"
                    fontFamily="JetBrains Mono"
                  >
                    FedAvg Encrypted Weights
                  </text>
                  <rect x="446" y="160" width="156" height="36" rx="8" fill="#0f172a" stroke="#334155" />
                  <text
                    x="524"
                    y="176"
                    textAnchor="middle"
                    fill="#cbd5e1"
                    fontSize="8.5"
                    fontFamily="JetBrains Mono"
                  >
                    FastAPI · Redis · MinIO
                  </text>
                  <text
                    x="524"
                    y="189"
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="8"
                    fontFamily="JetBrains Mono"
                  >
                    OTA Global Model Push
                  </text>
                </svg>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tech text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    Encrypted .pt Gradients Only
                  </span>
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                    Zero-Downtime OTA Sync
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Layer Selector */}
            <div className="lg:col-span-5 space-y-4">
              <div className="grid grid-cols-2 gap-2.5">
                {LAYERS.map((layer) => {
                  const Icon = layer.icon;
                  const active = layer.id === activeLayer;
                  return (
                    <button
                      key={layer.id}
                      onClick={() => setActiveLayer(layer.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-cyan-500/15 border-cyan-500 text-slate-900 dark:text-white'
                          : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/40'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1.5 ${active ? 'text-cyan-500' : ''}`} />
                      <div className="text-xs font-semibold leading-snug">{layer.title}</div>
                    </button>
                  );
                })}
              </div>

              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-600 dark:text-cyan-400">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{current.subtitle}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {current.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {current.details}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {current.metrics.map((m) => (
                    <span
                      key={m}
                      className="text-[11px] font-mono-tech px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Tech Stack Badges */}
        <div className="space-y-4">
          <div className="text-center text-xs font-mono-tech uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Production-Verified Core Stack
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TECH_STACK.map((tech) => (
              <motion.div
                key={tech.name}
                whileHover={{ y: -2 }}
                className="glass-panel rounded-2xl p-3.5 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="font-display font-semibold text-sm text-slate-900 dark:text-white">
                    {tech.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{tech.role}</div>
                </div>
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 shrink-0">
                  {tech.category}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

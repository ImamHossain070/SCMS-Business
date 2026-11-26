import React from 'react';
import { motion } from 'framer-motion';

/**
 * Motion-graphical SVG Edge-AI Vision Simulator.
 * Renders animated bounding boxes, pose skeletons, aerosol plumes,
 * or perimeter tripwires depending on `simType`.
 */
export default function MotionVisionSimulator({ simType = 'fall', compact = false }) {
  const heightClass = compact ? 'h-48' : 'h-64 sm:h-72';

  return (
    <div
      className={`relative w-full ${heightClass} rounded-2xl overflow-hidden bg-[#040812] border border-cyan-500/25 shadow-inner`}
    >
      {/* Subtle CCTV perspective grid */}
      <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 400 220" preserveAspectRatio="none">
        <defs>
          <pattern id={`grid-${simType}`} width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeOpacity="0.4" />
          </pattern>
        </defs>
        <rect width="400" height="220" fill={`url(#grid-${simType})`} />
        {/* Floor horizon lines */}
        <line x1="0" y1="175" x2="400" y2="175" stroke="#06b6d4" strokeOpacity="0.3" strokeDasharray="4 4" />
        <line x1="60" y1="175" x2="140" y2="60" stroke="#06b6d4" strokeOpacity="0.18" />
        <line x1="340" y1="175" x2="260" y2="60" stroke="#06b6d4" strokeOpacity="0.18" />
      </svg>

      {/* Scanning vertical laser */}
      <motion.div
        animate={{ x: ['-10%', '110%'] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent pointer-events-none"
      />

      {/* Mode-specific SVG motion graphics */}
      <svg className="relative z-10 w-full h-full" viewBox="0 0 400 220">
        {simType === 'fall' && (
          <g>
            {/* Bounding box transitioning aspect ratio */}
            <motion.rect
              x="125"
              y="108"
              width="148"
              height="68"
              rx="4"
              fill="rgba(16, 185, 129, 0.08)"
              stroke="#10b981"
              strokeWidth="1.8"
              animate={{ strokeOpacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <rect x="125" y="92" width="136" height="16" rx="3" fill="#10b981" />
            <text x="131" y="103" fill="#022c22" fontSize="9" fontWeight="700" fontFamily="JetBrains Mono">
              FALL_POSE · 97.8%
            </text>
            {/* 17-point pose skeleton lying/collapsed */}
            <motion.g
              stroke="#34d399"
              strokeWidth="2.4"
              strokeLinecap="round"
              animate={{ opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <circle cx="152" cy="134" r="8" fill="#064e3b" />
              <line x1="160" y1="138" x2="205" y2="146" />
              <line x1="174" y1="140" x2="165" y2="160" />
              <line x1="205" y1="146" x2="238" y2="156" />
              <line x1="205" y1="146" x2="246" y2="138" />
              <line x1="238" y1="156" x2="258" y2="162" />
            </motion.g>
            {/* Keypoint nodes */}
            {[
              [152, 134],
              [174, 140],
              [205, 146],
              [238, 156],
              [246, 138],
            ].map(([cx, cy], idx) => (
              <motion.circle
                key={idx}
                cx={cx}
                cy={cy}
                r="3.2"
                fill="#6ee7b7"
                animate={{ r: [2.8, 4.2, 2.8] }}
                transition={{ duration: 1.5, delay: idx * 0.15, repeat: Infinity }}
              />
            ))}
          </g>
        )}

        {(simType === 'fight' || simType === 'hazard') && (
          <g>
            {/* Two colliding bounding boxes with velocity vectors */}
            <motion.g
              animate={{ x: [0, 8, -4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <rect
                x="110"
                y="62"
                width="74"
                height="110"
                rx="4"
                fill="rgba(244, 63, 94, 0.1)"
                stroke="#f43f5e"
                strokeWidth="1.8"
              />
              <circle cx="147" cy="82" r="9" stroke="#fda4af" strokeWidth="2" fill="none" />
              <line x1="147" y1="91" x2="147" y2="132" stroke="#fda4af" strokeWidth="2" />
              <line x1="147" y1="104" x2="178" y2="96" stroke="#f43f5e" strokeWidth="2.5" />
            </motion.g>
            <motion.g
              animate={{ x: [0, -8, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <rect
                x="208"
                y="66"
                width="74"
                height="106"
                rx="4"
                fill="rgba(244, 63, 94, 0.1)"
                stroke="#f43f5e"
                strokeWidth="1.8"
              />
              <circle cx="245" cy="86" r="9" stroke="#fda4af" strokeWidth="2" fill="none" />
              <line x1="245" y1="95" x2="245" y2="134" stroke="#fda4af" strokeWidth="2" />
              <line x1="245" y1="106" x2="212" y2="100" stroke="#f43f5e" strokeWidth="2.5" />
            </motion.g>
            {/* Impact kinetic pulse */}
            <motion.circle
              cx="196"
              cy="102"
              r="14"
              stroke="#fb7185"
              strokeWidth="1.5"
              fill="none"
              animate={{ r: [6, 26], opacity: [0.9, 0] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
            <rect x="110" y="46" width="142" height="16" rx="3" fill="#f43f5e" />
            <text x="116" y="57" fill="#fff1f2" fontSize="9" fontWeight="700" fontFamily="JetBrains Mono">
              {simType === 'fight' ? 'ALTERCATION · 96.4%' : 'HAZARD_OBJ · 96.9%'}
            </text>
          </g>
        )}

        {(simType === 'vaping' || simType === 'ppe') && (
          <g>
            <rect
              x="148"
              y="56"
              width="104"
              height="120"
              rx="4"
              fill="rgba(6, 182, 212, 0.08)"
              stroke="#06b6d4"
              strokeWidth="1.8"
            />
            <rect x="148" y="40" width="128" height="16" rx="3" fill="#06b6d4" />
            <text x="154" y="51" fill="#083344" fontSize="9" fontWeight="700" fontFamily="JetBrains Mono">
              {simType === 'vaping' ? 'AEROSOL_PLUME · 95.2%' : 'PPE_CHECK · 96.0%'}
            </text>
            {/* Person silhouette */}
            <circle cx="200" cy="86" r="11" stroke="#67e8f9" strokeWidth="2" fill="none" />
            <path d="M180 165 L186 108 L214 108 L220 165" stroke="#67e8f9" strokeWidth="2" fill="none" />
            {/* Animated plume / visor particles */}
            {[0, 1, 2, 3].map((i) => (
              <motion.circle
                key={i}
                cx={212 + i * 7}
                cy={84 - i * 4}
                r={4 + i * 2}
                fill="rgba(103, 232, 249, 0.35)"
                animate={{
                  y: [-2, -18],
                  x: [0, 12],
                  opacity: [0.7, 0],
                  scale: [0.8, 1.5],
                }}
                transition={{ duration: 1.8, delay: i * 0.3, repeat: Infinity }}
              />
            ))}
          </g>
        )}

        {(simType === 'vandalism' || simType === 'intrusion' || simType === 'crowd') && (
          <g>
            {/* Polygonal ROI / Tripwire zone */}
            <motion.polygon
              points="70,165 130,78 275,78 335,165"
              fill="rgba(245, 158, 11, 0.08)"
              stroke="#f59e0b"
              strokeWidth="1.6"
              strokeDasharray="6 4"
              animate={{ strokeDashoffset: [0, -20] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <motion.rect
              x="162"
              y="88"
              width="68"
              height="74"
              rx="4"
              fill="rgba(245, 158, 11, 0.14)"
              stroke="#fbbf24"
              strokeWidth="1.8"
              animate={{ x: [152, 178, 152] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <rect x="70" y="60" width="144" height="16" rx="3" fill="#f59e0b" />
            <text x="76" y="71" fill="#451a03" fontSize="9" fontWeight="700" fontFamily="JetBrains Mono">
              {simType === 'vandalism'
                ? 'ROI_TAMPER · 94.1%'
                : simType === 'intrusion'
                ? 'TRIPWIRE_BREACH · 98.1%'
                : 'DENSITY_INDEX · 95.7%'}
            </text>
          </g>
        )}
      </svg>

      {/* HUD Overlay corners */}
      <div className="absolute top-2.5 left-3 flex items-center gap-2 text-[10px] font-mono-tech text-cyan-300/90">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>RTSP://NODE-04 · LOCAL RAM ONLY</span>
      </div>
      <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded bg-slate-950/80 border border-cyan-500/30 text-[10px] font-mono-tech text-emerald-300">
        RAW VIDEO EGRESS: 0 B/s
      </div>
    </div>
  );
}

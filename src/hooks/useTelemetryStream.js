import { wsUrl } from '../lib/api';

const SIMULATED_EVENTS = [
  { module: 'Fall Detection', zone: 'Engineering Wing - Lab B2', severity: 'critical', confidence: 0.96 },
  { module: 'Smoking & Vaping', zone: 'North Dormitory Stairwell 3', severity: 'warning', confidence: 0.91 },
  { module: 'Violence & Fight', zone: 'Central Quad - West Gate', severity: 'critical', confidence: 0.94 },
  { module: 'Vandalism Monitoring', zone: 'Transit Hub - Bike Rack', severity: 'warning', confidence: 0.89 },
  { module: 'Perimeter Intrusion', zone: 'Server Annex - Restricted Zone', severity: 'critical', confidence: 0.97 },
  { module: 'Crowd Density', zone: 'Main Auditorium Foyer', severity: 'info', confidence: 0.93 },
  { module: 'PPE Compliance', zone: 'Chemistry Cleanroom 104', severity: 'warning', confidence: 0.95 },
];

export function useTelemetryStream() {
  const [connected, setConnected] = useState(false);
  const [telemetry, setTelemetry] = useState({
    timestamp: new Date().toTimeString().slice(0, 8),
    fps: 28.4,
    latency_ms: 214,
    active_cameras: 128,
    edge_nodes_online: 16,
    fedavg_round: 418,
    raw_video_egress: '0.00 MB/s',
    encrypted_weights_kb: 512.4,
    event: {
      id: 'A8F21C',
      module: 'Fall Detection',
      zone: 'Engineering Wing - Lab B2',
      severity: 'critical',
      confidence: 0.96,
    },
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let ws;
    let fallbackInterval;
    let isUnmounted = false;

    const pushSample = (sample) => {
      if (isUnmounted) return;
      setTelemetry(sample);
      setHistory((prev) => [sample.event, ...prev].slice(0, 4));
    };

    const startFallback = () => {
      if (fallbackInterval) return;
      let round = 418;
      fallbackInterval = setInterval(() => {
        const picked = SIMULATED_EVENTS[Math.floor(Math.random() * SIMULATED_EVENTS.length)];
        if (Math.random() > 0.7) round += 1;
        pushSample({
          timestamp: new Date().toTimeString().slice(0, 8),
          fps: Number((24.2 + Math.random() * 5.6).toFixed(1)),
          latency_ms: Math.floor(178 + Math.random() * 145),
          active_cameras: 128,
          edge_nodes_online: 16,
          fedavg_round: round,
          raw_video_egress: '0.00 MB/s',
          encrypted_weights_kb: Number((420 + Math.random() * 240).toFixed(1)),
          event: {
            id: Math.random().toString(16).slice(2, 8).toUpperCase(),
            module: picked.module,
            zone: picked.zone,
            severity: picked.severity,
            confidence: Number(Math.min(0.99, picked.confidence + (Math.random() * 0.04 - 0.02)).toFixed(2)),
          },
        });
      }, 2600);
    };

    try {
      ws = new WebSocket(wsUrl('/ws/telemetry'));
      ws.onopen = () => {
        if (!isUnmounted) setConnected(true);
      };
      ws.onmessage = (msg) => {
        try {
          const parsed = JSON.parse(msg.data);
          pushSample(parsed);
        } catch {
          // ignore malformed frames
        }
      };
      ws.onerror = () => {
        if (!isUnmounted) setConnected(false);
        startFallback();
      };
      ws.onclose = () => {
        if (!isUnmounted) setConnected(false);
        startFallback();
      };
    } catch {
      startFallback();
    }

    return () => {
      isUnmounted = true;
      if (ws && ws.readyState < 2) ws.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, []);

  return { telemetry, history, wsConnected: connected };
}

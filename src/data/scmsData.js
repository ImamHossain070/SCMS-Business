export const DETECTION_DOMAINS = [
  {
    id: 'violence-fight',
    title: 'Physical Violence & Fight Detection',
    shortTitle: 'Violence & Fight',
    category: 'Behavioral Safety',
    accuracy: '96.4%',
    latency: '210ms',
    model: 'YOLOv11-Pose + Temporal GCN',
    simType: 'fight',
    accent: 'rose',
    summary:
      'Detects aggressive physical altercations, rapid limb velocity spikes, and crowd scuffles in real time without storing identifiable video.',
    highlights: [
      'Multi-person skeletal kinematics & velocity vectors',
      'Instant dispatch alert with anonymized bounding metadata',
      'Filters out consensual sports & normal physical contact',
    ],
  },
  {
    id: 'smoking-vaping',
    title: 'Smoking & Vaping Detection',
    shortTitle: 'Smoking & Vaping',
    category: 'Health & Policy',
    accuracy: '95.2%',
    latency: '195ms',
    model: 'YOLOv8-Small + Plume CNN',
    simType: 'vaping',
    accent: 'cyan',
    summary:
      'Pinpoints cigarette lighting, e-cigarette/vape aerosol plumes, and hand-to-mouth micro-gestures in restrooms, stairwells, and dormitories.',
    highlights: [
      'Sub-second aerosol & micro-object recognition',
      'Privacy-safe stairwell & corridor monitoring',
      'Automated compliance incident logging',
    ],
  },
  {
    id: 'fall-detection',
    title: 'Workplace Fall Detection',
    shortTitle: 'Fall Detection',
    category: 'Medical & EHS',
    accuracy: '97.8%',
    latency: '180ms',
    model: 'YOLOv11-Pose + Aspect Ratio',
    simType: 'fall',
    accent: 'emerald',
    summary:
      'Combines 17-point pose estimation with bounding-box aspect ratio collapse and vertical velocity tracking to trigger immediate medical response.',
    highlights: [
      '17-keypoint skeletal pose & torso angle tracking',
      'Zero-immobility verification to eliminate false alarms',
      'Ideal for labs, workshops, & senior care campuses',
    ],
  },
];

export const TECH_STACK = [
  { name: 'Ultralytics YOLOv8/v11', role: 'Edge Vision & Pose Inference', category: 'AI Core' },
  { name: 'PyTorch', role: 'Deep Learning Runtime', category: 'AI Core' },
  { name: 'Flower FL', role: 'Federated Learning (FedAvg)', category: 'Privacy' },
  { name: 'FastAPI', role: 'Async Control Plane & WS', category: 'Backend' },
  { name: 'Redis', role: 'Sub-ms Event Pub/Sub', category: 'Streaming' },
  { name: 'PostgreSQL', role: 'Audit & RBAC Metadata', category: 'Database' },
  { name: 'InfluxDB', role: 'Time-Series Telemetry', category: 'Metrics' },
  { name: 'MinIO', role: 'Encrypted Weight & Artifact Store', category: 'Storage' },
];

export const FAQ_ITEMS = [
  {
    q: 'How does SCMS guarantee zero raw-video transmission?',
    a: 'All RTSP/ONVIF camera feeds are decoded and processed strictly inside your local on-premises Edge AI node (e.g., NVIDIA T4 or Jetson Orin). Raw frames stay in volatile RAM and are discarded milliseconds after inference. Only anonymized JSON alert metadata and encrypted PyTorch model weight deltas ever leave your LAN.',
  },
  {
    q: 'What camera and edge hardware is compatible?',
    a: 'SCMS is 100% hardware-agnostic. Any existing IP camera supporting standard RTSP or ONVIF protocols works out of the box—no proprietary camera replacements required. On the compute side, we support NVIDIA T4, L4, A10G, and Jetson Orin edge appliances running containerized Docker/Kubernetes runtimes.',
  },
  {
    q: 'How does Federated Learning (Flower FL) improve accuracy without sharing data?',
    a: 'Using the Flower Framework and FedAvg (Federated Averaging), each campus edge node locally fine-tunes weights on anonymized edge cases. Periodically, encrypted weight updates are aggregated at the central coordinator to build a smarter global model, which is then pushed back via Over-The-Air (OTA) updates.',
  },
  {
    q: 'How do organizations get started with an SCMS deployment?',
    a: 'All deployments are handled on an appointment basis. Book a consultation with our solutions architects to review your camera topology, select your detection models, and schedule a 14-day on-premises pilot tailored to your facility.',
  },
];

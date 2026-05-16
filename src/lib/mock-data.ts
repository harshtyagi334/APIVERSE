import { API } from "@/types";

export const MOCK_APIS: API[] = [
  {
    id: 'api-1',
    name: 'Gemini Vision v3',
    description: 'Advanced multimodal AI model for image understanding and reasoning. Next-generation vision capabilities for enterprise apps.',
    category: 'AI & Machine Learning',
    provider: 'Google AI',
    icon: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304fe6292a2f75f.svg',
    rating: 4.9,
    reviewsCount: 1240,
    usageCount: 850000,
    latency: 120,
    uptime: 99.99,
    tags: ['vision', 'ai', 'multimodal'],
    isPremium: true,
    isTrending: true,
    docsUrl: '#',
    baseUrl: 'https://generativelanguage.googleapis.com',
    pricing: 'Freemium',
    createdAt: '2026-01-01',
    endpoints: [
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'GET',
        path: '/v1/status',
        description: 'Check the operational status of the service.',
        parameters: [
          { name: 'verbose', type: 'boolean', required: false, description: 'Return detailed status', in: 'query' }
        ],
        responses: [
          { status: 200, description: 'Service is operating normally', example: '{"status": "operational", "latency": "12ms"}' }
        ]
      },
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'POST',
        path: '/v1/query',
        description: 'Execute a complex query against the primary dataset.',
        parameters: [
          { name: 'query', type: 'string', required: true, description: 'The query payload', in: 'body' }
        ],
        responses: [
          { status: 200, description: 'Query results', example: '{"results": [], "count": 0}' }
        ]
      }
    ]
  },
  {
    id: 'api-2',
    name: 'Stripe Global Pay',
    description: 'Accept payments from anyone, anywhere. The most comprehensive global payment infrastructure for the internet.',
    category: 'Payments',
    provider: 'Stripe',
    icon: 'https://raw.githubusercontent.com/framer/framer-motion/main/packages/framer-motion/assets/icon.png',
    rating: 4.8,
    reviewsCount: 5200,
    usageCount: 12000000,
    latency: 85,
    uptime: 100,
    tags: ['payments', 'finance', 'payouts'],
    isPremium: false,
    isTrending: true,
    docsUrl: '#',
    baseUrl: 'https://api.stripe.com',
    pricing: 'Paid',
    createdAt: '2025-05-10',
    endpoints: [
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'GET',
        path: '/v1/status',
        description: 'Check the operational status of the service.',
        parameters: [
          { name: 'verbose', type: 'boolean', required: false, description: 'Return detailed status', in: 'query' }
        ],
        responses: [
          { status: 200, description: 'Service is operating normally', example: '{"status": "operational", "latency": "12ms"}' }
        ]
      },
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'POST',
        path: '/v1/query',
        description: 'Execute a complex query against the primary dataset.',
        parameters: [
          { name: 'query', type: 'string', required: true, description: 'The query payload', in: 'body' }
        ],
        responses: [
          { status: 200, description: 'Query results', example: '{"results": [], "count": 0}' }
        ]
      }
    ]
  },
  {
    id: 'api-4',
    name: 'Ghost Protocol mTLS',
    description: 'High-speed mutual TLS authentication layer with zero-trust architecture. Secure your microservices with ease.',
    category: 'Security',
    provider: 'ShieldLabs',
    icon: 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/shield.svg',
    rating: 4.9,
    reviewsCount: 420,
    usageCount: 950000,
    latency: 12,
    uptime: 99.999,
    tags: ['security', 'auth', 'mtls'],
    isPremium: true,
    isTrending: true,
    docsUrl: '#',
    baseUrl: 'https://auth.ghost.io',
    pricing: 'Paid',
    createdAt: '2026-03-12',
    endpoints: [
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'GET',
        path: '/v1/status',
        description: 'Check the operational status of the service.',
        parameters: [
          { name: 'verbose', type: 'boolean', required: false, description: 'Return detailed status', in: 'query' }
        ],
        responses: [
          { status: 200, description: 'Service is operating normally', example: '{"status": "operational", "latency": "12ms"}' }
        ]
      },
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'POST',
        path: '/v1/query',
        description: 'Execute a complex query against the primary dataset.',
        parameters: [
          { name: 'query', type: 'string', required: true, description: 'The query payload', in: 'body' }
        ],
        responses: [
          { status: 200, description: 'Query results', example: '{"results": [], "count": 0}' }
        ]
      }
    ]
  },
  {
    id: 'api-5',
    name: 'Nova Search',
    description: 'Instant, typo-tolerant search for massive datasets. Scalable indexing for global commerce.',
    category: 'Data & Analytics',
    provider: 'Nova Cloud',
    icon: 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/search.svg',
    rating: 4.7,
    reviewsCount: 610,
    usageCount: 2400000,
    latency: 45,
    uptime: 99.98,
    tags: ['search', 'data', 'indexing'],
    isPremium: false,
    isTrending: true,
    docsUrl: '#',
    baseUrl: 'https://api.nova.search',
    pricing: 'Freemium',
    createdAt: '2026-02-28',
    endpoints: [
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'GET',
        path: '/v1/status',
        description: 'Check the operational status of the service.',
        parameters: [
          { name: 'verbose', type: 'boolean', required: false, description: 'Return detailed status', in: 'query' }
        ],
        responses: [
          { status: 200, description: 'Service is operating normally', example: '{"status": "operational", "latency": "12ms"}' }
        ]
      },
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'POST',
        path: '/v1/query',
        description: 'Execute a complex query against the primary dataset.',
        parameters: [
          { name: 'query', type: 'string', required: true, description: 'The query payload', in: 'body' }
        ],
        responses: [
          { status: 200, description: 'Query results', example: '{"results": [], "count": 0}' }
        ]
      }
    ]
  },
  {
    id: 'api-6',
    name: 'Synthetix Audio',
    description: 'Ultra-realistic text-to-speech with emotional depth. Support for 40+ languages with studio quality.',
    category: 'Communication',
    provider: 'Synthetix AI',
    icon: 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/audio-lines.svg',
    rating: 4.6,
    reviewsCount: 290,
    usageCount: 120000,
    latency: 210,
    uptime: 99.9,
    tags: ['audio', 'ai', 'tts'],
    isPremium: false,
    isTrending: false,
    docsUrl: '#',
    baseUrl: 'https://tts.synthetix.ai',
    pricing: 'Freemium',
    createdAt: '2026-04-01',
    endpoints: [
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'GET',
        path: '/v1/status',
        description: 'Check the operational status of the service.',
        parameters: [
          { name: 'verbose', type: 'boolean', required: false, description: 'Return detailed status', in: 'query' }
        ],
        responses: [
          { status: 200, description: 'Service is operating normally', example: '{"status": "operational", "latency": "12ms"}' }
        ]
      },
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'POST',
        path: '/v1/query',
        description: 'Execute a complex query against the primary dataset.',
        parameters: [
          { name: 'query', type: 'string', required: true, description: 'The query payload', in: 'body' }
        ],
        responses: [
          { status: 200, description: 'Query results', example: '{"results": [], "count": 0}' }
        ]
      }
    ]
  },
  {
    id: 'api-7',
    name: 'Atlas Maps SDK',
    description: 'High-performance vector maps with real-time traffic and advanced route optimization for global fleet management.',
    category: 'Maps & Location',
    provider: 'Atlas Geographics',
    icon: 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/map.svg',
    rating: 4.8,
    reviewsCount: 890,
    usageCount: 5600000,
    latency: 110,
    uptime: 99.99,
    tags: ['maps', 'vectors', 'location'],
    isPremium: true,
    isTrending: true,
    docsUrl: '#',
    baseUrl: 'https://api.atlas.geo',
    pricing: 'Paid',
    createdAt: '2026-01-15',
    endpoints: [
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'GET',
        path: '/v1/status',
        description: 'Check the operational status of the service.',
        parameters: [
          { name: 'verbose', type: 'boolean', required: false, description: 'Return detailed status', in: 'query' }
        ],
        responses: [
          { status: 200, description: 'Service is operating normally', example: '{"status": "operational", "latency": "12ms"}' }
        ]
      },
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'POST',
        path: '/v1/query',
        description: 'Execute a complex query against the primary dataset.',
        parameters: [
          { name: 'query', type: 'string', required: true, description: 'The query payload', in: 'body' }
        ],
        responses: [
          { status: 200, description: 'Query results', example: '{"results": [], "count": 0}' }
        ]
      }
    ]
  },
  {
    id: 'api-8',
    name: 'Vault Auth v2',
    description: 'Biometric and hardware-based identity verification. SEC-compliant KYC/AML protocols for fintech platforms.',
    category: 'Identity',
    provider: 'VaultSecurity',
    icon: 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/fingerprint.svg',
    rating: 4.9,
    reviewsCount: 310,
    usageCount: 1200000,
    latency: 180,
    uptime: 99.999,
    tags: ['identity', 'auth', 'kyc'],
    isPremium: true,
    isTrending: false,
    docsUrl: '#',
    baseUrl: 'https://auth.vault.io',
    pricing: 'Paid',
    createdAt: '2026-02-10',
    endpoints: [
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'GET',
        path: '/v1/status',
        description: 'Check the operational status of the service.',
        parameters: [
          { name: 'verbose', type: 'boolean', required: false, description: 'Return detailed status', in: 'query' }
        ],
        responses: [
          { status: 200, description: 'Service is operating normally', example: '{"status": "operational", "latency": "12ms"}' }
        ]
      },
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'POST',
        path: '/v1/query',
        description: 'Execute a complex query against the primary dataset.',
        parameters: [
          { name: 'query', type: 'string', required: true, description: 'The query payload', in: 'body' }
        ],
        responses: [
          { status: 200, description: 'Query results', example: '{"results": [], "count": 0}' }
        ]
      }
    ]
  },
  {
    id: 'api-9',
    name: 'Nexus DevTools',
    description: 'Unified observability and debugging suite for distributed systems. Real-time trace analysis and performance profiling.',
    category: 'DevTools',
    provider: 'GlobalNode',
    icon: 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/cpu.svg',
    rating: 4.7,
    reviewsCount: 540,
    usageCount: 890000,
    latency: 35,
    uptime: 99.95,
    tags: ['devtools', 'debug', 'observability'],
    isPremium: false,
    isTrending: true,
    docsUrl: '#',
    baseUrl: 'https://dev.globalnode.net',
    pricing: 'Freemium',
    createdAt: '2026-03-05',
    endpoints: [
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'GET',
        path: '/v1/status',
        description: 'Check the operational status of the service.',
        parameters: [
          { name: 'verbose', type: 'boolean', required: false, description: 'Return detailed status', in: 'query' }
        ],
        responses: [
          { status: 200, description: 'Service is operating normally', example: '{"status": "operational", "latency": "12ms"}' }
        ]
      },
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'POST',
        path: '/v1/query',
        description: 'Execute a complex query against the primary dataset.',
        parameters: [
          { name: 'query', type: 'string', required: true, description: 'The query payload', in: 'body' }
        ],
        responses: [
          { status: 200, description: 'Query results', example: '{"results": [], "count": 0}' }
        ]
      }
    ]
  },
  {
    id: 'api-10',
    name: 'EcoTrack API',
    description: 'Global carbon footprint tracking and ESG reporting. Real-time environmental metrics for sustainable enterprise.',
    category: 'Data & Analytics',
    provider: 'GreenGrid AI',
    icon: 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/leaf.svg',
    rating: 4.5,
    reviewsCount: 150,
    usageCount: 45000,
    latency: 140,
    uptime: 99.9,
    tags: ['esg', 'carbon', 'data'],
    isPremium: false,
    isTrending: false,
    docsUrl: '#',
    baseUrl: 'https://api.ecotrack.ai',
    pricing: 'Freemium',
    createdAt: '2026-04-20',
    endpoints: [
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'GET',
        path: '/v1/status',
        description: 'Check the operational status of the service.',
        parameters: [
          { name: 'verbose', type: 'boolean', required: false, description: 'Return detailed status', in: 'query' }
        ],
        responses: [
          { status: 200, description: 'Service is operating normally', example: '{"status": "operational", "latency": "12ms"}' }
        ]
      },
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'POST',
        path: '/v1/query',
        description: 'Execute a complex query against the primary dataset.',
        parameters: [
          { name: 'query', type: 'string', required: true, description: 'The query payload', in: 'body' }
        ],
        responses: [
          { status: 200, description: 'Query results', example: '{"results": [], "count": 0}' }
        ]
      }
    ]
  },
  {
    id: 'api-legacy-1',
    name: 'Legacy SMS Gateway',
    description: 'Reliable SMS delivery for heritage systems. Low-latency global reach with fallback protocols.',
    category: 'Communication',
    provider: 'TelecomStack',
    icon: 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/message-square.svg',
    rating: 4.2,
    reviewsCount: 3400,
    usageCount: 50000000,
    latency: 350,
    uptime: 99.8,
    tags: ['sms', 'telecom', 'legacy'],
    isPremium: false,
    isTrending: false,
    docsUrl: '#',
    baseUrl: 'https://sms.telecom.io',
    pricing: 'Paid',
    createdAt: '2023-11-05',
    endpoints: [
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'GET',
        path: '/v1/status',
        description: 'Check the operational status of the service.',
        parameters: [
          { name: 'verbose', type: 'boolean', required: false, description: 'Return detailed status', in: 'query' }
        ],
        responses: [
          { status: 200, description: 'Service is operating normally', example: '{"status": "operational", "latency": "12ms"}' }
        ]
      },
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'POST',
        path: '/v1/query',
        description: 'Execute a complex query against the primary dataset.',
        parameters: [
          { name: 'query', type: 'string', required: true, description: 'The query payload', in: 'body' }
        ],
        responses: [
          { status: 200, description: 'Query results', example: '{"results": [], "count": 0}' }
        ]
      }
    ]
  },
  {
    id: 'api-trending-99',
    name: 'Quantum Compute v1',
    description: 'Cloud-based quantum processing for cryptography and optimization research. Massively parallel qubit execution.',
    category: 'AI & Machine Learning',
    provider: 'QubitLabs',
    icon: 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/atom.svg',
    rating: 4.9,
    reviewsCount: 88,
    usageCount: 25000000,
    latency: 15,
    uptime: 99.9999,
    tags: ['quantum', 'compute', 'crypto'],
    isPremium: true,
    isTrending: true,
    docsUrl: '#',
    baseUrl: 'https://q1.qubitlabs.ai',
    pricing: 'Paid',
    createdAt: '2026-05-01',
    endpoints: [
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'GET',
        path: '/v1/status',
        description: 'Check the operational status of the service.',
        parameters: [
          { name: 'verbose', type: 'boolean', required: false, description: 'Return detailed status', in: 'query' }
        ],
        responses: [
          { status: 200, description: 'Service is operating normally', example: '{"status": "operational", "latency": "12ms"}' }
        ]
      },
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'POST',
        path: '/v1/query',
        description: 'Execute a complex query against the primary dataset.',
        parameters: [
          { name: 'query', type: 'string', required: true, description: 'The query payload', in: 'body' }
        ],
        responses: [
          { status: 200, description: 'Query results', example: '{"results": [], "count": 0}' }
        ]
      }
    ]
  },
  {
    id: 'api-new-apex',
    name: 'Apex Vision Gen',
    description: 'Ultra-fast text-to-image with zero-shot learning. Generate 4k assets in under 500ms.',
    category: 'AI & Machine Learning',
    provider: 'VisualApex',
    icon: 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/image.svg',
    rating: 4.8,
    reviewsCount: 12,
    usageCount: 1500,
    latency: 450,
    uptime: 99.9,
    tags: ['image', 'gen', 'ai'],
    isPremium: false,
    isTrending: true,
    docsUrl: '#',
    baseUrl: 'https://api.apex.vision',
    pricing: 'Freemium',
    createdAt: '2026-05-12',
    endpoints: [
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'GET',
        path: '/v1/status',
        description: 'Check the operational status of the service.',
        parameters: [
          { name: 'verbose', type: 'boolean', required: false, description: 'Return detailed status', in: 'query' }
        ],
        responses: [
          { status: 200, description: 'Service is operating normally', example: '{"status": "operational", "latency": "12ms"}' }
        ]
      },
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'POST',
        path: '/v1/query',
        description: 'Execute a complex query against the primary dataset.',
        parameters: [
          { name: 'query', type: 'string', required: true, description: 'The query payload', in: 'body' }
        ],
        responses: [
          { status: 200, description: 'Query results', example: '{"results": [], "count": 0}' }
        ]
      }
    ]
  },
  {
    id: 'api-new-1',
    name: 'Neural Flux v4',
    description: 'Dynamic neural network architecture that adapts to incoming data patterns in real-time. Extreme efficiency for IoT devices.',
    category: 'AI & Machine Learning',
    provider: 'Flux AI',
    icon: 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/brain-circuit.svg',
    rating: 4.9,
    reviewsCount: 45,
    usageCount: 12000,
    latency: 18,
    uptime: 99.99,
    tags: ['neural', 'iot', 'edge'],
    isPremium: true,
    isTrending: true,
    docsUrl: '#',
    baseUrl: 'https://api.flux.ai',
    pricing: 'Paid',
    createdAt: '2026-05-13',
    endpoints: [
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'GET',
        path: '/v1/status',
        description: 'Check the operational status of the service.',
        parameters: [
          { name: 'verbose', type: 'boolean', required: false, description: 'Return detailed status', in: 'query' }
        ],
        responses: [
          { status: 200, description: 'Service is operating normally', example: '{"status": "operational", "latency": "12ms"}' }
        ]
      },
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'POST',
        path: '/v1/query',
        description: 'Execute a complex query against the primary dataset.',
        parameters: [
          { name: 'query', type: 'string', required: true, description: 'The query payload', in: 'body' }
        ],
        responses: [
          { status: 200, description: 'Query results', example: '{"results": [], "count": 0}' }
        ]
      }
    ]
  },
  {
    id: 'api-perf-1',
    name: 'HyperNode CDN',
    description: 'Ultra-low latency content delivery network with edge-side computed response headers. Globally distributed nodes.',
    category: 'DevTools',
    provider: 'HyperStack',
    icon: 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/network.svg',
    rating: 4.8,
    reviewsCount: 890,
    usageCount: 12500000,
    latency: 5,
    uptime: 100,
    tags: ['cdn', 'performance', 'latency'],
    isPremium: false,
    isTrending: false,
    docsUrl: '#',
    baseUrl: 'https://cdn.hypernode.com',
    pricing: 'Freemium',
    createdAt: '2026-01-20',
    endpoints: [
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'GET',
        path: '/v1/status',
        description: 'Check the operational status of the service.',
        parameters: [
          { name: 'verbose', type: 'boolean', required: false, description: 'Return detailed status', in: 'query' }
        ],
        responses: [
          { status: 200, description: 'Service is operating normally', example: '{"status": "operational", "latency": "12ms"}' }
        ]
      },
      {
        id: `ep-${Math.random().toString(36).substr(2, 5)}`,
        method: 'POST',
        path: '/v1/query',
        description: 'Execute a complex query against the primary dataset.',
        parameters: [
          { name: 'query', type: 'string', required: true, description: 'The query payload', in: 'body' }
        ],
        responses: [
          { status: 200, description: 'Query results', example: '{"results": [], "count": 0}' }
        ]
      }
    ]
  }
];

export const CATEGORIES = [
  "All",
  "AI & Machine Learning",
  "Payments",
  "Data & Analytics",
  "Security",
  "Communication",
  "DevTools",
  "Maps & Location",
  "Identity"
];

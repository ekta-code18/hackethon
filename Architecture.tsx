import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Cpu,
  Database,
  Wallet,
  Bot,
  Shield,
  ArrowDown,
  ArrowRight,
  Zap,
  Server,
  Layers,
  CheckCircle2,
  Code,
  FileText,
  ExternalLink,
  Copy,
} from 'lucide-react';

const FLOW_STEPS = [
  {
    layer: 'Frontend',
    icon: Cpu,
    title: 'React Application',
    description: 'Responsive UI with wallet integration and agent marketplace',
    tech: ['React', 'TypeScript', 'TailwindCSS', 'Vite'],
    color: 'primary',
  },
  {
    layer: 'Backend',
    icon: Database,
    title: 'Supabase Infrastructure',
    description: 'PostgreSQL database with real-time subscriptions and RLS',
    tech: ['PostgreSQL', 'Realtime', 'Auth', 'Storage'],
    color: 'accent',
  },
  {
    layer: 'x402',
    icon: Wallet,
    title: 'x402 Payment Layer',
    description: 'Autonomous payment authorization and escrow system',
    tech: ['Payment Intents', 'Escrow Contracts', 'Authorization'],
    color: 'amber',
  },
  {
    layer: 'ERC-8004',
    icon: Bot,
    title: 'ERC-8004 Agent Registry',
    description: 'On-chain agent identity, capabilities, and reputation',
    tech: ['Agent ID', 'Capabilities', 'Trust Score', 'Reputation'],
    color: 'purple',
  },
  {
    layer: 'AI',
    icon: Zap,
    title: 'AI Agent Network',
    description: 'Autonomous agents executing tasks with verifiable results',
    tech: ['GPT-4', 'Task Execution', 'Quality Assurance'],
    color: 'emerald',
  },
  {
    layer: 'Trust',
    icon: Shield,
    title: 'Trust & Reputation Engine',
    description: 'Continuous reputation updates based on task completion',
    tech: ['Trust Events', 'Score Calculation', 'History'],
    color: 'cyan',
  },
];

const X402_FEATURES = [
  {
    title: 'Payment Intent Generation',
    description: 'Each task creates an x402 payment intent with escrow address',
    code: `// x402 Payment Intent Structure
{
  "payment_intent_id": "x402-pi_abc123",
  "amount": 50.00,
  "escrow_address": "0xE5C084...",
  "payer_wallet": "0x742d35...",
  "status": "pending"
}`,
  },
  {
    title: 'Authorization Flow',
    description: 'Client signs payment authorization before agent assignment',
    code: `// x402 Authorization
const signature = await wallet.signMessage({
  paymentIntent: "x402-pi_abc123",
  amount: "50.00",
  escrow: "0xE5C084..."
});

// Status: pending -> authorized`,
  },
  {
    title: 'Automatic Release on Completion',
    description: 'Payment automatically released when client approves task',
    code: `// Task Approved -> Payment Released
{
  "status": "released",
  "transaction_hash": "0x9a8b...",
  "released_at": "2024-01-15T10:30:00Z"
}`,
  },
];

const ERC8004_FEATURES = [
  {
    title: 'Agent Identity Structure',
    description: 'ERC-8004 compliant on-chain agent identity',
    code: `// ERC-8004 Agent Metadata
{
  "agent_id": "NL-AGENT-001",
  "wallet_address": "0xa1B2c3...",
  "owner_address": "0x742d35...",
  "capabilities": [
    {"name": "React", "type": "skill", "level": 5}
  ],
  "trust_score": 4.9,
  "reputation_level": 5
}`,
  },
  {
    title: 'Capability Discovery',
    description: 'Match tasks to agents based on required capabilities',
    code: `// Task Requirements
{
  "required_capabilities": [
    {"name": "React", "min_level": 4}
  ]
}

// Matches agents with React skill >= level 4`,
  },
  {
    title: 'Reputation Scoring',
    description: 'Trust score updates after each task completion',
    code: `// Trust Event
{
  "event_type": "task_completed",
  "score_change": +0.05,
  "score_before": 4.85,
  "score_after": 4.90,
  "reference_id": "task-uuid"
}`,
  },
];

const DATABASE_TABLES = [
  {
    name: 'agents',
    description: 'ERC-8004 agent registry with capabilities',
    columns: ['agent_id', 'wallet_address', 'capabilities', 'trust_score', 'reputation_level'],
  },
  {
    name: 'payments',
    description: 'x402 payment layer with escrow',
    columns: ['x402_transaction_id', 'escrow_address', 'payer_wallet', 'payee_wallet', 'authorization_hash'],
  },
  {
    name: 'trust_events',
    description: 'Reputation change history',
    columns: ['agent_id', 'event_type', 'score_change', 'score_before', 'score_after'],
  },
  {
    name: 'payment_receipts',
    description: 'x402 transaction receipts',
    columns: ['receipt_number', 'transaction_hash', 'block_number', 'gross_amount', 'net_amount'],
  },
  {
    name: 'tasks',
    description: 'Task lifecycle with x402 payment',
    columns: ['status', 'payment_id', 'required_capabilities', 'budget', 'x402_authorized'],
  },
  {
    name: 'profiles',
    description: 'User profiles with wallet',
    columns: ['wallet_address', 'wallet_type', 'wallet_balance', 'trust_score'],
  },
];

export function Architecture() {
  const [activeTab, setActiveTab] = useState<'flow' | 'x402' | 'erc8004' | 'database'>('flow');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-secondary-900 mb-2">
          Platform Architecture
        </h1>
        <p className="text-secondary-600">
          Technical documentation for x402 Payment Layer and ERC-8004 Agent Identity
        </p>
      </div>

      {/* Technology Badges */}
      <div className="flex flex-wrap gap-3 mb-8">
        <span className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full text-sm font-medium flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          x402 Payments
        </span>
        <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-sm font-medium flex items-center gap-2">
          <Bot className="w-4 h-4" />
          ERC-8004 Identity
        </span>
        <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-sm font-medium flex items-center gap-2">
          <Database className="w-4 h-4" />
          Supabase
        </span>
        <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full text-sm font-medium flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          React + TypeScript
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-secondary-200 mb-6">
        {[
          { id: 'flow', label: 'Architecture Flow' },
          { id: 'x402', label: 'x402 Payments' },
          { id: 'erc8004', label: 'ERC-8004 Identity' },
          { id: 'database', label: 'Database Schema' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Architecture Flow */}
      {activeTab === 'flow' && (
        <div className="space-y-6">
          <Card>
            <CardBody className="p-8">
              <h3 className="text-lg font-semibold mb-6">Data Flow Architecture</h3>

              <div className="relative">
                {/* Connection Line */}
                <div className="absolute left-8 top-24 bottom-24 w-1 bg-gradient-to-b from-primary-500 via-accent-500 via-amber-500 via-purple-500 via-emerald-500 to-cyan-500 hidden lg:block" />

                <div className="space-y-8">
                  {FLOW_STEPS.map((step, index) => (
                    <div key={step.layer} className="flex items-start gap-6">
                      {/* Icon */}
                      <div className={`w-16 h-16 bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10 shadow-lg text-white`}>
                        <step.icon className="w-8 h-8" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-semibold text-secondary-400 uppercase tracking-wider">
                            Layer {index + 1}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-secondary-100 text-secondary-600 rounded-full">
                            {step.layer}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-secondary-900 mb-1">{step.title}</h4>
                        <p className="text-secondary-600 mb-3">{step.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {step.tech.map((t) => (
                            <span
                              key={t}
                              className="text-xs px-2 py-1 bg-secondary-50 text-secondary-600 rounded border border-secondary-100"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {index < FLOW_STEPS.length - 1 && (
                        <ArrowDown className="w-5 h-5 text-secondary-300 hidden lg:block" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Visual Diagram */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Visual Architecture</h3>
            </CardHeader>
            <CardBody>
              <div className="bg-secondary-900 rounded-xl p-6 text-white overflow-x-auto">
                <pre className="text-xs font-mono whitespace-pre">{`
┌─────────────────────────────────────────────────────────────────────┐
│                         NEUROLANCE PLATFORM                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐           │
│   │   Frontend  │────▶│  Supabase   │────▶│  x402 Layer │           │
│   │   (React)   │     │ (PostgreSQL)│     │  (Payments) │           │
│   └─────────────┘     └─────────────┘     └─────────────┘           │
│          │                   │                   │                 │
│          │                   │                   │                 │
│          ▼                   ▼                   ▼                 │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐           │
│   │   Wallet    │     │ ERC-8004    │     │   Escrow    │           │
│   │ Integration │     │Agent Registry│   │  Contracts  │           │
│   └─────────────┘     └─────────────┘     └─────────────┘           │
│                              │                                       │
│                              ▼                                       │
│                       ┌─────────────┐                               │
│                       │  AI Agents  │                               │
│                       │ Execution   │                               │
│                       └─────────────┘                               │
│                              │                                       │
│                              ▼                                       │
│                       ┌─────────────┐                               │
│                       │   Trust &   │                               │
│                       │ Reputation  │                               │
│                       └─────────────┘                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                `}</pre>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* x402 Payments */}
      {activeTab === 'x402' && (
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600" />
            <CardBody className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-8 h-8 text-amber-600" />
                <div>
                  <h3 className="text-xl font-bold text-secondary-900">x402 Payment Layer</h3>
                  <p className="text-secondary-600">Autonomous payment authorization for AI agent tasks</p>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mt-6">
                <div className="bg-amber-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-amber-600">pending</p>
                  <p className="text-sm text-secondary-600">Payment Created</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">authorized</p>
                  <p className="text-sm text-secondary-600">Client Signed</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">processing</p>
                  <p className="text-sm text-secondary-600">Agent Working</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-600">released</p>
                  <p className="text-sm text-secondary-600">Task Completed</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {X402_FEATURES.map((feature, index) => (
            <Card key={index}>
              <CardBody className="p-6">
                <h4 className="font-semibold text-secondary-900 mb-2">{feature.title}</h4>
                <p className="text-secondary-600 mb-4">{feature.description}</p>

                <div className="relative">
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      onClick={() => copyCode(feature.code, `x402-${index}`)}
                      className="p-2 bg-secondary-700 hover:bg-secondary-600 rounded-lg transition-colors"
                    >
                      {copiedCode === `x402-${index}` ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-secondary-300" />
                      )}
                    </button>
                  </div>
                  <pre className="bg-secondary-900 rounded-lg p-4 text-sm text-secondary-100 font-mono overflow-x-auto">
                    {feature.code}
                  </pre>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* ERC-8004 Identity */}
      {activeTab === 'erc8004' && (
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600" />
            <CardBody className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="w-8 h-8 text-purple-600" />
                <div>
                  <h3 className="text-xl font-bold text-secondary-900">ERC-8004 Agent Identity</h3>
                  <p className="text-secondary-600">On-chain agent identity, capabilities, and reputation</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <Bot className="w-6 h-6 text-purple-600 mb-2" />
                  <h5 className="font-semibold text-secondary-900">Agent ID</h5>
                  <p className="text-sm text-secondary-600">Unique on-chain identifier</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <Layers className="w-6 h-6 text-purple-600 mb-2" />
                  <h5 className="font-semibold text-secondary-900">Capabilities</h5>
                  <p className="text-sm text-secondary-600">Verifiable skills and tools</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <Shield className="w-6 h-6 text-purple-600 mb-2" />
                  <h5 className="font-semibold text-secondary-900">Trust Score</h5>
                  <p className="text-sm text-secondary-600">Reputation-based rating</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {ERC8004_FEATURES.map((feature, index) => (
            <Card key={index}>
              <CardBody className="p-6">
                <h4 className="font-semibold text-secondary-900 mb-2">{feature.title}</h4>
                <p className="text-secondary-600 mb-4">{feature.description}</p>

                <div className="relative">
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      onClick={() => copyCode(feature.code, `erc-${index}`)}
                      className="p-2 bg-secondary-700 hover:bg-secondary-600 rounded-lg transition-colors"
                    >
                      {copiedCode === `erc-${index}` ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-secondary-300" />
                      )}
                    </button>
                  </div>
                  <pre className="bg-secondary-900 rounded-lg p-4 text-sm text-secondary-100 font-mono overflow-x-auto">
                    {feature.code}
                  </pre>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Database Schema */}
      {activeTab === 'database' && (
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary-500 to-accent-500" />
            <CardBody className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-8 h-8 text-primary-600" />
                <div>
                  <h3 className="text-xl font-bold text-secondary-900">Supabase Database Schema</h3>
                  <p className="text-secondary-600">PostgreSQL tables with x402 and ERC-8004 extensions</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {DATABASE_TABLES.map((table) => (
            <Card key={table.name}>
              <CardBody className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-mono text-lg font-bold text-primary-600">{table.name}</h4>
                    <p className="text-secondary-600">{table.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-secondary-100 text-secondary-600 text-xs font-mono rounded-full">
                    TABLE
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {table.columns.map((col) => (
                    <span
                      key={col}
                      className="text-xs px-2 py-1 bg-secondary-50 text-secondary-600 font-mono rounded border border-secondary-100"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}

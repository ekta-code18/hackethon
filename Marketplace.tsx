import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/layout/Layout';
import { Card, CardBody } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search, Filter, X, Zap, Shield, CheckCircle, Star, ExternalLink, Wallet, Bot } from 'lucide-react';

// 6 Demo agents with x402 and ERC-8004 data
const DEMO_AGENTS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    agent_id: 'NL-AGENT-001',
    name: 'Webie AI',
    description: 'Expert web development AI specializing in React, Next.js, and modern web frameworks. Delivers clean, production-ready code.',
    specialty: 'Web Development',
    wallet_address: '0xa1B2c3D4e5F6789012345678901234567890aBCD',
    avatar_url: null,
    hourly_rate: 25,
    trust_score: 4.9,
    rating: 4.9,
    total_tasks_completed: 156,
    specialties: ['React', 'Next.js', 'TypeScript', 'Node.js', 'CSS'],
    capabilities: [{ name: 'React', type: 'skill', proficiency_level: 5 }, { name: 'Next.js', type: 'skill', proficiency_level: 5 }],
    is_active: true,
    is_verified: true,
    success_rate: 98,
    reputation_level: 5,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    agent_id: 'NL-AGENT-002',
    name: 'DesignBot',
    description: 'Creative AI agent for UI/UX design, Figma workflows, and design system creation. Transforms ideas into pixel-perfect designs.',
    specialty: 'UI/UX Design',
    wallet_address: '0xb2C3d4E5f678901234567890123456789012BcDe',
    avatar_url: null,
    hourly_rate: 22,
    trust_score: 4.8,
    rating: 4.8,
    total_tasks_completed: 134,
    specialties: ['UI Design', 'UX Research', 'Figma', 'Design Systems', 'Prototyping'],
    capabilities: [{ name: 'UI Design', type: 'skill', proficiency_level: 5 }, { name: 'Figma', type: 'tool', proficiency_level: 5 }],
    is_active: true,
    is_verified: true,
    success_rate: 97,
    reputation_level: 4,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    agent_id: 'NL-AGENT-003',
    name: 'ContentGPT',
    description: 'Content creation specialist for blog posts, articles, and SEO-optimized copy. Powered by GPT-4 with advanced NLP.',
    specialty: 'Content Writing',
    wallet_address: '0xc3D4e5F67890123456789012345678901234CdEf',
    avatar_url: null,
    hourly_rate: 18,
    trust_score: 4.9,
    rating: 4.9,
    total_tasks_completed: 189,
    specialties: ['Blog Posts', 'SEO Writing', 'Copywriting', 'Technical Writing', 'Marketing Copy'],
    capabilities: [{ name: 'Content Writing', type: 'skill', proficiency_level: 5 }, { name: 'SEO', type: 'skill', proficiency_level: 5 }],
    is_active: true,
    is_verified: true,
    success_rate: 99,
    reputation_level: 5,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    agent_id: 'NL-AGENT-004',
    name: 'DataMind',
    description: 'Data analysis expert for Python, SQL, and statistical analysis. Creates visualizations and actionable insights from raw data.',
    specialty: 'Data Analysis',
    wallet_address: '0xd4E5f678901234567890123456789012345DeF0',
    avatar_url: null,
    hourly_rate: 28,
    trust_score: 4.7,
    rating: 4.7,
    total_tasks_completed: 98,
    specialties: ['Python', 'SQL', 'Data Visualization', 'Statistics', 'Machine Learning'],
    capabilities: [{ name: 'Python', type: 'skill', proficiency_level: 5 }, { name: 'SQL', type: 'skill', proficiency_level: 5 }],
    is_active: true,
    is_verified: true,
    success_rate: 96,
    reputation_level: 4,
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    agent_id: 'NL-AGENT-005',
    name: 'SalesAgent',
    description: 'AI-powered lead generation and sales automation. Identifies prospects, crafts outreach, and manages CRM pipelines.',
    specialty: 'Lead Generation',
    wallet_address: '0xe5F67890123456789012345678901234567Ef01',
    avatar_url: null,
    hourly_rate: 24,
    trust_score: 4.6,
    rating: 4.6,
    total_tasks_completed: 112,
    specialties: ['Lead Research', 'Email Outreach', 'CRM Management', 'Sales Scripts', 'Prospecting'],
    capabilities: [{ name: 'Lead Research', type: 'skill', proficiency_level: 5 }, { name: 'CRM', type: 'tool', proficiency_level: 5 }],
    is_active: true,
    is_verified: true,
    success_rate: 94,
    reputation_level: 3,
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    agent_id: 'NL-AGENT-006',
    name: 'AutoFlow AI',
    description: 'Workflow automation specialist using Zapier, Make, and custom API integrations. Automates repetitive tasks efficiently.',
    specialty: 'Workflow Automation',
    wallet_address: '0xf6789012345678901234567890123456789F012',
    avatar_url: null,
    hourly_rate: 30,
    trust_score: 4.8,
    rating: 4.8,
    total_tasks_completed: 87,
    specialties: ['Zapier', 'Make.com', 'API Integration', 'Process Automation', 'Webhooks'],
    capabilities: [{ name: 'Zapier', type: 'tool', proficiency_level: 5 }, { name: 'API Integration', type: 'skill', proficiency_level: 5 }],
    is_active: true,
    is_verified: true,
    success_rate: 97,
    reputation_level: 4,
  },
];

export function Marketplace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [agents] = useState(DEMO_AGENTS);
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // No loading state - show agents instantly

  const filteredAgents = agents.filter((agent) => {
    // Filter by search
    if (search) {
      const q = search.toLowerCase();
      const matchesSearch =
        agent.name.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.specialty.toLowerCase().includes(q) ||
        agent.specialties.some((s) => s.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    // Filter by specialty
    if (selectedSpecialty && agent.specialty !== selectedSpecialty) {
      return false;
    }

    return true;
  });

  const specialties = [...new Set(DEMO_AGENTS.map(a => a.specialty))];

  function handleHireAgent(agentId: string) {
    navigate(`/agents/${agentId}/dashboard`);
  }

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="font-display text-3xl font-bold text-secondary-900">AI Agent Marketplace</h1>
          <span className="px-2 py-1 bg-accent-100 text-accent-700 text-xs font-medium rounded-full">6 Agents Online</span>
        </div>
        <p className="text-secondary-600">Find the perfect AI agent for your task - ready to work instantly</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card className="sticky top-32">
            <CardBody>
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-secondary-700 mb-3">Specialty</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedSpecialty('')}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        !selectedSpecialty ? 'bg-primary-100 text-primary-700 font-medium' : 'text-secondary-600 hover:bg-secondary-50'
                      }`}
                    >
                      All Agents
                    </button>
                    {specialties.map((specialty) => (
                      <button
                        key={specialty}
                        onClick={() => setSelectedSpecialty(specialty)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                          selectedSpecialty === specialty ? 'bg-primary-100 text-primary-700 font-medium' : 'text-secondary-600 hover:bg-secondary-50'
                        }`}
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedSpecialty && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSpecialty('')}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                )}

                {/* Quick Stats */}
                <div className="pt-4 border-t border-secondary-100">
                  <p className="text-xs text-secondary-500 uppercase tracking-wider mb-3">Platform Stats</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Active Agents</span>
                      <span className="font-semibold text-secondary-900">6</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Avg Rating</span>
                      <span className="font-semibold text-secondary-900">4.8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Success Rate</span>
                      <span className="font-semibold text-secondary-900">97%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <Input
                type="search"
                placeholder="Search agents by name, skill, or specialty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="secondary"
              icon={<Filter className="w-4 h-4" />}
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              Filters
            </Button>
          </div>

          {/* Instant Results - No Loading */}
          {filteredAgents.length === 0 ? (
            <div className="text-center py-12 bg-secondary-50 rounded-xl">
              <Search className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
              <h3 className="font-semibold text-secondary-900 mb-2">No agents found</h3>
              <p className="text-secondary-600 mb-4">Try adjusting your search or filters</p>
              <Button variant="ghost" onClick={() => { setSearch(''); setSelectedSpecialty(''); }}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-secondary-600 mb-4">
                Showing {filteredAgents.length} AI agent{filteredAgents.length !== 1 ? 's' : ''} ready to work
              </p>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAgents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} onHire={() => handleHireAgent(agent.id)} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

function AgentCard({ agent, onHire }: { agent: typeof DEMO_AGENTS[0]; onHire: () => void }) {
  return (
    <Card hover className="h-full">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary-500/20">
            {agent.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-secondary-900">{agent.name}</h3>
              {agent.is_verified && (
                <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  ERC-8004
                </span>
              )}
            </div>
            <p className="text-sm text-primary-600 font-medium">{agent.specialty}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-secondary-400">
              <Bot className="w-3 h-3" />
              <span className="font-mono">{agent.agent_id}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-secondary-900">${agent.hourly_rate}</p>
            <p className="text-xs text-secondary-500">/hour</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-secondary-600 text-sm mb-4 line-clamp-2">{agent.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2 bg-secondary-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-yellow-500">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-semibold text-secondary-900 text-sm">{agent.trust_score}</span>
            </div>
            <p className="text-xs text-secondary-500 mt-0.5">Trust</p>
          </div>
          <div className="text-center p-2 bg-secondary-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-emerald-500">
              <CheckCircle className="w-3 h-3" />
              <span className="font-semibold text-secondary-900 text-sm">{agent.success_rate}%</span>
            </div>
            <p className="text-xs text-secondary-500 mt-0.5">Success</p>
          </div>
          <div className="text-center p-2 bg-secondary-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-primary-500">
              <Shield className="w-3 h-3" />
              <span className="font-semibold text-secondary-900 text-sm">{agent.total_tasks_completed}</span>
            </div>
            <p className="text-xs text-secondary-500 mt-0.5">Tasks</p>
          </div>
          <div className="text-center p-2 bg-secondary-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-purple-500">
              <span className="font-semibold text-secondary-900 text-sm">L{agent.reputation_level}</span>
            </div>
            <p className="text-xs text-secondary-500 mt-0.5">Level</p>
          </div>
        </div>

        {/* Capabilities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {agent.capabilities?.slice(0, 4).map((cap) => (
            <span
              key={cap.name}
              className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full flex items-center gap-1"
            >
              {cap.name}
              <span className="text-primary-400">Lv{cap.proficiency_level}</span>
            </span>
          ))}
        </div>

        {/* Wallet Address */}
        <div className="flex items-center gap-2 text-xs text-secondary-400 mb-4 bg-secondary-50 rounded px-2 py-1">
          <Wallet className="w-3 h-3" />
          <span className="font-mono truncate">{agent.wallet_address}</span>
        </div>

        {/* Hire Button */}
        <Button
          onClick={onHire}
          className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500"
          icon={<Zap className="w-4 h-4" />}
        >
          Hire Agent
        </Button>
      </div>
    </Card>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Sparkles,
  Zap,
  Bot,
  Brain,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Shield,
  TrendingUp,
  Target,
  Activity,
  Users,
  FileText,
  Star,
  Award,
  Clock,
  Loader2,
  Play,
  RefreshCw,
} from 'lucide-react';

type DemoStage =
  | 'idle'
  | 'task-creation'
  | 'matching'
  | 'agent-selection'
  | 'execution'
  | 'payment'
  | 'analytics'
  | 'complete';

interface Task {
  title: string;
  description: string;
  budget: number;
  skills: string[];
  priority: 'low' | 'medium' | 'high';
}

interface Agent {
  id: string;
  name: string;
  trustScore: number;
  completionRate: number;
  price: number;
  avatar: string;
  skills: string[];
  specialties: string[];
}

interface ExecutionProgress {
  percent: number;
  status: string;
}

const MATCHING_MESSAGES = [
  { text: 'Analyzing Task Requirements...', duration: 200 },
  { text: 'Searching Agent Network...', duration: 200 },
  { text: 'Matching Skills...', duration: 200 },
  { text: 'Finding Best Agent...', duration: 200 },
];

const EXECUTION_STEPS = [
  { percent: 0, status: 'Initializing...' },
  { percent: 20, status: 'Analyzing Requirements' },
  { percent: 40, status: 'Planning Strategy' },
  { percent: 60, status: 'Executing Task' },
  { percent: 80, status: 'Quality Review' },
  { percent: 100, status: 'Complete!' },
];

const SAMPLE_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'ContentAgent Pro',
    trustScore: 4.9,
    completionRate: 98,
    price: 20,
    avatar: '📝',
    skills: ['Content Writing', 'SEO', 'Research', 'Editing'],
    specialties: ['Blog Posts', 'Articles', 'Marketing Copy'],
  },
  {
    id: '2',
    name: 'ResearchAgent X',
    trustScore: 4.8,
    completionRate: 97,
    price: 18,
    avatar: '🔍',
    skills: ['Data Analysis', 'Market Research', 'Reports', 'Competitive Analysis'],
    specialties: ['Market Research', 'Data Insights', 'Industry Reports'],
  },
  {
    id: '3',
    name: 'MarketingAgent AI',
    trustScore: 4.7,
    completionRate: 95,
    price: 15,
    avatar: '📢',
    skills: ['Social Media', 'Campaign Strategy', 'Copywriting', 'Analytics'],
    specialties: ['Social Media', 'Ad Campaigns', 'Brand Strategy'],
  },
];

const ANALYTICS_DATA = {
  totalTasks: 152,
  activeAgents: 48,
  revenue: 12450,
  successRate: 98.7,
};

export function HackathonDemo() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<DemoStage>('idle');
  const [task, setTask] = useState<Task>({
    title: 'Write a comprehensive blog post about AI agents',
    description: 'Create a detailed, engaging blog post about autonomous AI agents and their role in the future of work. Include real-world examples and statistics.',
    budget: 20,
    skills: ['Content Writing', 'Research', 'SEO'],
    priority: 'medium',
  });
  const [matchedAgents, setMatchedAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [matchingMessage, setMatchingMessage] = useState('');
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [executionProgress, setExecutionProgress] = useState<ExecutionProgress>({ percent: 0, status: '' });
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [animatingStats, setAnimatingStats] = useState(false);
  const [demoStats, setDemoStats] = useState({ tasks: 0, agents: 0, revenue: 0, success: 0 });

  // Run full demo - optimized for speed (max 3 seconds per stage)
  const runFullDemo = useCallback(() => {
    setStage('task-creation');

    // Quick transition to matching
    setTimeout(() => {
      setStage('matching');
      runMatchingSequence();
    }, 400);
  }, []);

  const runMatchingSequence = () => {
    let messageIndex = 0;

    const showNextMessage = () => {
      if (messageIndex < MATCHING_MESSAGES.length) {
        setMatchingMessage(MATCHING_MESSAGES[messageIndex].text);
        setMatchingProgress(((messageIndex + 1) / MATCHING_MESSAGES.length) * 100);
        messageIndex++;
        setTimeout(showNextMessage, MATCHING_MESSAGES[messageIndex - 1]?.duration || 200);
      } else {
        // Matching complete, show agents immediately
        setMatchedAgents(SAMPLE_AGENTS);
        setStage('agent-selection');
      }
    };

    showNextMessage();
  };

  const selectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setStage('execution');
    runExecutionSequence();
  };

  const runExecutionSequence = () => {
    let stepIndex = 0;

    const runNextStep = () => {
      if (stepIndex < EXECUTION_STEPS.length) {
        const step = EXECUTION_STEPS[stepIndex];
        setExecutionProgress({ percent: step.percent, status: step.status });
        stepIndex++;
        setTimeout(runNextStep, 400);
      } else {
        // Execution complete, show payment
        setGeneratedOutput(generateSampleOutput());
        setTimeout(() => {
          setStage('payment');
          setTimeout(() => {
            setStage('analytics');
            animateStats();
          }, 2000);
        }, 300);
      }
    };

    runNextStep();
  };

  const generateSampleOutput = () => {
    return `# The Rise of Autonomous AI Agents

## Transforming the Future of Work

In an era where artificial intelligence is reshaping every industry, autonomous AI agents represent the next frontier of digital transformation. These sophisticated systems can independently execute tasks, make decisions, and adapt to changing circumstances—all without human intervention.

### Key Insights:

1. **Market Growth**: The AI agent market is projected to reach $47.1 billion by 2030, growing at a CAGR of 42.8%.

2. **Productivity Boost**: Companies using AI agents report a 40% increase in operational efficiency and a 35% reduction in task completion time.

3. **Trust Economy**: Platforms like NeuroLance are pioneering trust-based systems where AI agents build reputation through verified task completion.

### Real-World Applications:

- **Content Creation**: AI agents like ContentAgent Pro produce high-quality blog posts, articles, and marketing copy
- **Data Research**: Research agents analyze market trends and deliver actionable insights
- **Customer Support**: Autonomous agents handle 80% of customer inquiries without human escalation

### The Future is Now:

As trust mechanisms evolve and multi-agent collaboration improves, we're entering an age where AI agents don't just assist—they lead. The question isn't whether AI agents will transform your business, but how quickly you'll adapt to this new paradigm.

---

*This content was generated by ContentAgent Pro with a trust score of 4.9/5.0*`;
  };

  const animateStats = () => {
    setAnimatingStats(true);
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDemoStats({
        tasks: Math.round(ANALYTICS_DATA.totalTasks * eased),
        agents: Math.round(ANALYTICS_DATA.activeAgents * eased),
        revenue: Math.round(ANALYTICS_DATA.revenue * eased),
        success: Math.round(ANALYTICS_DATA.successRate * 10 * eased) / 10,
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const resetDemo = () => {
    setStage('idle');
    setMatchedAgents([]);
    setSelectedAgent(null);
    setMatchingMessage('');
    setMatchingProgress(0);
    setExecutionProgress({ percent: 0, status: '' });
    setGeneratedOutput('');
    setDemoStats({ tasks: 0, agents: 0, revenue: 0, success: 0 });
    setAnimatingStats(false);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">NeuroLance Demo</h1>
          <p className="text-secondary-600">Complete AI Agent Marketplace Experience</p>
        </div>
        <div className="flex gap-3">
          {stage !== 'idle' && (
            <Button variant="ghost" onClick={resetDemo} icon={<RefreshCw className="w-4 h-4" />}>
              Reset
            </Button>
          )}
          <Button
            onClick={runFullDemo}
            className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500"
            icon={<Play className="w-4 h-4" />}
          >
            Run Full Demo
          </Button>
        </div>
      </div>

      {/* Demo Content */}
      <div className="min-h-[600px]">
        {/* Idle State - Landing */}
        {stage === 'idle' && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 p-12 text-center text-white">
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-4xl font-bold mb-4">AI Agent Marketplace Demo</h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Watch the complete flow: Create a task, match with AI agents, execute work, and release payment.
              </p>

              <Button
                onClick={runFullDemo}
                size="lg"
                className="bg-white text-primary-700 hover:bg-white/90 px-12 py-4 text-lg"
                icon={<Play className="w-5 h-5" />}
              >
                Run Full Demo
              </Button>

              <div className="mt-8 grid grid-cols-4 gap-6 max-w-3xl mx-auto">
                {[
                  { label: 'Task Creation', icon: FileText },
                  { label: 'Agent Matching', icon: Bot },
                  { label: 'Task Execution', icon: Zap },
                  { label: 'Payment', icon: DollarSign },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm text-white/70">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Task Creation Stage */}
        {stage === 'task-creation' && (
          <div className="max-w-2xl mx-auto animate-fadeIn">
            <Card className="overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary-500 to-accent-500" />
              <CardBody className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-secondary-900">Creating Task</h2>
                  <p className="text-secondary-600">Submitting your request to the AI marketplace</p>
                </div>

                <div className="space-y-4 bg-secondary-50 rounded-xl p-6">
                  <div>
                    <label className="text-sm text-secondary-500">Task Title</label>
                    <p className="font-medium text-secondary-900">{task.title}</p>
                  </div>
                  <div>
                    <label className="text-sm text-secondary-500">Description</label>
                    <p className="text-secondary-700">{task.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-secondary-500">Budget</label>
                      <p className="font-semibold text-accent-600">${task.budget}</p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary-500">Priority</label>
                      <p className="font-medium text-secondary-700 capitalize">{task.priority}</p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary-500">Skills Required</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {task.skills.slice(0, 2).map(skill => (
                          <span key={skill} className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-3 text-primary-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="animate-pulse">Submitting to marketplace...</span>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Matching Stage */}
        {stage === 'matching' && (
          <div className="max-w-2xl mx-auto animate-fadeIn">
            <Card className="overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-accent-500 animate-pulse" />
              <CardBody className="p-12 text-center">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Bot className="w-16 h-16 text-white" />
                  </div>
                  {/* Scanning ring */}
                  <div className="absolute -inset-4 border-4 border-dashed border-primary-300 rounded-3xl animate-spin" style={{ animationDuration: '3s' }} />
                </div>

                <h2 className="text-2xl font-bold text-secondary-900 mb-4">AI Matching System</h2>

                <div className="h-8 mb-6">
                  <p className="text-lg text-primary-600 font-medium">{matchingMessage}</p>
                </div>

                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-between text-sm text-secondary-500 mb-2">
                    <span>Matching Progress</span>
                    <span>{Math.round(matchingProgress)}%</span>
                  </div>
                  <div className="h-3 bg-secondary-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300"
                      style={{ width: `${matchingProgress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-4 text-secondary-400">
                  {MATCHING_MESSAGES.map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-all ${
                        i < Math.ceil(matchingProgress / 25)
                          ? 'bg-primary-500 scale-125'
                          : 'bg-secondary-200'
                      }`}
                    />
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Agent Selection Stage */}
        {stage === 'agent-selection' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 text-accent-700 rounded-full mb-4">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-medium">3 Agents Matched!</span>
              </div>
              <h2 className="text-2xl font-bold text-secondary-900">Select Your Agent</h2>
              <p className="text-secondary-600">Choose the best AI agent for your task</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {matchedAgents.map((agent, index) => (
                <Card
                  key={agent.id}
                  className={`relative overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                    index === 0 ? 'ring-2 ring-accent-400' : ''
                  }`}
                  onClick={() => selectAgent(agent)}
                >
                  {index === 0 && (
                    <div className="absolute top-0 right-0 bg-accent-500 text-white text-xs px-3 py-1 font-medium">
                      Best Match
                    </div>
                  )}
                  <CardBody className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl">
                        {agent.avatar}
                      </div>
                      <h3 className="font-bold text-secondary-900">{agent.name}</h3>
                      <div className="flex items-center justify-center gap-1 text-yellow-500 mt-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{agent.trustScore}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-secondary-500">Completion Rate</span>
                        <span className="font-semibold text-accent-600">{agent.completionRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-secondary-500">Price</span>
                        <span className="font-bold text-primary-600">${agent.price}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-secondary-100">
                      <p className="text-xs text-secondary-500 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="text-xs bg-secondary-100 text-secondary-700 px-2 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectAgent(agent);
                      }}
                      icon={<Zap className="w-4 h-4" />}
                    >
                      Hire Agent
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Execution Stage */}
        {stage === 'execution' && selectedAgent && (
          <div className="max-w-3xl mx-auto animate-fadeIn">
            {/* Agent Status */}
            <Card className="mb-6 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary-500 to-accent-500" />
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                    {selectedAgent.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-secondary-900">{selectedAgent.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-secondary-600">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        {selectedAgent.trustScore} Trust
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4 text-accent-500" />
                        {selectedAgent.completionRate}% Success
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Working
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">${selectedAgent.price}</p>
                    <p className="text-sm text-secondary-500">Budget</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Progress Section */}
            <Card className="mb-6">
              <CardBody className="p-8">
                <div className="text-center mb-8">
                  <div className="relative w-40 h-40 mx-auto">
                    {/* Progress ring */}
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-secondary-100"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={`${executionProgress.percent * 4.4} 440`}
                        strokeLinecap="round"
                        className="text-primary-500 transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-secondary-900">{executionProgress.percent}%</p>
                        <p className="text-sm text-secondary-500">Complete</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-lg font-medium text-primary-600">{executionProgress.status}</p>
                </div>

                {/* Execution steps */}
                <div className="space-y-3">
                  {EXECUTION_STEPS.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        executionProgress.percent >= step.percent
                          ? 'bg-accent-500 text-white'
                          : 'bg-secondary-100 text-secondary-400'
                      }`}>
                        {executionProgress.percent >= step.percent ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-medium">{i + 1}</span>
                        )}
                      </div>
                      <span className={`text-sm ${executionProgress.percent >= step.percent ? 'text-secondary-900' : 'text-secondary-400'}`}>
                        {step.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Output Preview */}
            {generatedOutput && (
              <Card className="animate-slideUp">
                <CardBody className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-accent-500" />
                    <h3 className="font-semibold text-secondary-900">Generated Output</h3>
                  </div>
                  <div className="bg-secondary-50 rounded-xl p-4 max-h-60 overflow-auto">
                    <pre className="text-sm text-secondary-700 whitespace-pre-wrap font-sans">{generatedOutput}</pre>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        )}

        {/* Payment Stage */}
        {stage === 'payment' && selectedAgent && (
          <div className="max-w-lg mx-auto animate-fadeIn">
            <Card className="overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-amber-500 to-accent-500" />
              <CardBody className="p-8">
                {/* Success Header */}
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-accent-500/30">
                      <DollarSign className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -inset-2 border-4 border-accent-400/30 rounded-full animate-ping" />
                    <CheckCircle2 className="absolute -bottom-1 -right-1 w-8 h-8 text-accent-500 bg-white rounded-full" />
                  </div>
                  <h2 className="text-2xl font-bold text-secondary-900 mt-6">Payment Released</h2>
                  <p className="text-secondary-600">Transaction completed successfully</p>
                </div>

                {/* Payment Details */}
                <div className="bg-gradient-to-br from-secondary-900 to-secondary-800 rounded-2xl p-6 text-white mb-6">
                  <div className="text-center mb-6">
                    <p className="text-white/60 text-sm uppercase tracking-wider">Amount Released</p>
                    <p className="text-5xl font-bold mt-2">${selectedAgent.price}</p>
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">Transaction ID</span>
                      <span className="font-mono text-accent-400">TXN-2025-847392</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Status</span>
                      <span className="flex items-center gap-1 text-accent-400">
                        <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
                        Released
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Agent Wallet</span>
                      <span className="font-semibold">$1,240</span>
                    </div>
                  </div>
                </div>

                {/* Trust Score Update */}
                <div className="bg-primary-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-primary-600" />
                      <div>
                        <p className="text-sm text-primary-700">Trust Score Update</p>
                        <p className="text-xs text-primary-500">Based on task completion</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-secondary-600">{selectedAgent.trustScore - 0.1}</span>
                      <ArrowRight className="w-4 h-4 text-accent-500" />
                      <span className="text-xl font-bold text-accent-600">{selectedAgent.trustScore}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => {
                      setStage('analytics');
                      animateStats();
                    }}
                    className="w-full"
                    icon={<Activity className="w-4 h-4" />}
                  >
                    View Analytics Dashboard
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Analytics Stage */}
        {stage === 'analytics' && (
          <div className="animate-fadeIn">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl" />
                <CardBody className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-primary-500" />
                  </div>
                  <p className="text-3xl font-bold text-secondary-900">{demoStats.tasks}</p>
                  <p className="text-secondary-500 text-sm">Total Tasks</p>
                </CardBody>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-500/10 rounded-full blur-2xl" />
                <CardBody className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <Users className="w-5 h-5 text-accent-500" />
                  </div>
                  <p className="text-3xl font-bold text-secondary-900">{demoStats.agents}</p>
                  <p className="text-secondary-500 text-sm">Active Agents</p>
                </CardBody>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
                <CardBody className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                  </div>
                  <p className="text-3xl font-bold text-secondary-900">${demoStats.revenue.toLocaleString()}</p>
                  <p className="text-secondary-500 text-sm">Revenue Generated</p>
                </CardBody>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
                <CardBody className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <Award className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p className="text-3xl font-bold text-secondary-900">{demoStats.success}%</p>
                  <p className="text-secondary-500 text-sm">Success Rate</p>
                </CardBody>
              </Card>
            </div>

            {/* Demo Complete */}
            <Card className="overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-accent-500 to-primary-500" />
              <CardBody className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-2">Demo Complete!</h2>
                <p className="text-secondary-600 mb-8">
                  You've experienced the complete NeuroLance AI Agent Marketplace workflow
                </p>

                <div className="grid grid-cols-5 gap-4 mb-8 max-w-3xl mx-auto">
                  {[
                    { label: 'Task Created', icon: FileText, done: true },
                    { label: 'Agent Matched', icon: Bot, done: true },
                    { label: 'Work Executed', icon: Zap, done: true },
                    { label: 'Payment Released', icon: DollarSign, done: true },
                    { label: 'Trust Updated', icon: Shield, done: true },
                  ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center">
                        <step.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs text-secondary-600 text-center">{step.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-4">
                  <Button variant="secondary" onClick={resetDemo} icon={<RefreshCw className="w-4 h-4" />}>
                    Run Again
                  </Button>
                  <Button onClick={() => navigate('/')} icon={<ArrowRight className="w-4 h-4" />}>
                    Back to Home
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>

      {/* Why NeuroLance Section - Always visible below demo */}
      <div className="mt-12 pt-12 border-t border-secondary-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-secondary-900">Why NeuroLance?</h2>
          <p className="text-secondary-600">The future of autonomous AI workforce</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
            <CardBody className="p-6 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">Autonomous AI Workforce</h3>
              <p className="text-secondary-600 text-sm">
                AI agents complete work without human intervention, delivering results 24/7 with consistent quality.
              </p>
            </CardBody>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full blur-3xl" />
            <CardBody className="p-6 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">Instant Payments</h3>
              <p className="text-secondary-600 text-sm">
                Payments are automatically released after successful task completion with zero delays.
              </p>
            </CardBody>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
            <CardBody className="p-6 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">Trust & Reputation</h3>
              <p className="text-secondary-600 text-sm">
                Every completed task increases agent reputation scores, building a verifiable trust economy.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Platform Architecture */}
      <div className="mt-12 pb-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-secondary-900">Platform Architecture</h2>
          <p className="text-secondary-600">How NeuroLance works end-to-end</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 via-accent-500 to-emerald-500 -translate-x-1/2" />

          <div className="space-y-6">
            {[
              { label: 'User', icon: Users, desc: 'Posts tasks with requirements and budget', color: 'primary' },
              { label: 'NeuroLance Platform', icon: Brain, desc: 'Matches tasks with best-fit AI agents', color: 'accent' },
              { label: 'AI Agent Marketplace', icon: Bot, desc: 'Verified agents compete for tasks', color: 'purple' },
              { label: 'Task Execution Engine', icon: Zap, desc: 'Multi-agent collaboration completes work', color: 'amber' },
              { label: 'Payment System', icon: DollarSign, desc: 'Instant, secure payment release', color: 'emerald' },
              { label: 'Trust Score Update', icon: Shield, desc: 'Reputation grows with each task', color: 'cyan' },
            ].map((step, i) => (
              <div key={i} className={`relative flex items-center gap-6 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-4 rounded-xl bg-${step.color}-50`}>
                    <h4 className="font-bold text-secondary-900">{step.label}</h4>
                    <p className="text-sm text-secondary-600">{step.desc}</p>
                  </div>
                </div>
                <div className={`w-16 h-16 bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 rounded-2xl flex items-center justify-center relative z-10 shadow-lg text-white`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
      `}</style>
    </Layout>
  );
}

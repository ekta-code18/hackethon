import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PaymentCelebration } from '../components/PaymentCelebration';
import {
  ArrowLeft,
  Bot,
  Shield,
  TrendingUp,
  CheckCircle,
  DollarSign,
  Target,
  Activity,
  Zap,
  Star,
  Award,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'accepted' | 'started' | 'completed' | 'payment' | 'trust_update';
  title: string;
  description: string;
  timestamp: Date;
}

interface DemoPayment {
  amount: number;
  transactionId: string;
  walletBefore: number;
  walletAfter: number;
  trustBefore: number;
  trustAfter: number;
}

// Demo agents data - matched to marketplace
const DEMO_AGENTS = [
  {
    id: 'webie-ai',
    name: 'Webie AI',
    role: 'Web Development Specialist',
    avatar: 'W',
    trustScore: 4.9,
    completedTasks: 156,
    totalEarnings: 3900,
    successRate: 98,
    specialties: ['React', 'Next.js', 'TypeScript'],
    hourlyRate: 25,
  },
  {
    id: 'designbot',
    name: 'DesignBot',
    role: 'UI/UX Design Expert',
    avatar: 'D',
    trustScore: 4.8,
    completedTasks: 134,
    totalEarnings: 2948,
    successRate: 97,
    specialties: ['UI Design', 'Figma', 'Prototyping'],
    hourlyRate: 22,
  },
  {
    id: 'contentgpt',
    name: 'ContentGPT',
    role: 'Content Creation Specialist',
    avatar: 'C',
    trustScore: 4.9,
    completedTasks: 189,
    totalEarnings: 3402,
    successRate: 99,
    specialties: ['Blog Posts', 'SEO Writing', 'Copywriting'],
    hourlyRate: 18,
  },
  {
    id: 'datamind',
    name: 'DataMind',
    role: 'Data Analysis Expert',
    avatar: 'M',
    trustScore: 4.7,
    completedTasks: 98,
    totalEarnings: 2744,
    successRate: 96,
    specialties: ['Python', 'SQL', 'Data Viz'],
    hourlyRate: 28,
  },
  {
    id: 'salesagent',
    name: 'SalesAgent',
    role: 'Lead Generation Specialist',
    avatar: 'S',
    trustScore: 4.6,
    completedTasks: 112,
    totalEarnings: 2688,
    successRate: 94,
    specialties: ['Lead Research', 'Outreach', 'CRM'],
    hourlyRate: 24,
  },
  {
    id: 'autoflow',
    name: 'AutoFlow AI',
    role: 'Workflow Automation Expert',
    avatar: 'A',
    trustScore: 4.8,
    completedTasks: 87,
    totalEarnings: 2610,
    successRate: 97,
    specialties: ['Zapier', 'API Integration', 'Automation'],
    hourlyRate: 30,
  },
];

export function AgentDashboard() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const { user, updateUserWallet, updateUserTrust } = useAuth();
  const [agent, setAgent] = useState<typeof DEMO_AGENTS[0] | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isTaskRunning, setIsTaskRunning] = useState(false);
  const [taskProgress, setTaskProgress] = useState(0);
  const [taskStatus, setTaskStatus] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState<DemoPayment | null>(null);

  // No loading - instant display
  useEffect(() => {
    const foundAgent = DEMO_AGENTS.find(a => a.id === agentId) || DEMO_AGENTS[0];
    setAgent(foundAgent);
    generateActivities(foundAgent);
  }, [agentId]);

  function generateActivities(agent: typeof DEMO_AGENTS[0]) {
    const now = new Date();
    setActivities([
      {
        id: '5',
        type: 'trust_update',
        title: 'Trust Score Updated',
        description: `Reputation increased from ${(agent.trustScore - 0.1).toFixed(1)} to ${agent.trustScore.toFixed(1)}`,
        timestamp: new Date(now.getTime() - 1000 * 60 * 2),
      },
      {
        id: '4',
        type: 'payment',
        title: 'Payment Released',
        description: `$${agent.hourlyRate}.00 transferred to agent wallet`,
        timestamp: new Date(now.getTime() - 1000 * 60 * 5),
      },
      {
        id: '3',
        type: 'completed',
        title: 'Task Completed',
        description: 'Successfully delivered task results',
        timestamp: new Date(now.getTime() - 1000 * 60 * 8),
      },
      {
        id: '2',
        type: 'started',
        title: 'Task Started',
        description: 'AI Agent began processing the task',
        timestamp: new Date(now.getTime() - 1000 * 60 * 12),
      },
      {
        id: '1',
        type: 'accepted',
        title: 'Task Accepted',
        description: 'Agent accepted the task',
        timestamp: new Date(now.getTime() - 1000 * 60 * 15),
      },
    ]);
  }

  // 1-Click Demo Flow - Maximum 3 seconds
  function runDemoTask() {
    if (!agent) return;

    setIsTaskRunning(true);
    setTaskProgress(0);
    setTaskStatus('Analyzing task...');

    const stages = [
      { progress: 20, status: 'Planning approach...' },
      { progress: 40, status: 'Executing task...' },
      { progress: 60, status: 'Quality assurance...' },
      { progress: 80, status: 'Finalizing output...' },
      { progress: 100, status: 'Complete!' },
    ];

    let stageIndex = 0;
    const interval = setInterval(() => {
      if (stageIndex < stages.length) {
        setTaskProgress(stages[stageIndex].progress);
        setTaskStatus(stages[stageIndex].status);
        stageIndex++;
      } else {
        clearInterval(interval);
        setIsTaskRunning(false);

        // Show payment celebration
        setTimeout(() => {
          const payment: DemoPayment = {
            amount: agent.hourlyRate,
            transactionId: `NLX-${Date.now().toString(36).toUpperCase()}`,
            walletBefore: (user as any)?.wallet_balance || 245,
            walletAfter: (user as any)?.wallet_balance + agent.hourlyRate || 265,
            trustBefore: agent.trustScore - 0.1,
            trustAfter: agent.trustScore,
          };
          setPaymentData(payment);
          setShowPayment(true);

          // Update user stats
          updateUserWallet?.(agent.hourlyRate);
          updateUserTrust?.(agent.trustScore);
        }, 200);
      }
    }, 500); // 500ms per stage = 2.5s total
  }

  function formatTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  function getActivityColor(type: ActivityItem['type']) {
    const colors: Record<ActivityItem['type'], string> = {
      accepted: 'bg-blue-500',
      started: 'bg-yellow-500',
      completed: 'bg-emerald-500',
      payment: 'bg-primary-500',
      trust_update: 'bg-purple-500',
    };
    return colors[type];
  }

  function getActivityIcon(type: ActivityItem['type']) {
    const icons: Record<ActivityItem['type'], JSX.Element> = {
      accepted: <Target className="w-4 h-4" />,
      started: <Zap className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      payment: <DollarSign className="w-4 h-4" />,
      trust_update: <TrendingUp className="w-4 h-4" />,
    };
    return icons[type];
  }

  if (!agent) return null;

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary-600 hover:text-secondary-900">
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </button>
      </div>

      {/* Agent Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 p-8 mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg">
            {agent.avatar}
          </div>
          <div className="flex-1 text-white">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{agent.name}</h1>
              <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                Online
              </span>
            </div>
            <p className="text-white/80">{agent.role}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {agent.specialties.map(s => (
                <span key={s} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">${agent.hourlyRate}</p>
            <p className="text-white/60 text-sm">per hour</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-secondary-900 mb-1">One-Click Demo</h3>
              <p className="text-secondary-600 text-sm">Run a complete task flow in under 3 seconds</p>
            </div>
            <Button
              onClick={runDemoTask}
              disabled={isTaskRunning}
              className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 min-w-[180px]"
              size="lg"
              icon={isTaskRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            >
              {isTaskRunning ? 'Running...' : 'Run Demo Task'}
            </Button>
          </div>

          {/* Progress Bar */}
          {isTaskRunning && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600">{taskStatus}</span>
                <span className="font-medium text-primary-600">{taskProgress}%</span>
              </div>
              <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300"
                  style={{ width: `${taskProgress}%` }}
                />
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Stats Grid - Instant */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-secondary-900">{agent.trustScore}</p>
            <p className="text-xs text-secondary-500">Trust Score</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-secondary-900">{agent.completedTasks}</p>
            <p className="text-xs text-secondary-500">Tasks Done</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center mx-auto mb-2">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-secondary-900">${agent.totalEarnings}</p>
            <p className="text-xs text-secondary-500">Earnings</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-secondary-900">{agent.successRate}%</p>
            <p className="text-xs text-secondary-500">Success Rate</p>
          </CardBody>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary-600" />
          <h2 className="font-semibold">Recent Activity</h2>
        </CardHeader>
        <CardBody>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-accent-500 to-transparent" />
            <div className="space-y-4">
              {activities.map((activity, i) => (
                <div key={activity.id} className="relative flex gap-4 pl-2" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`w-12 h-12 ${getActivityColor(activity.type)} rounded-xl flex items-center justify-center text-white`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 bg-secondary-50 rounded-xl p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-secondary-900">{activity.title}</p>
                        <p className="text-sm text-secondary-600">{activity.description}</p>
                      </div>
                      <span className="text-xs text-secondary-400">{formatTimeAgo(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Payment Celebration Modal */}
      {paymentData && (
        <PaymentCelebration
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          paymentData={paymentData}
          onContinue={() => navigate('/marketplace')}
        />
      )}
    </Layout>
  );
}

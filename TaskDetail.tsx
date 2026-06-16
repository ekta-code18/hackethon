import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency, formatDate } from '../lib/utils';
import { Layout } from '../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { StatusBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Textarea } from '../components/ui/Textarea';
import { LoadingState } from '../components/ui/Skeleton';
import { MultiAgentWorkflow, AgentStep } from '../components/MultiAgentWorkflow';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Bot,
  Sparkles,
  Loader2,
  Zap,
  Wallet,
  TrendingUp,
  Shield,
  Brain,
} from 'lucide-react';

type ProcessingStatus = 'idle' | 'assigning' | 'analyzing' | 'processing' | 'completed' | 'error' | 'multi-agent';

interface PaymentData {
  amount: number;
  transactionId: string;
  agentWalletBalance: number;
  trustScoreBefore: number;
  trustScoreAfter: number;
}

// Demo task data
const DEMO_TASKS: Record<string, any> = {
  'demo-task-1': {
    id: 'demo-task-1',
    title: 'Write a comprehensive blog post about AI agents',
    description: 'Create a detailed, engaging blog post about autonomous AI agents and their role in the future of work. Include real-world examples and statistics.\n\nRequirements:\n- 1500+ words\n- SEO optimized\n- Include statistics and data\n- Professional tone',
    category: 'Content Writing',
    budget: 20,
    status: 'open',
    business_id: 'demo-user',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    business: {
      id: 'demo-user',
      full_name: 'Demo Business',
      email: 'demo@example.com',
      avatar_url: null,
    },
  },
  'demo-task-2': {
    id: 'demo-task-2',
    title: 'Market research for new SaaS product',
    description: 'Conduct market research for a new productivity SaaS product. Analyze competitors, target audience, and market trends.\n\nDeliverables:\n- Competitor analysis\n- Target audience profile\n- Market size estimation\n- Recommendations',
    category: 'Research',
    budget: 50,
    status: 'open',
    business_id: 'demo-user',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    business: {
      id: 'demo-user',
      full_name: 'Tech Startup Inc',
      email: 'tech@startup.com',
      avatar_url: null,
    },
  },
  'demo-task-3': {
    id: 'demo-task-3',
    title: 'Social media campaign strategy',
    description: 'Create a comprehensive social media campaign strategy for Q4 product launch. Include content calendar and KPIs.',
    category: 'Marketing',
    budget: 35,
    status: 'open',
    business_id: 'demo-user',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    business: {
      id: 'demo-user',
      full_name: 'Marketing Co',
      email: 'marketing@co.com',
      avatar_url: null,
    },
  },
  'demo-task-4': {
    id: 'demo-task-4',
    title: 'Python data analysis script',
    description: 'Write a Python script to analyze CSV data and generate visualizations. Must use pandas and matplotlib.',
    category: 'Software Development',
    budget: 40,
    status: 'open',
    business_id: 'demo-user',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    business: {
      id: 'demo-user',
      full_name: 'Data Insights LLC',
      email: 'data@insights.com',
      avatar_url: null,
    },
  },
};

// Demo AI agent
const DEMO_AI_AGENT = {
  id: 'neurolance-ai',
  name: 'NeuroLance AI',
  description: 'An advanced AI agent powered by GPT-4, capable of handling a wide variety of tasks.',
  avatar_url: null,
  hourly_rate: 25,
  rating: 4.9,
  total_tasks_completed: 142,
  specialties: ['Content Writing', 'Research', 'Marketing', 'Development'],
};

// Demo submission result
const DEMO_RESULT = `# The Rise of Autonomous AI Agents

## Transforming the Future of Work

In an era where artificial intelligence is reshaping every industry, autonomous AI agents represent the next frontier of digital transformation. These sophisticated systems can independently execute tasks, make decisions, and adapt to changing circumstances—all without human intervention.

### Key Insights:

1. **Market Growth**: The AI agent market is projected to reach $47.1 billion by 2030, growing at a CAGR of 42.8%.

2. **Productivity Boost**: Companies using AI agents report a 40% increase in operational efficiency.

3. **Trust Economy**: Platforms like NeuroLance are pioneering trust-based systems where AI agents build reputation.

### Real-World Applications:

- **Content Creation**: AI agents produce high-quality blog posts and marketing copy
- **Data Research**: Research agents analyze market trends and deliver insights
- **Customer Support**: Autonomous agents handle 80% of inquiries without escalation

### The Future is Now:

As trust mechanisms evolve and multi-agent collaboration improves, we're entering an age where AI agents don't just assist—they lead.`;

export function TaskDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>('idle');
  const [processingMessage, setProcessingMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [agentStep, setAgentStep] = useState<AgentStep>('idle');
  const [workflowActive, setWorkflowActive] = useState(false);
  const [submission, setSubmission] = useState<string | null>(null);

  useEffect(() => {
    loadTask();
  }, [id]);

  function loadTask() {
    setLoading(true);

    // Simulate brief loading
    setTimeout(() => {
      const foundTask = DEMO_TASKS[id || ''] || DEMO_TASKS['demo-task-1'];
      setTask(foundTask);
      setLoading(false);
    }, 500);
  }

  async function processWithAI() {
    if (!task) return;

    setProcessingStatus('assigning');
    setProcessingMessage('Assigning AI agent to your task...');

    setTimeout(() => {
      setProcessingStatus('analyzing');
      setProcessingMessage('AI Agent is analyzing your task requirements...');
    }, 1000);

    setTimeout(() => {
      setProcessingStatus('processing');
      setProcessingMessage('AI Agent is processing your task...');
    }, 2000);

    setTimeout(() => {
      setProcessingStatus('completed');
      setProcessingMessage('Task completed successfully!');
      setSubmission(DEMO_RESULT);

      // Generate payment data
      const payment: PaymentData = {
        amount: task.budget * 0.8,
        transactionId: `NLX-${Date.now().toString(36).toUpperCase()}`,
        agentWalletBalance: 1247.50 + (task.budget * 0.8),
        trustScoreBefore: 4.8,
        trustScoreAfter: 4.9,
      };
      setPaymentData(payment);

      setTimeout(() => {
        setShowPaymentModal(true);
      }, 800);
    }, 4000);
  }

  async function processWithMultiAgent() {
    if (!task) return;

    setProcessingStatus('multi-agent');
    setWorkflowActive(true);
    setAgentStep('research');

    // Simulate multi-agent processing - the workflow handles the animation
    setTimeout(() => {
      setSubmission(DEMO_RESULT);
    }, 6000);
  }

  const handleWorkflowComplete = (result: string) => {
    setProcessingStatus('completed');
    setSubmission(DEMO_RESULT);

    if (task) {
      const payment: PaymentData = {
        amount: task.budget * 0.8,
        transactionId: `NLX-${Date.now().toString(36).toUpperCase()}`,
        agentWalletBalance: 1247.50 + (task.budget * 0.8),
        trustScoreBefore: 4.8,
        trustScoreAfter: 4.9,
      };
      setPaymentData(payment);

      setTimeout(() => {
        setShowPaymentModal(true);
      }, 800);
    }
  };

  const isProcessing = processingStatus !== 'idle' && processingStatus !== 'completed' && processingStatus !== 'error' && processingStatus !== 'multi-agent';

  if (loading) {
    return (
      <Layout>
        <LoadingState message="Loading task..." />
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">Task not found</h2>
          <Button onClick={() => navigate('/tasks')}>Browse Tasks</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary-600 hover:text-secondary-900">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Processing Status Banner */}
          {isProcessing && (
            <Card className="bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center animate-pulse">
                    <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-primary-600" />
                      <span className="font-medium text-primary-900">AI Agent Working</span>
                    </div>
                    <p className="text-primary-700">{processingMessage}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-primary-600">
                    <div className={`w-2 h-2 rounded-full ${processingStatus === 'assigning' ? 'bg-primary-500 animate-pulse' : 'bg-primary-300'}`} />
                    <span className={processingStatus === 'assigning' ? 'font-medium' : ''}>Assigning agent</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary-600">
                    <div className={`w-2 h-2 rounded-full ${processingStatus === 'analyzing' ? 'bg-primary-500 animate-pulse' : processingStatus === 'processing' || processingStatus === 'completed' ? 'bg-primary-500' : 'bg-primary-300'}`} />
                    <span className={processingStatus === 'analyzing' ? 'font-medium' : ''}>Analyzing requirements</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary-600">
                    <div className={`w-2 h-2 rounded-full ${processingStatus === 'processing' ? 'bg-primary-500 animate-pulse' : processingStatus === 'completed' ? 'bg-primary-500' : 'bg-primary-300'}`} />
                    <span className={processingStatus === 'processing' ? 'font-medium' : ''}>Completing task</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Multi-Agent Workflow Visualization */}
          {processingStatus === 'multi-agent' && (
            <MultiAgentWorkflow
              isActive={workflowActive}
              currentStep={agentStep}
              onStepChange={(step) => setAgentStep(step)}
              onWorkflowComplete={handleWorkflowComplete}
              taskTitle={task?.title}
              taskDescription={task?.description}
            />
          )}

          {/* Task Info */}
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <StatusBadge status={task.status} />
                <span className="text-sm text-secondary-500">{task.category}</span>
              </div>

              <h1 className="text-2xl font-bold text-secondary-900 mb-4">{task.title}</h1>

              <div className="prose prose-secondary max-w-none mb-6">
                <p className="text-secondary-700 whitespace-pre-wrap">{task.description}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Posted {formatDate(task.created_at)}</span>
                </div>
                {task.deadline && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Deadline: {formatDate(task.deadline)}</span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Submission Result */}
          {submission && (
            <Card>
              <CardHeader className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary-600" />
                <h2 className="font-semibold text-lg">AI Agent Results</h2>
              </CardHeader>
              <CardBody>
                <div className="bg-secondary-50 rounded-lg p-6 whitespace-pre-wrap text-secondary-700 font-mono text-sm overflow-auto max-h-96">
                  {submission}
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-accent-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Task completed successfully by {DEMO_AI_AGENT.name}</span>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Budget Card */}
          <Card>
            <CardBody className="p-6">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-secondary-900">{formatCurrency(task.budget)}</p>
                <p className="text-secondary-500">Budget</p>
              </div>

              {task.status === 'open' && (
                <div className="space-y-3">
                  <Button
                    onClick={processWithMultiAgent}
                    className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500"
                    icon={<Brain className="w-4 h-4" />}
                  >
                    Multi-Agent Collaboration
                  </Button>
                  <Button
                    onClick={processWithAI}
                    className="w-full"
                    variant="secondary"
                    icon={<Zap className="w-4 h-4" />}
                  >
                    Quick AI Process
                  </Button>
                </div>
              )}

              {task.status === 'in_progress' && !isProcessing && (
                <div className="p-4 bg-primary-50 rounded-lg text-center">
                  <Clock className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="font-medium text-primary-700">Task in Progress</p>
                  <p className="text-sm text-primary-600 mt-1">Agent is working on your task</p>
                </div>
              )}

              {task.status === 'completed' && (
                <div className="p-4 bg-accent-50 rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 text-accent-600 mx-auto mb-2" />
                  <p className="font-medium text-accent-700">Task Completed</p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Client Info */}
          <Card>
            <CardBody className="p-6">
              <h3 className="font-semibold mb-4">Posted By</h3>
              <div className="flex items-center gap-3">
                <Avatar src={task.business?.avatar_url} name={task.business?.full_name || 'B'} size="lg" />
                <div>
                  <p className="font-medium text-secondary-900">{task.business?.full_name || 'Anonymous'}</p>
                  <p className="text-sm text-secondary-500">{task.business?.email}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Assigned Agent */}
          {DEMO_AI_AGENT && (
            <Card>
              <CardBody className="p-6">
                <h3 className="font-semibold mb-4">Assigned Agent</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">{DEMO_AI_AGENT.name}</p>
                    <div className="flex items-center gap-2 text-sm text-secondary-500">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-yellow-500" />
                        {DEMO_AI_AGENT.rating}
                      </span>
                      <span>|</span>
                      <span>{DEMO_AI_AGENT.total_tasks_completed} tasks</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {/* Payment Success Modal */}
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Payment Released" size="md">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Wallet className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -inset-1 border-4 border-accent-400/30 rounded-full animate-ping" />
              <CheckCircle className="absolute -bottom-1 -right-1 w-7 h-7 text-accent-500 bg-white rounded-full" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-900 to-secondary-800 rounded-xl p-5 text-white mb-6">
            <div className="text-center mb-4">
              <p className="text-white/60 text-xs uppercase tracking-wider">Amount Released</p>
              <p className="text-4xl font-bold mt-1">${paymentData?.amount.toFixed(2)}</p>
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Transaction ID</span>
                <span className="font-mono text-accent-400">{paymentData?.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Agent Wallet</span>
                <span className="font-semibold">${paymentData?.agentWalletBalance.toFixed(2)}</span>
              </div>
            </div>
          </div>

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
                <span className="text-lg text-secondary-600">{paymentData?.trustScoreBefore}</span>
                <TrendingUp className="w-4 h-4 text-accent-500" />
                <span className="text-xl font-bold text-accent-600">{paymentData?.trustScoreAfter}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setShowPaymentModal(false)} variant="secondary" className="flex-1">
              Close
            </Button>
            <Button onClick={() => navigate('/hackathon')} className="flex-1" icon={<Sparkles className="w-4 h-4" />}>
              Run Full Demo
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

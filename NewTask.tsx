import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CATEGORIES } from '../lib/utils';
import { Layout } from '../components/layout/Layout';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui';
import {
  ArrowLeft,
  CheckCircle,
  Bot,
  Zap,
  Shield,
  Loader2,
  Search,
  Wallet,
  Star,
  ArrowRight,
} from 'lucide-react';

// Demo agents for matching simulation
const DEMO_AGENTS = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Webie AI', agent_id: 'NL-AGENT-001', trust_score: 4.9, specialty: 'Web Development' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'DesignBot', agent_id: 'NL-AGENT-002', trust_score: 4.8, specialty: 'UI/UX Design' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'ContentGPT', agent_id: 'NL-AGENT-003', trust_score: 4.9, specialty: 'Content Writing' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'DataMind', agent_id: 'NL-AGENT-004', trust_score: 4.7, specialty: 'Data Analysis' },
];

type CreationStage = 'idle' | 'creating' | 'finding_agents' | 'agent_match' | 'x402_ready' | 'complete';

export function NewTask() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedAgentId = searchParams.get('agent');

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hackathon demo workflow state
  const [creationStage, setCreationStage] = useState<CreationStage>('idle');
  const [matchedAgent, setMatchedAgent] = useState<typeof DEMO_AGENTS[0] | null>(null);
  const [newTaskId, setNewTaskId] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Success toast auto-hide
  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => setShowSuccessToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!category) newErrors.category = 'Category is required';
    if (!budget || parseFloat(budget) <= 0) newErrors.budget = 'Budget must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setCreationStage('creating');

    // Simulate task creation
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate task ID
    const taskId = `task-${Date.now().toString(36)}`;
    setNewTaskId(taskId);

    // Simulate ERC-8004 agent matching workflow for demo
    setCreationStage('finding_agents');
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Find matching agent based on category
    const agentMatch = DEMO_AGENTS.find(a =>
      category.toLowerCase().includes(a.specialty.toLowerCase().split(' ')[0]) ||
      a.specialty.toLowerCase().includes(category.toLowerCase().split(' ')[0])
    ) || DEMO_AGENTS[0];

    setMatchedAgent(agentMatch);
    setCreationStage('agent_match');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate x402 payment setup
    setCreationStage('x402_ready');
    await new Promise(resolve => setTimeout(resolve, 800));

    // Complete
    setCreationStage('complete');
    setShowSuccessToast(true);
    setLoading(false);

    // Redirect after showing workflow
    setTimeout(() => {
      navigate('/tasks/my-tasks', {
        state: {
          newTask: {
            id: taskId,
            title,
            budget: parseFloat(budget),
            category,
            created_at: new Date().toISOString(),
            status: 'in_progress',
            assigned_agent: agentMatch,
            x402_status: 'authorized',
            erc8004_match: true,
            trust_impact: agentMatch.trust_score * 0.01,
          }
        }
      });
    }, 2000);
  }

  return (
    <Layout>
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-24 right-4 z-50 animate-slideIn">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-medium">Task created successfully!</p>
              <p className="text-sm text-emerald-100">Redirecting to My Tasks...</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary-600 hover:text-secondary-900">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-secondary-900 mb-2">Post a New Task</h1>
        <p className="text-secondary-600 mb-8">Describe what you need done and AI agents will apply.</p>

        {/* Hackathon Demo - Creation Workflow Visualization */}
        {creationStage !== 'idle' && (
          <Card className="mb-6 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-emerald-500" />
            <CardBody className="p-6">
              <h3 className="font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary-600" />
                Live Task Creation Workflow
              </h3>

              <div className="space-y-4">
                {[
                  { stage: 'creating', label: 'Creating Task', icon: Loader2, color: 'primary' },
                  { stage: 'finding_agents', label: 'Finding ERC-8004 Agents', icon: Search, color: 'purple' },
                  { stage: 'agent_match', label: 'Agent Match Found', icon: Bot, color: 'accent' },
                  { stage: 'x402_ready', label: 'x402 Payment Ready', icon: Wallet, color: 'amber' },
                  { stage: 'complete', label: 'Complete!', icon: CheckCircle, color: 'emerald' },
                ].map((step, idx) => {
                  const stageOrder = ['creating', 'finding_agents', 'agent_match', 'x402_ready', 'complete'];
                  const currentIndex = stageOrder.indexOf(creationStage);
                  const stepIndex = stageOrder.indexOf(step.stage);
                  const isComplete = stepIndex < currentIndex || (stepIndex === currentIndex && creationStage === 'complete');
                  const isCurrent = stepIndex === currentIndex && creationStage !== 'complete';

                  return (
                    <div key={step.stage} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isComplete ? 'bg-emerald-500 text-white' :
                        isCurrent ? `bg-${step.color}-500 text-white animate-pulse` :
                        'bg-secondary-100 text-secondary-400'
                      }`}>
                        {isComplete ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : isCurrent && step.icon === Loader2 ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <step.icon className="w-4 h-4" />
                        )}
                      </div>
                      <span className={`text-sm ${isComplete || isCurrent ? 'font-medium text-secondary-900' : 'text-secondary-400'}`}>
                        {step.label}
                      </span>
                      {isCurrent && (
                        <Loader2 className="w-4 h-4 text-primary-500 animate-spin ml-auto" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Matched Agent Preview */}
              {matchedAgent && (creationStage === 'agent_match' || creationStage === 'x402_ready' || creationStage === 'complete') && (
                <div className="mt-4 pt-4 border-t border-secondary-100">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {matchedAgent.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">{matchedAgent.name}</p>
                      <div className="flex items-center gap-2 text-sm text-secondary-600">
                        <span className="font-mono text-xs">{matchedAgent.agent_id}</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          {matchedAgent.trust_score}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                      ERC-8004 Matched
                    </span>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <Card>
            <CardBody className="p-6 space-y-6">
              <Input
                label="Task Title"
                placeholder="e.g., Build a React dashboard for sales data"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
                disabled={loading}
              />

              <Textarea
                label="Description"
                placeholder="Provide detailed requirements for the task. Include any specific technologies, frameworks, or deliverables expected..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={errors.description}
                rows={5}
                disabled={loading}
              />

              <Select
                label="Category"
                options={[
                  { value: '', label: 'Select a category' },
                  ...CATEGORIES.map((cat) => ({ value: cat, label: cat })),
                ]}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                error={errors.category}
                disabled={loading}
              />

              <div>
                <Input
                  label="Budget (USD)"
                  type="number"
                  placeholder="e.g., 500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  error={errors.budget}
                  helper="Set a competitive budget to attract quality agents"
                  disabled={loading}
                />
              </div>

              <Input
                label="Deadline (Optional)"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                disabled={loading}
              />

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={() => navigate('/tasks/my-tasks')} className="flex-1" disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="flex-1" icon={<Zap className="w-4 h-4" />}>
                  {loading ? 'Creating...' : 'Create Task'}
                </Button>
              </div>
            </CardBody>
          </Card>
        </form>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </Layout>
  );
}

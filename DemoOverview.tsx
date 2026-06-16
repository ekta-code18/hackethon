import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  FileText,
  Bot,
  CheckCircle2,
  DollarSign,
  Shield,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
  Users,
  Activity,
  Globe,
  Clock,
  Star,
  Award,
  Target,
  Brain,
} from 'lucide-react';

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface PlatformStats {
  totalTasks: number;
  totalEarnings: number;
  totalPayments: number;
  avgTrustScore: number;
  activeAgents: number;
  successRate: number;
}

export function DemoOverview() {
  const navigate = useNavigate();
  const [animatingStep, setAnimatingStep] = useState(0);
  const [stats, setStats] = useState<PlatformStats>({
    totalTasks: 0,
    totalEarnings: 0,
    totalPayments: 0,
    avgTrustScore: 0,
    activeAgents: 0,
    successRate: 0,
  });
  const [showStats, setShowStats] = useState(false);

  const workflowSteps: WorkflowStep[] = [
    {
      id: 1,
      title: 'User Posts Task',
      description: 'Business creates a task with requirements and budget',
      icon: <FileText className="w-6 h-6" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500',
      borderColor: 'border-blue-400',
    },
    {
      id: 2,
      title: 'AI Agent Accepts',
      description: 'Agent analyzes task and accepts the challenge',
      icon: <Bot className="w-6 h-6" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500',
      borderColor: 'border-purple-400',
    },
    {
      id: 3,
      title: 'Agent Completes Work',
      description: 'Multi-agent collaboration delivers quality results',
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500',
      borderColor: 'border-emerald-400',
    },
    {
      id: 4,
      title: 'Payment Released',
      description: 'Instant, secure payment to agent wallet',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500',
      borderColor: 'border-amber-400',
    },
    {
      id: 5,
      title: 'Trust Score Updated',
      description: 'Reputation increases based on performance',
      icon: <Shield className="w-6 h-6" />,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500',
      borderColor: 'border-cyan-400',
    },
    {
      id: 6,
      title: 'Agent Reputation Grows',
      description: 'Higher trust unlocks premium opportunities',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500',
      borderColor: 'border-rose-400',
    },
  ];

  // Animate workflow steps
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatingStep(prev => (prev + 1) % (workflowSteps.length + 1));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Animate stats
  useEffect(() => {
    const targetStats: PlatformStats = {
      totalTasks: 12847,
      totalEarnings: 892450,
      totalPayments: 10834,
      avgTrustScore: 4.7,
      activeAgents: 342,
      successRate: 96.8,
    };

    const animateValue = (start: number, end: number, duration: number, setter: (val: number) => void) => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setter(start + (end - start) * eased);
        if (progress < 1) requestAnimationFrame(animate);
      };
      animate();
    };

    const timeout = setTimeout(() => {
      setShowStats(true);
      animateValue(0, targetStats.totalTasks, 2000, val => setStats(prev => ({ ...prev, totalTasks: Math.round(val) })));
      animateValue(0, targetStats.totalEarnings, 2000, val => setStats(prev => ({ ...prev, totalEarnings: Math.round(val) })));
      animateValue(0, targetStats.totalPayments, 2000, val => setStats(prev => ({ ...prev, totalPayments: Math.round(val) })));
      animateValue(0, targetStats.avgTrustScore, 2000, val => setStats(prev => ({ ...prev, avgTrustScore: Math.round(val * 10) / 10 })));
      animateValue(0, targetStats.activeAgents, 2000, val => setStats(prev => ({ ...prev, activeAgents: Math.round(val) })));
      animateValue(0, targetStats.successRate, 2000, val => setStats(prev => ({ ...prev, successRate: Math.round(val * 10) / 10 })));
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 p-8 md:p-12 mb-10">
        {/* Animated background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />

        <div className="relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Autonomous AI Agent Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-accent-200 to-white bg-clip-text text-transparent">
            NeuroLance
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-2">
            Where AI Agents Work, Earn & Build Reputation
          </p>
          <p className="text-white/60 mb-8">
            The Future of Autonomous Task Completion
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => navigate('/tasks/new')}
              className="bg-white text-primary-700 hover:bg-white/90 px-8 py-3"
              icon={<Zap className="w-5 h-5" />}
            >
              Create a Task
            </Button>
            <Button
              onClick={() => navigate('/marketplace')}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-8 py-3"
              icon={<Bot className="w-5 h-5" />}
            >
              Browse Agents
            </Button>
          </div>
        </div>
      </div>

      {/* Workflow Visualization */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-2">The NeuroLance Workflow</h2>
          <p className="text-secondary-600">Seamless AI-powered task completion with built-in trust</p>
        </div>

        <Card className="overflow-hidden">
          <CardBody className="p-8">
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-emerald-500 via-amber-500 via-cyan-500 to-rose-500 rounded-full opacity-20" />
              <div
                className="absolute top-12 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-emerald-500 via-amber-500 via-cyan-500 to-rose-500 rounded-full transition-all duration-1000"
                style={{ width: `${(animatingStep / workflowSteps.length) * 100}%` }}
              />

              {/* Steps */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {workflowSteps.map((step, index) => (
                  <div key={step.id} className="relative">
                    <div className="flex flex-col items-center text-center">
                      {/* Step Node */}
                      <div
                        className={`relative w-24 h-24 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${
                          index < animatingStep
                            ? `${step.bgColor} shadow-lg scale-105`
                            : index === animatingStep
                            ? `${step.bgColor} shadow-xl scale-110 ring-4 ring-white ring-offset-2 ring-offset-white/10`
                            : 'bg-secondary-100'
                        }`}
                      >
                        {/* Pulse effect for active step */}
                        {index === animatingStep && (
                          <>
                            <div className="absolute inset-0 rounded-2xl bg-inherit animate-ping opacity-50" />
                            <div className="absolute -inset-2 rounded-3xl bg-inherit opacity-20 animate-pulse" />
                          </>
                        )}

                        <div className={index <= animatingStep ? 'text-white' : 'text-secondary-400'}>
                          {step.icon}
                        </div>

                        {/* Step number */}
                        <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          index < animatingStep
                            ? 'bg-white text-primary-600'
                            : index === animatingStep
                            ? 'bg-white text-primary-600 animate-bounce'
                            : 'bg-secondary-200 text-secondary-500'
                        }`}>
                          {index < animatingStep ? '✓' : step.id}
                        </div>
                      </div>

                      {/* Step Info */}
                      <h3 className={`font-semibold text-sm mb-1 transition-colors ${
                        index <= animatingStep ? 'text-secondary-900' : 'text-secondary-400'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-xs transition-colors ${
                        index <= animatingStep ? 'text-secondary-600' : 'text-secondary-300'
                      }`}>
                        {step.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    {index < workflowSteps.length - 1 && (
                      <div className="hidden md:flex absolute top-12 -right-2 items-center z-10">
                        <ArrowRight className={`w-4 h-4 transition-colors ${
                          index < animatingStep ? 'text-secondary-400' : 'text-secondary-200'
                        }`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Platform Statistics */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-2">Platform Impact</h2>
          <p className="text-secondary-600">Real numbers from the NeuroLance ecosystem</p>
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 transition-all duration-1000 ${showStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Total Tasks */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardBody className="p-6 text-center relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-secondary-900 mb-1">
                {stats.totalTasks.toLocaleString()}
              </p>
              <p className="text-sm text-secondary-500">Total Tasks</p>
            </CardBody>
          </Card>

          {/* Total Earnings */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardBody className="p-6 text-center relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-secondary-900 mb-1">
                ${stats.totalEarnings.toLocaleString()}
              </p>
              <p className="text-sm text-secondary-500">Agent Earnings</p>
            </CardBody>
          </Card>

          {/* Total Payments */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardBody className="p-6 text-center relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-secondary-900 mb-1">
                {stats.totalPayments.toLocaleString()}
              </p>
              <p className="text-sm text-secondary-500">Payments Processed</p>
            </CardBody>
          </Card>

          {/* Avg Trust Score */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardBody className="p-6 text-center relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
                <Star className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-secondary-900 mb-1">
                {stats.avgTrustScore.toFixed(1)}
              </p>
              <p className="text-sm text-secondary-500">Avg Trust Score</p>
            </CardBody>
          </Card>

          {/* Active Agents */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardBody className="p-6 text-center relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-secondary-900 mb-1">
                {stats.activeAgents.toLocaleString()}
              </p>
              <p className="text-sm text-secondary-500">Active Agents</p>
            </CardBody>
          </Card>

          {/* Success Rate */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardBody className="p-6 text-center relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/30">
                <Target className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-secondary-900 mb-1">
                {stats.successRate}%
              </p>
              <p className="text-sm text-secondary-500">Success Rate</p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Multi-Agent System */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
          <CardBody className="p-6 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-2">Multi-Agent Collaboration</h3>
            <p className="text-secondary-600 mb-4">
              Specialized agents work together: Research, Writer, and Reviewer agents ensure high-quality output.
            </p>
            <div className="flex items-center gap-2 text-primary-600">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Intelligent Pipeline</span>
            </div>
          </CardBody>
        </Card>

        {/* Trust System */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full blur-3xl" />
          <CardBody className="p-6 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-2">Trust-Based Reputation</h3>
            <p className="text-secondary-600 mb-4">
              Every completed task builds reputation. Higher trust scores unlock premium opportunities.
            </p>
            <div className="flex items-center gap-2 text-accent-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Verified Performance</span>
            </div>
          </CardBody>
        </Card>

        {/* Instant Payments */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
          <CardBody className="p-6 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-2">Instant Payments</h3>
            <p className="text-secondary-600 mb-4">
              Secure, instant payments released automatically upon task completion and approval.
            </p>
            <div className="flex items-center gap-2 text-amber-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Zero-Delay Transfers</span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Live Demo CTA */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-secondary-900 via-secondary-800 to-secondary-900 p-8 md:p-12 text-center">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)`,
        }} />

        <div className="relative z-10">
          <Award className="w-16 h-16 text-accent-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Experience the Future of Work
          </h2>
          <p className="text-secondary-300 text-lg mb-8 max-w-2xl mx-auto">
            Watch AI agents collaborate, complete tasks, and build reputation in real-time.
            NeuroLance demonstrates the power of autonomous AI agents in the gig economy.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => navigate('/tasks/new')}
              className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-400 hover:to-accent-400 text-white px-8 py-4 text-lg"
              icon={<Sparkles className="w-5 h-5" />}
            >
              Try It Now
            </Button>
            <Button
              onClick={() => navigate('/marketplace')}
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-8 py-4 text-lg"
              icon={<Users className="w-5 h-5" />}
            >
              Explore Agents
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 text-secondary-400">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span className="text-sm">Decentralized</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="text-sm">Instant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Badge */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-secondary-100 rounded-full">
          <Brain className="w-5 h-5 text-primary-600" />
          <span className="text-secondary-700 font-medium">Built for Hackathon Demo</span>
          <Sparkles className="w-5 h-5 text-accent-500" />
        </div>
      </div>
    </Layout>
  );
}

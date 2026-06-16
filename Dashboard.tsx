import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Task, Agent } from '../types';
import { formatCurrency, formatRelativeTime } from '../lib/utils';
import { Layout } from '../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { LoadingState, EmptyState } from '../components/ui/Skeleton';
import {
  Briefcase,
  DollarSign,
  CheckCircle,
  TrendingUp,
  Plus,
  ArrowRight,
  Bot,
} from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [stats, setStats] = useState({
    totalEarned: 0,
    totalSpent: 0,
    activeTasks: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, [user]);

  async function loadDashboard() {
    if (!user) return;
    setLoading(true);

    if (user.user_type === 'business') {
      const { data: taskData } = await supabase
        .from('tasks')
        .select('*, agent:agents(*, profile:profiles(*))')
        .eq('business_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: paymentData } = await supabase
        .from('payments')
        .select('*')
        .eq('business_id', user.id)
        .eq('status', 'completed');

      setTasks(taskData || []);

      const active = taskData?.filter((t) => t.status === 'open' || t.status === 'in_progress' || t.status === 'submitted').length || 0;
      const completed = taskData?.filter((t) => t.status === 'completed').length || 0;
      const spent = paymentData?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      setStats({ totalEarned: 0, totalSpent: spent, activeTasks: active, completedTasks: completed });
    } else {
      const { data: agentData } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (agentData) {
        setAgent(agentData as Agent);

        const { data: taskData } = await supabase
          .from('tasks')
          .select('*, business:profiles(*)')
          .eq('agent_id', agentData.id)
          .order('created_at', { ascending: false })
          .limit(10);

        const { data: paymentData } = await supabase
          .from('payments')
          .select('*')
          .eq('agent_id', agentData.id)
          .eq('status', 'completed');

        setTasks(taskData || []);

        const active = taskData?.filter((t) => t.status === 'in_progress' || t.status === 'submitted').length || 0;
        const completed = taskData?.filter((t) => t.status === 'completed').length || 0;
        const earned = paymentData?.reduce((sum, p) => sum + Number(p.amount) - Number(p.platform_fee), 0) || 0;

        setStats({ totalEarned: earned, totalSpent: 0, activeTasks: active, completedTasks: completed });
      }
    }

    setLoading(false);
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto text-center py-12">
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">Sign in to access your dashboard</h2>
          <p className="text-secondary-600">Create an account to start posting tasks or earning money.</p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <LoadingState message="Loading dashboard..." />
      </Layout>
    );
  }

  const isBusiness = user.user_type === 'business';

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-secondary-900 mb-2">Dashboard</h1>
        <p className="text-secondary-600">
          {isBusiness ? 'Manage your tasks and track progress' : 'Track your earnings and active tasks'}
        </p>
      </div>

      {/* Quick Setup for Agents */}
      {!isBusiness && !agent && (
        <Card className="mb-6 border-primary-200 bg-primary-50">
          <CardBody className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-secondary-900 mb-1">Complete Your Agent Profile</h3>
                <p className="text-secondary-600 mb-4">
                  Set up your agent profile to start receiving tasks and earning money.
                </p>
                <Link to="/profile/agent">
                  <Button icon={<ArrowRight className="w-4 h-4" />}>Set Up Profile</Button>
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{stats.activeTasks}</p>
                <p className="text-sm text-secondary-500">Active Tasks</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{stats.completedTasks}</p>
                <p className="text-sm text-secondary-500">Completed</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">
                  {formatCurrency(isBusiness ? stats.totalSpent : stats.totalEarned)}
                </p>
                <p className="text-sm text-secondary-500">{isBusiness ? 'Spent' : 'Earned'}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary-600" />
              </div>
              <div className="flex-1">
                <Link to={isBusiness ? '/tasks' : '/marketplace'} className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                  {isBusiness ? 'Find Agents' : 'Browse Tasks'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tasks List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{isBusiness ? 'Your Tasks' : 'Assigned Tasks'}</h2>
              {isBusiness && (
                <Link to="/tasks/new">
                  <Button size="sm" icon={<Plus className="w-4 h-4" />}>New Task</Button>
                </Link>
              )}
            </CardHeader>
            <CardBody>
              {tasks.length === 0 ? (
                <EmptyState
                  icon={<Briefcase className="w-8 h-8" />}
                  title={isBusiness ? 'No tasks yet' : 'No assigned tasks'}
                  description={isBusiness ? 'Post your first task to get started' : 'Apply for tasks to see them here'}
                  action={
                    isBusiness ? (
                      <Link to="/tasks/new">
                        <Button icon={<Plus className="w-4 h-4" />}>Post Task</Button>
                      </Link>
                    ) : (
                      <Link to="/tasks">
                        <Button>Browse Tasks</Button>
                      </Link>
                    )
                  }
                />
              ) : (
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <Link key={task.id} to={`/tasks/${task.id}`}>
                      <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                        <div className="min-w-0">
                          <p className="font-medium text-secondary-900 truncate">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusBadge status={task.status} />
                            <span className="text-xs text-secondary-500">{formatRelativeTime(task.created_at)}</span>
                          </div>
                        </div>
                        <p className="font-semibold text-secondary-900 text-right">{formatCurrency(task.budget)}</p>
                      </div>
                    </Link>
                  ))}
                  {tasks.length > 5 && (
                    <Link to="/tasks" className="block text-center text-sm text-primary-600 hover:text-primary-700 py-2">
                      View all {tasks.length} tasks
                    </Link>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Avatar src={user.avatar_url} name={user.full_name || 'User'} size="lg" />
                <div>
                  <p className="font-semibold text-secondary-900">{user.full_name || 'User'}</p>
                  <p className="text-sm text-secondary-500">{user.user_type === 'business' ? 'Business' : 'Agent'}</p>
                </div>
              </div>
              <Link to="/profile">
                <Button variant="secondary" size="sm" className="w-full">
                  Edit Profile
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Agent Stats */}
          {!isBusiness && agent && (
            <Card>
              <CardBody className="p-6">
                <h3 className="font-semibold mb-4">Agent Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-600">Rating</span>
                    <span className="font-medium text-secondary-900">{agent.rating.toFixed(1)}/5.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-600">Tasks Completed</span>
                    <span className="font-medium text-secondary-900">{agent.total_tasks_completed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-600">Hourly Rate</span>
                    <span className="font-medium text-secondary-900">{formatCurrency(agent.hourly_rate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${agent.is_active ? 'bg-accent-50 text-accent-700' : 'bg-secondary-100 text-secondary-600'}`}>
                      {agent.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}

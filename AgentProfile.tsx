import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Agent, Task } from '../types';
import { formatCurrency } from '../lib/utils';
import { Layout } from '../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { StatusBadge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/Skeleton';
import {
  Star,
  DollarSign,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';

export function AgentProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgent();
  }, [id]);

  async function loadAgent() {
    setLoading(true);

    const { data: agentData } = await supabase
      .from('agents')
      .select('*, profile:profiles(*)')
      .eq('id', id)
      .single();

    if (agentData) {
      setAgent(agentData as Agent);

      const { data: taskData } = await supabase
        .from('tasks')
        .select('*')
        .eq('agent_id', id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(5);

      setTasks(taskData || []);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <Layout>
        <LoadingState message="Loading agent profile..." />
      </Layout>
    );
  }

  if (!agent) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">Agent not found</h2>
          <Button onClick={() => navigate('/marketplace')}>Back to Marketplace</Button>
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
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardBody className="p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar src={agent.avatar_url} name={agent.name} size="xl" />
                <div className="flex-1">
                  <h1 className="font-display text-2xl font-bold text-secondary-900 mb-2">{agent.name}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-warning-500 fill-warning-500" />
                      <span className="font-semibold">{agent.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-secondary-300">|</span>
                    <span className="text-secondary-600">{agent.total_tasks_completed} tasks completed</span>
                  </div>
                  <p className="text-secondary-700 mb-6">{agent.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {agent.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-lg">Recent Completed Tasks</h2>
            </CardHeader>
            <CardBody>
              {tasks.length === 0 ? (
                <p className="text-secondary-500 text-center py-4">No completed tasks yet</p>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <Link key={task.id} to={`/tasks/${task.id}`} className="block">
                        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                          <div>
                            <h3 className="font-medium text-secondary-900">{task.title}</h3>
                            <p className="text-sm text-secondary-500">{task.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-secondary-900">{formatCurrency(task.budget)}</p>
                            <StatusBadge status={task.status} />
                          </div>
                        </div>
                      </Link>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardBody className="p-6">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-secondary-900">{formatCurrency(agent.hourly_rate)}</p>
                <p className="text-secondary-500">per hour</p>
              </div>

              {user?.user_type === 'business' && (
                <Button onClick={() => navigate('/tasks/new?agent=' + id)} className="w-full">
                  Hire This Agent
                </Button>
              )}

              {!user && (
                <p className="text-sm text-secondary-500 text-center">
                  <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                    Sign in
                  </Link>{' '}
                  to hire this agent
                </p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <h3 className="font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-900">{agent.total_tasks_completed}</p>
                    <p className="text-sm text-secondary-500">Tasks Completed</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-900">{agent.rating.toFixed(1)}/5.0</p>
                    <p className="text-sm text-secondary-500">Average Rating</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-warning-50 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-warning-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-900">{formatCurrency(agent.hourly_rate)}</p>
                    <p className="text-sm text-secondary-500">Hourly Rate</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

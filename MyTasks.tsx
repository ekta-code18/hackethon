import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/layout/Layout';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import {
  Plus,
  Briefcase,
  Clock,
  CheckCircle,
  Wallet,
  Zap,
  Bot,
  Shield,
  ArrowRight,
  Loader2,
  Star,
  ExternalLink,
  Trash2,
  AlertTriangle,
  X,
  Checkbox,
} from 'lucide-react';

// Demo tasks for hackathon mode
const DEMO_TASKS = [
  {
    id: 'task-demo-1',
    title: 'Build React Dashboard with Charts',
    budget: 150.00,
    category: 'Software Development',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: 'in_progress',
    assigned_agent: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Webie AI',
      agent_id: 'NL-AGENT-001',
      trust_score: 4.9,
    },
    x402_status: 'released',
    erc8004_match: true,
    trust_impact: 0.05,
  },
  {
    id: 'task-demo-2',
    title: 'Design Landing Page for SaaS Product',
    budget: 75.00,
    category: 'UI/UX Design',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'submitted',
    assigned_agent: {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'DesignBot',
      agent_id: 'NL-AGENT-002',
      trust_score: 4.8,
    },
    x402_status: 'processing',
    erc8004_match: true,
    trust_impact: 0.04,
  },
  {
    id: 'task-demo-3',
    title: 'Write 5 SEO Blog Posts about AI Agents',
    budget: 90.00,
    category: 'Content Writing',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'completed',
    assigned_agent: {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'ContentGPT',
      agent_id: 'NL-AGENT-003',
      trust_score: 4.9,
    },
    x402_status: 'completed',
    erc8004_match: true,
    trust_impact: 0.05,
  },
];

// Task lifecycle badges
const TASK_STATUSES = [
  { id: 'draft', label: 'Draft', color: 'bg-secondary-100 text-secondary-600' },
  { id: 'funded', label: 'Funded', color: 'bg-blue-100 text-blue-600' },
  { id: 'x402_authorized', label: 'x402 Authorized', color: 'bg-amber-100 text-amber-600' },
  { id: 'agent_matched', label: 'Agent Matched', color: 'bg-purple-100 text-purple-600' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-primary-100 text-primary-600' },
  { id: 'submitted', label: 'Submitted', color: 'bg-cyan-100 text-cyan-600' },
  { id: 'approved', label: 'Approved', color: 'bg-green-100 text-green-600' },
  { id: 'released', label: 'Released', color: 'bg-emerald-100 text-emerald-600' },
  { id: 'completed', label: 'Completed', color: 'bg-emerald-500 text-white' },
  { id: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-600' },
];

const X402_STATUSES = [
  { id: 'pending', label: 'Pending', color: 'bg-secondary-100 text-secondary-600' },
  { id: 'authorized', label: 'Authorized', color: 'bg-amber-100 text-amber-600' },
  { id: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-600' },
  { id: 'released', label: 'Released', color: 'bg-emerald-100 text-emerald-600' },
  { id: 'completed', label: 'Completed', color: 'bg-emerald-500 text-white' },
];

export function MyTasks() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(DEMO_TASKS);
  const [loading, setLoading] = useState(true);
  const [newlyCreated, setNewlyCreated] = useState<string | null>(null);

  // Selection state for bulk actions
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    taskIds: string[];
    isCompleted: boolean;
  }>({
    isOpen: false,
    taskIds: [],
    isCompleted: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      const state = (window.history.state?.usr as any)?.newTask;
      if (state) {
        setNewlyCreated(state.id);
        setTasks(prev => [state, ...prev.filter(t => t.id !== state.id)]);
        setTimeout(() => setNewlyCreated(null), 5000);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Auto-hide toast
  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Calculate stats
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(t => !['completed', 'cancelled'].includes(t.status)).length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const escrowValue = tasks
    .filter(t => ['in_progress', 'submitted'].includes(t.status))
    .reduce((sum, t) => sum + t.budget, 0);

  function getStatusBadge(status: string) {
    return TASK_STATUSES.find(s => s.id === status) || TASK_STATUSES[0];
  }

  function getX402Badge(status: string) {
    return X402_STATUSES.find(s => s.id === status) || X402_STATUSES[0];
  }

  function formatDate(date: string) {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  // Handle individual task selection
  function toggleTaskSelection(taskId: string) {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
    setSelectAll(newSelected.size === tasks.length);
  }

  // Handle select all
  function toggleSelectAll() {
    if (selectAll) {
      setSelectedTasks(new Set());
      setSelectAll(false);
    } else {
      setSelectedTasks(new Set(tasks.map(t => t.id)));
      setSelectAll(true);
    }
  }

  // Open delete modal for single task
  function handleDeleteTask(taskId: string, isCompleted: boolean) {
    setDeleteModal({
      isOpen: true,
      taskIds: [taskId],
      isCompleted,
    });
  }

  // Open delete modal for selected tasks
  function handleDeleteSelected() {
    const selectedTasksList = tasks.filter(t => selectedTasks.has(t.id));
    const hasCompleted = selectedTasksList.some(t => t.status === 'completed');

    setDeleteModal({
      isOpen: true,
      taskIds: Array.from(selectedTasks),
      isCompleted: hasCompleted,
    });
  }

  // Perform deletion
  async function confirmDelete() {
    setIsDeleting(true);

    // Simulate deletion
    await new Promise(resolve => setTimeout(resolve, 800));

    // Remove tasks from state
    setTasks(prev => prev.filter(t => !deleteModal.taskIds.includes(t.id)));
    setSelectedTasks(new Set());
    setSelectAll(false);

    setIsDeleting(false);
    setDeleteModal({ isOpen: false, taskIds: [], isCompleted: false });

    // Show success toast
    setToast({
      show: true,
      type: 'success',
      message: deleteModal.taskIds.length > 1
        ? `${deleteModal.taskIds.length} tasks deleted successfully.`
        : 'Task deleted successfully.',
    });
  }

  return (
    <Layout>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-4 z-50 animate-slideIn ${
          toast.type === 'success' ? '' : ''
        }`}>
          <div className={`px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 ${
            toast.type === 'success'
              ? 'bg-emerald-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
            <p className="font-medium">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-secondary-900 mb-2">My Tasks</h1>
          <p className="text-secondary-600">Manage and track your posted tasks</p>
        </div>
        <Link to="/tasks/new">
          <Button icon={<Plus className="w-4 h-4" />}>Create Task</Button>
        </Link>
      </div>

      {/* Stats Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{totalTasks}</p>
                <p className="text-xs text-secondary-500">Total Tasks</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{activeTasks}</p>
                <p className="text-xs text-secondary-500">Active Tasks</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{completedTasks}</p>
                <p className="text-xs text-secondary-500">Completed</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">${escrowValue.toFixed(0)}</p>
                <p className="text-xs text-secondary-500">Escrow Value</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-secondary-600">Loading your tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardBody className="p-12 text-center">
            <Briefcase className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">No tasks found</h3>
            <p className="text-secondary-600 mb-6">Create your first task to get started with AI agents</p>
            <Link to="/tasks/new">
              <Button icon={<Plus className="w-4 h-4" />} size="lg">Create Task</Button>
            </Link>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Task Lifecycle Legend */}
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4 p-3 bg-secondary-50 rounded-lg">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-secondary-500 font-medium">Lifecycle:</span>
              {TASK_STATUSES.slice(0, -1).map((status, idx) => (
                <div key={status.id} className="flex items-center gap-1">
                  {idx > 0 && <ArrowRight className="w-3 h-3 text-secondary-300" />}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
                </div>
              ))}
            </div>

            {/* Bulk Actions */}
            {selectedTasks.size > 0 && (
              <Button
                variant="ghost"
                onClick={handleDeleteSelected}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                icon={<Trash2 className="w-4 h-4" />}
              >
                Delete Selected ({selectedTasks.size})
              </Button>
            )}
          </div>

          {/* Select All Row */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-secondary-200">
            <button
              onClick={toggleSelectAll}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                selectAll
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'border-secondary-300 hover:border-primary-400'
              }`}
            >
              {selectAll && <CheckCircle className="w-3 h-3" />}
            </button>
            <span className="text-sm text-secondary-600">
              {selectAll ? 'Deselect all' : 'Select all'} {tasks.length} tasks
            </span>
          </div>

          {/* Task Cards */}
          {tasks.map((task) => {
            const statusBadge = getStatusBadge(task.status);
            const x402Badge = getX402Badge(task.x402_status);
            const isNew = newlyCreated === task.id;
            const isSelected = selectedTasks.has(task.id);
            const isCompleted = task.status === 'completed';

            return (
              <Card
                key={task.id}
                hover
                className={`transition-all duration-300 ${isNew ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}
              >
                <CardBody className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTaskSelection(task.id)}
                      className={`w-5 h-5 mt-1 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-primary-500 border-primary-500 text-white'
                          : 'border-secondary-300 hover:border-primary-400'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-3 h-3" />}
                    </button>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {isNew && (
                          <span className="px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full animate-pulse">
                            New
                          </span>
                        )}
                        <h3 className="font-semibold text-lg text-secondary-900">{task.title}</h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600 mb-4">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {task.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(task.created_at)}
                        </span>
                      </div>

                      {/* Badges Row */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">
                          <Zap className="w-3 h-3" />
                          x402: {x402Badge.label}
                        </span>
                        {task.erc8004_match && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                            <Bot className="w-3 h-3" />
                            ERC-8004 Matched
                          </span>
                        )}
                      </div>

                      {/* Agent Info */}
                      {task.assigned_agent && (
                        <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {task.assigned_agent.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-secondary-900">{task.assigned_agent.name}</span>
                              <span className="text-xs text-secondary-500 font-mono">({task.assigned_agent.agent_id})</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-secondary-600">
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                Trust: {task.assigned_agent.trust_score}
                              </span>
                              <span className="flex items-center gap-1 text-emerald-600">
                                <Shield className="w-3 h-3" />
                                +{(task.trust_impact || 0).toFixed(2)} on completion
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Budget & Actions */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold text-secondary-900">${task.budget.toFixed(2)}</p>
                      <p className="text-xs text-secondary-500 mb-4">Budget</p>
                      <div className="flex flex-col gap-2">
                        <Link to={`/tasks/${task.id}`}>
                          <Button variant="secondary" size="sm" icon={<ExternalLink className="w-3 h-3" />}>
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id, isCompleted)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600 border border-red-200"
                          icon={<Trash2 className="w-3 h-3" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => !isDeleting && setDeleteModal({ isOpen: false, taskIds: [], isCompleted: false })}
        title=""
        size="md"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-center text-secondary-900 mb-2">
            Delete Task{deleteModal.taskIds.length > 1 ? 's' : ''}?
          </h2>

          <p className="text-secondary-600 text-center mb-6">
            Are you sure you want to permanently delete{' '}
            {deleteModal.taskIds.length > 1
              ? `${deleteModal.taskIds.length} tasks`
              : 'this task'}?{' '}
            <span className="font-semibold">This action cannot be undone.</span>
          </p>

          {/* Warning for completed tasks */}
          {deleteModal.isCompleted && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Warning</p>
                <p className="text-sm text-amber-700">
                  This selection includes completed tasks. Deleting them will remove their history from the system.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, taskIds: [], isCompleted: false })}
              className="flex-1"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              disabled={isDeleting}
              icon={isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            >
              {isDeleting ? 'Deleting...' : `Delete ${deleteModal.taskIds.length > 1 ? `${deleteModal.taskIds.length} Tasks` : 'Task'}`}
            </Button>
          </div>
        </div>
      </Modal>

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

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { formatCurrency, formatDate, CATEGORIES } from '../lib/utils';
import { Layout } from '../components/layout/Layout';
import { Card, CardBody } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { StatusBadge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { EmptyState, LoadingState } from '../components/ui/Skeleton';
import {
  Search,
  Plus,
  Filter,
  X,
  Calendar,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// Demo tasks data for hackathon mode
const DEMO_TASKS = [
  {
    id: 'demo-task-1',
    title: 'Write a comprehensive blog post about AI agents',
    description: 'Create a detailed, engaging blog post about autonomous AI agents and their role in the future of work. Include real-world examples and statistics.',
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
      user_type: 'business',
      avatar_url: null,
      created_at: new Date().toISOString(),
    },
  },
  {
    id: 'demo-task-2',
    title: 'Market research for new SaaS product',
    description: 'Conduct market research for a new productivity SaaS product. Analyze competitors, target audience, and market trends.',
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
      user_type: 'business',
      avatar_url: null,
      created_at: new Date().toISOString(),
    },
  },
  {
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
      user_type: 'business',
      avatar_url: null,
      created_at: new Date().toISOString(),
    },
  },
  {
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
      user_type: 'business',
      avatar_url: null,
      created_at: new Date().toISOString(),
    },
  },
];

export function Tasks() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState<typeof DEMO_TASKS>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [category, sortBy]);

  function loadTasks() {
    setLoading(true);

    // Simulate brief loading then show demo tasks
    setTimeout(() => {
      let filteredTasks = [...DEMO_TASKS];

      // Apply category filter
      if (category) {
        filteredTasks = filteredTasks.filter(t => t.category === category);
      }

      // Apply sort
      if (sortBy === 'newest') {
        filteredTasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else if (sortBy === 'oldest') {
        filteredTasks.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      } else if (sortBy === 'budget_high') {
        filteredTasks.sort((a, b) => b.budget - a.budget);
      } else if (sortBy === 'budget_low') {
        filteredTasks.sort((a, b) => a.budget - b.budget);
      }

      setTasks(filteredTasks);
      setLoading(false);
    }, 600);
  }

  const filteredTasks = tasks.filter((task) => {
    if (search) {
      const q = search.toLowerCase();
      return task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q);
    }
    return true;
  });

  function handleCategoryChange(cat: string) {
    setCategory(cat);
    if (cat) {
      searchParams.set('category', cat);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-secondary-900 mb-2">Open Tasks</h1>
          <p className="text-secondary-600">Browse tasks that need completing</p>
        </div>
        <Link to="/tasks/new">
          <Button icon={<Plus className="w-4 h-4" />}>Post Task</Button>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters */}
        <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card className="sticky top-24">
            <CardBody>
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-secondary-700 mb-3">Category</h4>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-secondary-700 mb-3">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="budget_high">Budget: High to Low</option>
                    <option value="budget_low">Budget: Low to High</option>
                  </select>
                </div>

                {category && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCategoryChange('')}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                )}
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
                placeholder="Search tasks..."
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

          {loading ? (
            <LoadingState message="Loading tasks..." />
          ) : filteredTasks.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="w-8 h-8" />}
              title="No tasks found"
              description="Try adjusting your filters or search query"
            />
          ) : (
            <>
              <p className="text-sm text-secondary-600 mb-4">
                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
              </p>

              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <Link key={task.id} to={`/tasks/${task.id}`}>
                    <Card hover className="cursor-pointer">
                      <CardBody className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <StatusBadge status={task.status} />
                              <span className="text-sm text-secondary-500">{task.category}</span>
                            </div>
                            <h3 className="font-semibold text-secondary-900 text-lg mb-2">
                              {task.title}
                            </h3>
                            <p className="text-secondary-600 line-clamp-2 mb-4">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-secondary-500">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <span>Posted {formatDate(task.created_at)}</span>
                              </div>
                              {task.deadline && (
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4" />
                                  <span>Due {formatDate(task.deadline)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary-600">
                              {formatCurrency(task.budget)}
                            </p>
                            <p className="text-sm text-secondary-500">budget</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

import type { TaskStatus } from '../../types';
import { Clock, Sparkles, Send, CheckCircle, XCircle } from 'lucide-react';

interface BadgeProps {
  status: TaskStatus;
}

const statusConfig: Record<TaskStatus, { label: string; className: string; icon: typeof Clock }> = {
  open: { label: 'Open', className: 'bg-warning-100 text-warning-700 border-warning-200', icon: Clock },
  in_progress: { label: 'In Progress', className: 'bg-primary-100 text-primary-700 border-primary-200', icon: Sparkles },
  submitted: { label: 'Submitted', className: 'bg-accent-100 text-accent-700 border-accent-200', icon: Send },
  completed: { label: 'Completed', className: 'bg-accent-100 text-accent-700 border-accent-200', icon: CheckCircle },
  cancelled: { label: 'Cancelled', className: 'bg-secondary-100 text-secondary-700 border-secondary-200', icon: XCircle },
};

export function StatusBadge({ status }: BadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

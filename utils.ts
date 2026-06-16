import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string | null): string {
  if (!date) return 'No deadline';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export const CATEGORIES = [
  'Software Development',
  'Data Analysis',
  'Content Writing',
  'Design & Creative',
  'Research',
  'Translation',
  'Data Entry',
  'Customer Support',
  'Marketing',
  'Other',
];

export const AGENT_SPECIALTIES = [
  'Web Development',
  'Mobile Development',
  'Python & Data Science',
  'Machine Learning',
  'API Integration',
  'Database Design',
  'Cloud Architecture',
  'DevOps',
  'UI/UX Design',
  'Technical Writing',
  'Research & Analysis',
  'Translation',
  'Content Creation',
  'SEO & Marketing',
  'Automation',
];

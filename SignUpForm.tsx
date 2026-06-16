import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Mail, Lock, User, Briefcase, Cpu } from 'lucide-react';
import type { UserType } from '../../types';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  onClose: () => void;
}

export function SignUpForm({ onSwitchToSignIn, onClose }: SignUpFormProps) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<UserType>('business');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signUp(email, password, fullName, userType);
    setLoading(false);

    if (error) {
      setError(error.message || 'Failed to create account. Please try again.');
    } else {
      onClose();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-sm text-error-700">
          {error}
        </div>
      )}

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="pl-10"
        />
      </div>

      <div className="relative">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
        <Input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="pl-10"
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
        <Input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="pl-10"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-secondary-700">I want to:</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setUserType('business')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              userType === 'business'
                ? 'border-primary-500 bg-primary-50'
                : 'border-secondary-200 hover:border-secondary-300'
            }`}
          >
            <Briefcase className={`w-6 h-6 mb-2 ${userType === 'business' ? 'text-primary-600' : 'text-secondary-400'}`} />
            <p className={`font-medium ${userType === 'business' ? 'text-primary-700' : 'text-secondary-700'}`}>
              Hire AI Agents
            </p>
            <p className="text-xs text-secondary-500 mt-1">Post tasks and get work done</p>
          </button>

          <button
            type="button"
            onClick={() => setUserType('agent')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              userType === 'agent'
                ? 'border-primary-500 bg-primary-50'
                : 'border-secondary-200 hover:border-secondary-300'
            }`}
          >
            <Cpu className={`w-6 h-6 mb-2 ${userType === 'agent' ? 'text-primary-600' : 'text-secondary-400'}`} />
            <p className={`font-medium ${userType === 'agent' ? 'text-primary-700' : 'text-secondary-700'}`}>
              Be an Agent
            </p>
            <p className="text-xs text-secondary-500 mt-1">Complete tasks and earn money</p>
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full" loading={loading}>
        Create Account
      </Button>

      <p className="text-center text-sm text-secondary-600">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToSignIn} className="text-primary-600 hover:text-primary-700 font-medium">
          Sign in
        </button>
      </p>
    </form>
  );
}

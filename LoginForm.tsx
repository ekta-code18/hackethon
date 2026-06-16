import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Mail, Lock } from 'lucide-react';

interface LoginFormProps {
  onSwitchToSignUp: () => void;
  onClose: () => void;
}

export function LoginForm({ onSwitchToSignUp, onClose }: LoginFormProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setError('Invalid email or password. Please try again.');
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
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="pl-10"
        />
      </div>

      <Button type="submit" className="w-full" loading={loading}>
        Sign In
      </Button>

      <p className="text-center text-sm text-secondary-600">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignUp} className="text-primary-600 hover:text-primary-700 font-medium">
          Sign up
        </button>
      </p>
    </form>
  );
}

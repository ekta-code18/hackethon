import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, defaultView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'signup'>(defaultView);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={view === 'login' ? 'Welcome back' : 'Create your account'}
      size="md"
    >
      {view === 'login' ? (
        <LoginForm onSwitchToSignUp={() => setView('signup')} onClose={onClose} />
      ) : (
        <SignUpForm onSwitchToSignIn={() => setView('login')} onClose={onClose} />
      )}
    </Modal>
  );
}

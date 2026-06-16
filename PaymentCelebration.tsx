import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Wallet, Shield, TrendingUp, CheckCircle, Sparkles, ArrowRight, PartyPopper } from 'lucide-react';

interface PaymentData {
  amount: number;
  transactionId: string;
  walletBefore: number;
  walletAfter: number;
  trustBefore: number;
  trustAfter: number;
}

interface PaymentCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: PaymentData;
  onContinue?: () => void;
}

// Simple confetti particle
function ConfettiParticle({ delay }: { delay: number }) {
  const style = {
    left: `${Math.random() * 100}%`,
    animationDelay: `${delay}ms`,
    backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
  };

  return (
    <div
      className="absolute w-2 h-2 rounded-full animate-confetti"
      style={style}
    />
  );
}

export function PaymentCelebration({ isOpen, onClose, paymentData, onContinue }: PaymentCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateAmount, setAnimateAmount] = useState(false);
  const [animateTrust, setAnimateTrust] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setTimeout(() => setAnimateAmount(true), 300);
      setTimeout(() => setAnimateTrust(true), 600);

      // Stop confetti after 4 seconds
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    } else {
      setAnimateAmount(false);
      setAnimateTrust(false);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
      <div className="relative overflow-hidden">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <ConfettiParticle key={i} delay={i * 30} />
            ))}
          </div>
        )}

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-radial from-emerald-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative p-8 text-center">
          {/* Success Icon */}
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/40">
              <Wallet className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -inset-2 border-4 border-emerald-400/30 rounded-full animate-ping" />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-emerald-500 animate-bounce" />
            </div>
          </div>

          {/* Title */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🎉</span>
            <h2 className="text-2xl font-bold text-secondary-900">Payment Released!</h2>
            <span className="text-2xl">🎉</span>
          </div>

          {/* Amount */}
          <div className="mb-6">
            <p className="text-secondary-500 text-sm uppercase tracking-wider mb-1">Amount</p>
            <p className={`text-5xl font-bold bg-gradient-to-r from-emerald-600 to-primary-600 bg-clip-text text-transparent transition-all duration-500 ${animateAmount ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
              ${paymentData.amount.toFixed(2)}
            </p>
          </div>

          {/* Payment Card */}
          <div className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 rounded-2xl p-5 text-white mb-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white/60 text-xs">Transaction ID</p>
                <p className="font-mono text-accent-400 text-sm">{paymentData.transactionId}</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Released
                </span>
              </div>
            </div>

            {/* Agent Wallet Update */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Agent Wallet</span>
                <div className="flex items-center gap-2">
                  <span className="text-white/50">${paymentData.walletBefore.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">${paymentData.walletAfter.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Score Update */}
          <div className={`bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4 mb-6 border border-primary-100 transition-all duration-500 ${animateTrust ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-secondary-900">Trust Score Increased!</p>
                  <p className="text-xs text-secondary-500">Agent reputation boosted</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg text-secondary-400">{paymentData.trustBefore.toFixed(1)}</span>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  {paymentData.trustAfter.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Celebration Message */}
          <div className="flex items-center justify-center gap-2 text-emerald-600 mb-6">
            <PartyPopper className="w-5 h-5" />
            <span className="font-medium">Task completed successfully!</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button
              onClick={onContinue || onClose}
              className="flex-1 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500"
              icon={<Sparkles className="w-4 h-4" />}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(300px) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </Modal>
  );
}

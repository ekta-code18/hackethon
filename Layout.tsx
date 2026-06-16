import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
}

export function Layout({ children, fullWidth = false }: LayoutProps) {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Show demo mode toast once per session
    const hasSeenToast = sessionStorage.getItem('neurolance-demo-toast');
    if (!hasSeenToast) {
      setShowToast(true);
      sessionStorage.setItem('neurolance-demo-toast', 'true');
      setTimeout(() => setShowToast(false), 3000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      <main className={`pt-24 ${fullWidth ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        {children}
      </main>

      {/* Demo Mode Toast */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slideUp">
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="font-medium">Demo Mode Active</span>
            <span className="text-white/80 text-sm">- All features unlocked</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Cpu, Menu, X, ChevronDown, LayoutDashboard, Bot, Wallet, Shield, LogOut, Rocket, Sparkles, FileText, Briefcase } from 'lucide-react';
import { Button } from '../ui/Button';

export function Header() {
  const { user, isDemoMode } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLanding = location.pathname === '/';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/tasks/my-tasks', label: 'Tasks' },
    { to: '/architecture', label: 'Architecture' },
    { to: '/hackathon', label: 'Demo', icon: Sparkles, highlight: true },
  ];

  const dropdownItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks/my-tasks', label: 'My Tasks', icon: Briefcase },
    { to: '/marketplace', label: 'My Agents', icon: Bot },
    { to: '/profile', label: 'Wallet', icon: Wallet },
    { to: '/profile', label: 'Trust Score', icon: Shield },
    { to: '/architecture', label: 'Architecture', icon: FileText },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          isLanding ? 'bg-transparent' : 'bg-white/95 backdrop-blur-sm border-b border-secondary-200'
        }`}
      >
        {/* Hackathon Mode Banner */}
        {isDemoMode && (
          <div className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 text-white py-1.5 px-4 text-center text-sm font-medium">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Rocket className="w-4 h-4" />
                HACKATHON DEMO MODE
              </span>
              <span className="hidden sm:inline text-white/60">|</span>
              <span className="hidden sm:flex items-center gap-2">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">x402 Payments</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">ERC-8004 Trust</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Autonomous AI</span>
              </span>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className={`font-display font-bold text-xl ${isLanding ? 'text-white' : 'text-secondary-900'}`}>
                NeuroLance
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    link.highlight
                      ? (isLanding ? 'text-accent-400 hover:text-accent-300' : 'text-accent-600 hover:text-accent-700')
                      : (isLanding ? 'text-white/80 hover:text-white' : 'text-secondary-600 hover:text-secondary-900')
                  }`}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              ))}

              {/* User Profile Dropdown or Sign In */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isLanding
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900'
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.full_name?.charAt(0) || 'U'}
                    </div>
                    <span className="font-medium">{user.full_name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-secondary-200 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-secondary-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.full_name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-secondary-900">{user.full_name}</p>
                            <div className="flex items-center gap-1 text-xs text-emerald-600">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                              Online
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Wallet & Trust Stats */}
                      <div className="px-4 py-3 bg-secondary-50 border-b border-secondary-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-secondary-600">Wallet</span>
                          <span className="font-semibold text-secondary-900">${(user as any).wallet_balance?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-secondary-600">Trust Score</span>
                          <span className="font-semibold text-accent-600 flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            {(user as any).trust_score?.toFixed(1) || '0.0'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-secondary-600">Tasks</span>
                          <span className="font-semibold text-secondary-900">{(user as any).completed_tasks || 0}</span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      {dropdownItems.map((item) => (
                        <Link
                          key={item.to + item.label}
                          to={item.to}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900 transition-colors"
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      ))}

                      {/* Logout */}
                      <div className="border-t border-secondary-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            // In demo mode, stay logged in
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-secondary-500 hover:bg-secondary-50 transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => navigate('/hackathon')}
                  className={isLanding ? 'bg-white text-primary-700 hover:bg-gray-50' : ''}
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  Start Demo
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${
                isLanding ? 'text-white hover:bg-white/10' : 'text-secondary-600 hover:bg-secondary-100'
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-secondary-200 py-4">
            <div className="max-w-7xl mx-auto px-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    link.highlight
                      ? 'bg-accent-50 text-accent-700 font-medium'
                      : 'text-secondary-600 hover:bg-secondary-50'
                  }`}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              ))}

              {user && (
                <>
                  <div className="pt-2 border-t border-secondary-100 mt-2">
                    <div className="px-4 py-2 text-secondary-400 text-xs uppercase tracking-wider">Account</div>
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.to + item.label}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-secondary-600 hover:bg-secondary-50 rounded-lg"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="px-4 py-3 bg-secondary-50 rounded-lg mt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Wallet</span>
                      <span className="font-semibold">${(user as any).wallet_balance?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-secondary-600">Trust Score</span>
                      <span className="font-semibold text-accent-600">{(user as any).trust_score?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

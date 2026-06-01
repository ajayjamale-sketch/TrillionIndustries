import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, Sun, Moon, ChevronDown, Bell,
  Factory, BarChart3, LogOut, User, Settings
} from 'lucide-react';
import { useThemeContext } from '@/components/features/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/constants';
import { getInitials } from '@/lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useThemeContext();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard = location.pathname.startsWith('/dashboard');
  const isHomePage = location.pathname === '/';
  // Hero section is adaptive to light mode now, so we don't need fixed dark text logic.
  const onDarkBg = false;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isDashboard) return null;

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled
        ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
        : isHomePage
          ? 'bg-transparent'
          : 'bg-background/95 backdrop-blur-md border-b border-border'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#1E40AF] flex items-center justify-center shadow-brand group-hover:scale-105 transition-transform">
              <Factory className="h-4 w-4 text-white" />
            </div>
            <span className={cn('font-black text-lg tracking-tight', onDarkBg ? 'text-white' : 'text-foreground')}>
              Trillion<span className={onDarkBg ? 'text-[#F97316]' : 'text-primary'}>Industries</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <button
                    className={cn(
                      'flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                      onDarkBg
                        ? 'text-gray-300 hover:bg-white/8 hover:text-white'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      activeDropdown === item.label && (onDarkBg ? 'bg-white/10 text-white' : 'bg-muted text-foreground')
                    )}
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.label}
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', activeDropdown === item.label && 'rotate-180')} />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                      location.pathname === item.href
                        ? onDarkBg
                          ? 'text-[#F97316] font-semibold'
                          : 'text-primary font-semibold'
                        : onDarkBg
                          ? 'text-gray-300 hover:text-white hover:bg-white/8'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown */}
                {item.children && activeDropdown === item.label && (
                  <div
                    className="absolute top-full left-0 mt-1 w-60 bg-popover border border-border rounded-xl shadow-lg p-1.5"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.children.map(child => (
                      <Link key={child.label} to={child.href}
                        className="flex items-center px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                'p-2 rounded-lg transition-colors',
                onDarkBg
                  ? 'text-gray-300 hover:text-white hover:bg-white/8'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {isAuthenticated && user ? (
              <>
                <button className={cn(
                  'p-2 rounded-lg transition-colors relative',
                  onDarkBg ? 'text-gray-300 hover:text-white hover:bg-white/8' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}>
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={cn('flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-colors', onDarkBg ? 'hover:bg-white/8' : 'hover:bg-muted')}
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <span className={cn('text-sm font-semibold hidden sm:block', onDarkBg ? 'text-white' : 'text-foreground')}>
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className={cn('h-3 w-3', onDarkBg ? 'text-gray-400' : 'text-muted-foreground')} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-xl shadow-xl py-1.5 z-50">
                      <div className="px-3 py-2.5 border-b border-border mb-1">
                        <p className="text-sm font-bold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />Dashboard
                      </Link>
                      <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors">
                        <User className="h-4 w-4 text-muted-foreground" />Profile
                      </Link>
                      <Link to="/dashboard/settings" className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors">
                        <Settings className="h-4 w-4 text-muted-foreground" />Settings
                      </Link>
                      <div className="border-t border-border mt-1 pt-1">
                        <button onClick={handleLogout}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full">
                          <LogOut className="h-4 w-4" />Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <Link to="/dashboard" className="hidden sm:flex px-4 py-2 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-brand">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={cn(
                    'hidden sm:flex px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors',
                    onDarkBg
                      ? 'text-gray-300 hover:text-white hover:bg-white/8'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="flex px-4 py-2 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-brand"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'lg:hidden p-2 rounded-lg transition-colors ml-1',
                onDarkBg ? 'text-gray-300 hover:text-white hover:bg-white/8' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background/98 backdrop-blur-md border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  'flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                  location.pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm">
                    <BarChart3 className="h-4 w-4" />Go to Dashboard
                  </Link>
                  <button onClick={handleLogout} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors">
                    <LogOut className="h-4 w-4" />Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center justify-center px-4 py-3 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
                    Sign in
                  </Link>
                  <Link to="/register" className="flex items-center justify-center px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm">
                    Start Free Trial
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

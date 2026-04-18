import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, Menu } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useState } from 'react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const dashboardPath = user?.role === 'student' ? '/student/dashboard'
    : user?.role === 'company' ? '/company/dashboard'
      : '/admin/dashboard';

  const navLinks = !isAuthenticated ? [
    { label: 'Browse Internships', path: '/internships' },
  ] : user?.role === 'student' ? [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Browse', path: '/internships' },
    { label: 'Profile', path: '/student/profile' },
  ] : user?.role === 'company' ? [
    { label: 'Dashboard', path: '/company/dashboard' },
    { label: 'My Internships', path: '/company/internships' },
    { label: 'Create', path: '/company/internships/create' },
    { label: 'Analytics', path: '/company/analytics' },
  ] : [
    { label: 'Dashboard', path: '/admin/dashboard' },
  ];

  const displayName = user?.role === 'student' ? user.username
    : user?.role === 'company' ? user.companyName
      : user?.role === 'admin' ? user.username : '';

  const mobileNavLinks = !isAuthenticated ? [
    ...navLinks,
    { label: 'Login', path: '/login' },
    { label: 'Sign Up', path: '/signup' },
  ] : navLinks;

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to={isAuthenticated ? dashboardPath : '/'} className="flex items-center gap-2">
            <img src={logo} alt="Interno" className="h-9 w-auto" />
            <span className="text-xl font-bold gradient-primary-text hidden sm:block">Interno</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {!isAuthenticated && (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Login
                </Link>
                <Link to="/signup">
                  <Button className="gradient-primary text-primary-foreground h-9 px-4">Sign Up</Button>
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="hidden sm:block text-sm">{displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate(user?.role === 'company' ? '/company/profile' : '/student/profile')}>
                    <Settings className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-fade-in">
            {mobileNavLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

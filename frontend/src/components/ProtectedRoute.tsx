import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isAuthLoading } = useAuthStore();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const redirectMap: Record<UserRole, string> = {
      student: '/student/dashboard',
      company: '/company/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={redirectMap[user.role]} replace />;
  }

  if (user.role === 'student') {
    const hasCompleted = (user as any).hasCompletedOnboarding;
    const isOnboardingPath = window.location.pathname === '/onboarding';
    
    // Hard gate: must complete onboarding
    if (!hasCompleted && !isOnboardingPath) {
      return <Navigate to="/onboarding" replace />;
    }
    
    // Prevent re-accessing onboarding if already complete
    if (hasCompleted && isOnboardingPath) {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  if (user.role === 'company') {
    // Cast user as CompanyProfile to safely check isApproved
    // If not approved and trying to access a page other than Dashboard or Profile, redirect!
    const isCompanyDashboard = window.location.pathname === '/company/dashboard';
    const isCompanyProfile = window.location.pathname === '/company/profile';
    if (!(user as any).isApproved && !isCompanyDashboard && !isCompanyProfile) {
      return <Navigate to="/company/dashboard" replace />;
    }
  }

  return <>{children}</>;
}

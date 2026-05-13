import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppUser, UserRole, StudentProfile } from '@/types';
import { authService, injectAuthStore } from '@/services/api';

interface AuthState {
  user: AppUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isLoading: boolean;
  otpSent: boolean;
  otpEmail: string;

  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (data: Record<string, string>, role: UserRole) => Promise<boolean>;
  sendOtp: (email: string) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<AppUser>) => Promise<void>;
  updateSkills: (skills: string[]) => void;
  loadUser: () => Promise<void>;
  completeOnboardingState: () => void;
  toggleSavedOpportunityState: (opportunityId: string, savedOpportunities: string[]) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAuthLoading: true,
      isLoading: false,
      otpSent: false,
      otpEmail: '',

  login: async (email, password, role) => {
    set({ isLoading: true });
    try {
      const { data } = await authService.login(email, password, role);
      sessionStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false, isAuthLoading: false });
      return true;
    } catch (err: any) {
      set({ isLoading: false });
      throw err;
    }
  },

  signup: async (data, role) => {
    set({ isLoading: true });
    try {
      const res = await authService.signup({ ...data, role });
      set({ isLoading: false, otpEmail: (res.data && res.data.email) || data.email });
      return true;
    } catch (err: any) {
      set({ isLoading: false });
      throw err;
    }
  },

  sendOtp: async (email) => {
    set({ isLoading: true });
    try {
      await authService.sendOtp(email);
      set({ otpSent: true, otpEmail: email, isLoading: false });
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  verifyOtp: async (email, otp) => {
    set({ isLoading: true });
    try {
      const { data } = await authService.verifyOtp(email, otp);
      sessionStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false, otpSent: false, isAuthLoading: false, otpEmail: '' });
      return true;
    } catch (err: any) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    // Clear Zustand persist storage to prevent stale role rehydration on next load
    try { sessionStorage.removeItem('auth-storage'); } catch { /* ignore */ }
    set({ user: null, token: null, isAuthenticated: false, otpSent: false, otpEmail: '', isAuthLoading: false });
  },

  updateProfile: async (data: Partial<AppUser>) => {
    try {
      const res = await authService.updateProfile(data as Record<string, unknown>);
      set(state => {
        const newUser = state.user ? { ...state.user, ...res.data } as AppUser : null;
        if (newUser) sessionStorage.setItem('user', JSON.stringify(newUser));
        return { user: newUser };
      });
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  },

  updateSkills: (skills) => set(state => {
    if (state.user?.role === 'student') {
      return { user: { ...state.user, skills } as StudentProfile };
    }
    return {};
  }),

  completeOnboardingState: () => set(state => {
    if (state.user?.role === 'student') {
      return { user: { ...state.user, hasCompletedOnboarding: true } as StudentProfile };
    }
    return {};
  }),

  loadUser: async () => {
    const currentToken = get().token || sessionStorage.getItem('token');
    if (!currentToken) {
      set({ user: null, token: null, isAuthenticated: false, isAuthLoading: false });
      return;
    }

    // Ensure token is synced so that Axios requests can use it
    if (!sessionStorage.getItem('token')) {
      sessionStorage.setItem('token', currentToken);
    }

    set({ isAuthLoading: true });
    try {
      const { data } = await authService.getProfile();
      // Validate that the profile role matches — prevents stale role in Zustand
      if (!data || !data.role) {
        throw new Error('Invalid profile response');
      }
      set({ user: data, token: currentToken, isAuthenticated: true, isAuthLoading: false });
    } catch {
      sessionStorage.removeItem('token');
      try { sessionStorage.removeItem('auth-storage'); } catch { /* ignore */ }
      set({ user: null, token: null, isAuthenticated: false, isAuthLoading: false });
    }
  },

  toggleSavedOpportunityState: (opportunityId, savedOpportunities) => set(state => {
    if (state.user?.role === 'student') {
      const newUser = { ...state.user, savedOpportunities } as StudentProfile;
      sessionStorage.setItem('user', JSON.stringify(newUser));
      return { user: newUser };
    }
    return {};
  }),
}), {
  name: 'auth-storage',
  storage: createJSONStorage(() => sessionStorage),
  partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated })
}));

injectAuthStore(useAuthStore);

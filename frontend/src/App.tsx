import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import AdminLoginPage from "./pages/AdminLogin";
import SignupPage from "./pages/Signup";
import VerifyEmailPage from "./pages/VerifyEmail";
import InternshipBrowse from "./pages/InternshipBrowse";
import InternshipDetails from "./pages/InternshipDetails";
import ExamPage from "./pages/ExamPage";

import StudentDashboard from "./pages/student/Dashboard";
import StudentProfilePage from "./pages/student/Profile";

import CompanyDashboard from "./pages/company/Dashboard";
import CompanyProfilePage from "./pages/company/Profile";
import CreateInternship from "./pages/company/CreateInternship";
import CompanyInternships from "./pages/company/Internships";
import ApplicantsView from "./pages/company/Applicants";
import CompanyAnalytics from "./pages/company/Analytics";

import AdminDashboard from "./pages/admin/Dashboard";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/admin" element={<AdminLoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/internships" element={<InternshipBrowse />} />
          <Route path="/internships/:id" element={<InternshipDetails />} />

          {/* Student routes */}
          <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfilePage /></ProtectedRoute>} />
          <Route path="/exam/:internshipId" element={<ProtectedRoute allowedRoles={['student']}><ExamPage /></ProtectedRoute>} />

          {/* Company routes */}
          <Route path="/company/dashboard" element={<ProtectedRoute allowedRoles={['company']}><CompanyDashboard /></ProtectedRoute>} />
          <Route path="/company/profile" element={<ProtectedRoute allowedRoles={['company']}><CompanyProfilePage /></ProtectedRoute>} />
          <Route path="/company/internships" element={<ProtectedRoute allowedRoles={['company']}><CompanyInternships /></ProtectedRoute>} />
          <Route path="/company/internships/create" element={<ProtectedRoute allowedRoles={['company']}><CreateInternship /></ProtectedRoute>} />
          <Route path="/company/internships/:internshipId/applicants" element={<ProtectedRoute allowedRoles={['company']}><ApplicantsView /></ProtectedRoute>} />
          <Route path="/company/analytics" element={<ProtectedRoute allowedRoles={['company']}><CompanyAnalytics /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;

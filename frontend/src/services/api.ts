import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor for auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor for auto-logout on 401 and unpacking standardized responses
api.interceptors.response.use(
  response => {
    if (response.data && typeof response.data.success !== 'undefined') {
      if (!response.data.success) {
        return Promise.reject(new Error(response.data.message || 'API Error'));
      }
      response.data = response.data.data;
    }
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    if (error.response?.data?.isVerified !== undefined) {
      error.isVerified = error.response.data.isVerified;
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth Service
export const authService = {
  login: (email: string, password: string, role: string) =>
    api.post('/auth/login', { email, password, role }),
  signup: (data: Record<string, string>) =>
    api.post('/auth/signup', data),
  sendOtp: (email: string) =>
    api.post('/auth/resend-otp', { email }),
  verifyOtp: (email: string, otp: string) =>
    api.post('/auth/verify-email', { email, otp }),
  getProfile: () =>
    api.get('/auth/profile'),
  updateProfile: (data: FormData | Record<string, unknown>) => {
    const isFormData = data instanceof FormData;
    return api.put('/auth/profile', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
    });
  },
};

// Internship Service
export const internshipService = {
  getAll: (params?: Record<string, string>) =>
    api.get('/internships', { params }),
  getById: (id: string) =>
    api.get(`/internships/${id}`),
  create: (data: Record<string, unknown>) =>
    api.post('/internships', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/internships/${id}`, data),
  delete: (id: string) =>
    api.delete(`/internships/${id}`),
};

// Application Service
export const applicationService = {
  apply: (internshipId: string, data: Record<string, unknown>) =>
    api.post(`/internships/${internshipId}/apply`, data),
  getMyApplications: () =>
    api.get('/applications/me'),
  getCompanyApplications: () =>
    api.get('/applications/company'),
  getForInternship: (internshipId: string) =>
    api.get(`/applications/internship/${internshipId}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/applications/${id}/status`, { status }),
};

// Exam Service
export const examService = {
  getExam: (internshipId: string) =>
    api.get(`/internships/${internshipId}/exam`),
  submitExam: (internshipId: string, answers: Record<string, number>) =>
    api.post(`/internships/${internshipId}/exam/submit`, { answers }),
};

// AI Service
export const aiService = {
  extractSkills: (file: File) => {
    const formData = new FormData();
    formData.append('cv', file);
    return api.post('/ai/extract-skills', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000 // 60 seconds timeout for AI processing
    });
  },
};

// Admin Service
export const adminService = {
  getStudents: () => api.get('/admin/students'),
  getCompanies: () => api.get('/admin/companies'),
  approveCompany: (id: string) => api.patch(`/admin/companies/${id}/approve`),
  rejectCompany: (id: string) => api.patch(`/admin/companies/${id}/reject`),
  suspendUser: (id: string) => api.patch(`/admin/users/${id}/suspend`),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
};

import { useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { useInternshipStore } from '@/store/internshipStore';
import type { CompanyProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, Users, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';

const CHART_COLORS = ['#34C27A', '#0F5A2E', '#2FBF71', '#6B7280'];

export default function CompanyDashboard() {
  const user = useAuthStore(s => s.user) as CompanyProfile;
  const navigate = useNavigate();
  const { internships, getCompanyApplications, fetchInternships, fetchCompanyApplications } = useInternshipStore();
  
  useEffect(() => {
    if (user?.id) {
      fetchInternships();
      fetchCompanyApplications();
    }
  }, [user?.id, fetchInternships, fetchCompanyApplications]);

  const companyInternships = internships.filter(i => i.companyId === user.id);
  const applications = getCompanyApplications(user.id);

  if (!user.isApproved) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-fade-in">
          <AlertTriangle className="h-16 w-16 text-warning" />
          <h1 className="text-2xl font-bold">Pending Approval</h1>
          <p className="text-muted-foreground text-center max-w-md">
            Your company account is awaiting admin approval. You'll be able to create internships once approved.
          </p>
        </div>
      </AppLayout>
    );
  }

  const accepted = applications.filter(a => a.status === 'accepted').length;
  const genderData = [
    { name: 'Male', value: applications.filter(a => a.studentGender === 'male').length },
    { name: 'Female', value: applications.filter(a => a.studentGender === 'female').length },
    { name: 'Other', value: applications.filter(a => !a.studentGender || a.studentGender === 'other').length },
  ].filter(d => d.value > 0);

  const scoreData = [
    { range: '0-25', count: applications.filter(a => (a.examScore ?? 0) <= 25).length },
    { range: '26-50', count: applications.filter(a => (a.examScore ?? 0) > 25 && (a.examScore ?? 0) <= 50).length },
    { range: '51-75', count: applications.filter(a => (a.examScore ?? 0) > 50 && (a.examScore ?? 0) <= 75).length },
    { range: '76-100', count: applications.filter(a => (a.examScore ?? 0) > 75).length },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Company Dashboard</h1>
            <p className="text-muted-foreground">{user.companyName}</p>
          </div>
          <Button onClick={() => navigate('/company/internships/create')} className="gradient-primary text-primary-foreground">
            + New Internship
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Internships', value: companyInternships.length, icon: Briefcase },
            { label: 'Applicants', value: applications.length, icon: Users },
            { label: 'Accepted', value: accepted, icon: CheckCircle },
            { label: 'Acceptance Rate', value: applications.length ? `${Math.round((accepted / applications.length) * 100)}%` : '0%', icon: TrendingUp },
          ].map(s => (
            <Card key={s.label} className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary"><s.icon className="h-5 w-5" /></div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader><CardTitle>Score Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2FBF71" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader><CardTitle>Gender Distribution</CardTitle></CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={genderData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {genderData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

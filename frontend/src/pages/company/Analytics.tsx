import { useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { useInternshipStore } from '@/store/internshipStore';
import type { CompanyProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#34C27A', '#0F5A2E', '#2FBF71', '#6B7280', '#F59E0B'];

export default function CompanyAnalytics() {
  const user = useAuthStore(s => s.user) as CompanyProfile;
  const { internships, getCompanyApplications, fetchInternships, fetchCompanyApplications } = useInternshipStore();
  
  useEffect(() => {
    if (user?.id) {
      fetchInternships();
      fetchCompanyApplications();
    }
  }, [user?.id, fetchInternships, fetchCompanyApplications]);

  const companyInternships = internships.filter(i => i.companyId === user.id);
  const applications = getCompanyApplications(user.id);

  const applicantsPerInternship = companyInternships.map(i => ({
    name: i.title.length > 20 ? i.title.slice(0, 20) + '…' : i.title,
    count: applications.filter(a => a.internshipId === i.id).length,
  }));

  const genderData = [
    { name: 'Male', value: applications.filter(a => a.studentGender === 'male').length },
    { name: 'Female', value: applications.filter(a => a.studentGender === 'female').length },
    { name: 'Other', value: applications.filter(a => !a.studentGender || a.studentGender === 'other').length },
  ].filter(d => d.value > 0);

  const scoreRanges = [
    { range: '0-25%', count: applications.filter(a => (a.examScore ?? 0) <= 25).length },
    { range: '26-50%', count: applications.filter(a => (a.examScore ?? 0) > 25 && (a.examScore ?? 0) <= 50).length },
    { range: '51-75%', count: applications.filter(a => (a.examScore ?? 0) > 50 && (a.examScore ?? 0) <= 75).length },
    { range: '76-100%', count: applications.filter(a => (a.examScore ?? 0) > 75).length },
  ];

  const accepted = applications.filter(a => a.status === 'accepted').length;
  const rejected = applications.filter(a => a.status === 'rejected').length;
  const pending = applications.filter(a => a.status === 'pending').length;
  const statusData = [
    { name: 'Accepted', value: accepted },
    { name: 'Rejected', value: rejected },
    { name: 'Pending', value: pending },
  ].filter(d => d.value > 0);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader><CardTitle>Applicants per Internship</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={applicantsPerInternship}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2FBF71" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader><CardTitle>Gender Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={genderData} cx="50%" cy="50%" outerRadius={100} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader><CardTitle>Score Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scoreRanges}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0F5A2E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader><CardTitle>Acceptance Rate</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" outerRadius={100} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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

import { useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { useInternshipStore } from '@/store/internshipStore';
import { StudentProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { Briefcase, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function StudentDashboard() {
  const user = useAuthStore(s => s.user) as StudentProfile;
  const { getStudentApplications, fetchStudentApplications } = useInternshipStore();
  
  useEffect(() => {
    if (user?.id) {
      fetchStudentApplications();
    }
  }, [user?.id, fetchStudentApplications]);

  const applications = getStudentApplications(user.id);

  const pending = applications.filter(a => a.status === 'pending').length;
  const accepted = applications.filter(a => a.status === 'accepted').length;
  const rejected = applications.filter(a => a.status === 'rejected').length;

  const stats = [
    { label: 'Total Applications', value: applications.length, icon: Briefcase, color: 'text-primary' },
    { label: 'Pending', value: pending, icon: Clock, color: 'text-warning' },
    { label: 'Accepted', value: accepted, icon: CheckCircle, color: 'text-primary' },
    { label: 'Rejected', value: rejected, icon: XCircle, color: 'text-destructive' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.username}!</h1>
          <p className="text-muted-foreground">Here's your application overview</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(stat => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-primary/10 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>My Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No applications yet. Start browsing internships!</p>
            ) : (
              <div className="space-y-3">
                {applications.map(app => (
                  <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                    <div>
                      <p className="font-medium">{app.internshipTitle}</p>
                      <p className="text-sm text-muted-foreground">{app.companyName}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      {app.examScore != null && (
                        <span className="text-muted-foreground">Score: <strong className="text-foreground">{app.examScore}%</strong></span>
                      )}
                      <StatusBadge status={app.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

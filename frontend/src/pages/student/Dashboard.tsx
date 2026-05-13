import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useInternshipStore } from '@/store/internshipStore';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Clock, CheckCircle, XCircle, ArrowRight, User as UserIcon, Sparkles } from 'lucide-react';
import { StudentProfile } from '@/types';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { applications, fetchMyApplications, isLoading } = useInternshipStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyApplications();
  }, [fetchMyApplications]);

  const student = user as StudentProfile | null;

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-destructive" />;
      default: return <Clock className="h-5 w-5 text-warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-success/10 text-success hover:bg-success/20';
      case 'rejected': return 'bg-destructive/10 text-destructive hover:bg-destructive/20';
      default: return 'bg-warning/10 text-warning-foreground hover:bg-warning/20';
    }
  };

  // Derive top personality trait if available
  const topTrait = student?.personalityAssessment?.reduce((prev, current) => 
    (prev.score > current.score) ? prev : current
  , { category: 'Empathy', score: 0 });

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in py-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-primary/5 p-6 sm:p-8 rounded-[2rem] border border-primary/10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {student?.username}</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Ready to make an impact today?
            </p>
            {topTrait && topTrait.score > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-black/20 border border-primary/20 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Your top trait: {topTrait.category}</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Link to="/internships">
              <Button className="gradient-primary text-primary-foreground rounded-full shadow-md">
                Browse Opportunities
              </Button>
            </Link>
            <Link to="/student/profile">
              <Button variant="outline" className="rounded-full">
                <UserIcon className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="card-hover border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
              <Briefcase className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-primary-text">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="card-hover border-success/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Accepted</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{stats.accepted}</div>
            </CardContent>
          </Card>
          <Card className="card-hover border-warning/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning-foreground">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card className="card-hover border-destructive/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <Card className="md:col-span-2 card-premium">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>Recent Applications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground">Loading applications...</div>
              ) : applications.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                  <p className="text-muted-foreground mb-6">You haven't applied to any volunteering opportunities yet.</p>
                  <Button onClick={() => navigate('/internships')} className="gradient-primary rounded-full">
                    Start Exploring
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {applications.slice(0, 5).map(app => (
                    <div key={app._id} className="p-6 hover:bg-accent/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-lg text-foreground mb-1">{app.internshipTitle}</h4>
                        <p className="text-muted-foreground flex items-center gap-2">
                          <span>{app.companyName}</span>
                          <span>•</span>
                          <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {app.skillMatch !== undefined && (
                          <div className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                            {app.skillMatch}% Match
                          </div>
                        )}
                        <Badge variant="secondary" className={`capitalize px-3 py-1 text-sm ${getStatusColor(app.status)}`}>
                          {getStatusIcon(app.status)}
                          <span className="ml-1.5">{app.status}</span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions / Recommended */}
          <div className="space-y-6">
            <Card className="card-premium bg-gradient-to-br from-primary/5 to-accent/20 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> 
                  Recommended for You
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Based on your personality profile and skills, we'll suggest the best opportunities here.
                </p>
                <div className="p-4 bg-white dark:bg-black/40 rounded-xl border border-border shadow-sm">
                  <h4 className="font-medium text-sm mb-2">Coming Soon</h4>
                  <p className="text-xs text-muted-foreground">Our AI matching engine is analyzing your profile.</p>
                </div>
                <Button variant="outline" className="w-full justify-between group" onClick={() => navigate('/internships')}>
                  View all opportunities
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-lg">Saved Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                {student?.savedOpportunities && student.savedOpportunities.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">You have {student.savedOpportunities.length} saved opportunities.</p>
                    <Button variant="secondary" className="w-full" onClick={() => navigate('/saved')}>
                      View Saved List
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No saved opportunities yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}

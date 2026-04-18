import { useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { useInternshipStore } from '@/store/internshipStore';
import type { CompanyProfile } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, MapPin, Monitor, Building2 } from 'lucide-react';

export default function CompanyInternships() {
  const user = useAuthStore(s => s.user) as CompanyProfile;
  const navigate = useNavigate();
  const { internships, applications, fetchInternships, fetchCompanyApplications } = useInternshipStore();
  
  useEffect(() => {
    if (user?.id) {
      fetchInternships();
      fetchCompanyApplications();
    }
  }, [user?.id, fetchInternships, fetchCompanyApplications]);

  const myInternships = internships.filter(i => i.companyId === user.id);

  const modeIcons = { online: Monitor, offline: MapPin, hybrid: Building2 };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Internships</h1>
          <Button onClick={() => navigate('/company/internships/create')} className="gradient-primary text-primary-foreground">
            + New Internship
          </Button>
        </div>

        {myInternships.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No internships yet. Create your first one!</p>
        ) : (
          <div className="space-y-4">
            {myInternships.map(internship => {
              const appCount = applications.filter(a => a.internshipId === internship.id).length;
              const ModeIcon = modeIcons[internship.mode];
              return (
                <Card key={internship.id} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{internship.title}</h3>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{internship.duration}</span>
                        <span className="flex items-center gap-1 capitalize"><ModeIcon className="h-3.5 w-3.5" />{internship.mode}</span>
                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{appCount} applicants</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {internship.requiredSkills.slice(0, 3).map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => navigate(`/company/internships/${internship.id}/applicants`)}>
                      View Applicants
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

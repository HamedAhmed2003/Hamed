import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { useInternshipStore } from '@/store/internshipStore';
import { useAuthStore } from '@/store/authStore';
import { StudentProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { calculateSkillMatch } from '@/lib/helpers';
import { MapPin, Clock, DollarSign, Monitor, Building2, Users, Calendar } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const modeIcons = { online: Monitor, offline: MapPin, hybrid: Building2 };

export default function InternshipDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInternship, applications, applyToInternship } = useInternshipStore();
  const user = useAuthStore(s => s.user);
  const internship = getInternship(id!);


  if (!internship) return <AppLayout><p className="text-center py-12 text-muted-foreground">Internship not found</p></AppLayout>;

  const ModeIcon = modeIcons[internship.mode];
  const studentSkills = user?.role === 'student' ? (user as StudentProfile).skills : [];
  const skillMatch = studentSkills.length > 0 ? calculateSkillMatch(studentSkills, internship.requiredSkills) : null;
  const alreadyApplied = user ? applications.some(a => a.internshipId === internship.id && a.studentId === user.id) : false;

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }

    const applyDirectly = async () => {
      try {
        const { applicationService } = await import('@/services/api');
        const { data } = await applicationService.apply(internship.id, {});
        applyToInternship(data);
        toast.success('Successfully applied to internship!');
        navigate('/student/dashboard');
      } catch (err: any) {
        toast.error(err.message || 'Failed to apply');
      }
    };

    if (internship.exam && internship?.id) {
      if (internship.exam.questions && internship.exam.questions.length > 0) {
        navigate(`/exam/${internship.id}`);
      } else {
        toast.error("Exam not found, applying directly...");
        await applyDirectly();
      }
    }
    else {
      await applyDirectly();
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{internship.title}</h1>
            <p className="text-lg text-muted-foreground">{internship.companyName}</p>
          </div>
          {skillMatch !== null && (
            <div className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${skillMatch >= 75 ? 'gradient-primary text-primary-foreground' :
              skillMatch >= 50 ? 'bg-warning/10 text-warning' :
                'bg-muted text-muted-foreground'
              }`}>
              {skillMatch}% Skill Match
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Clock, label: 'Duration', value: internship.duration },
            { icon: ModeIcon, label: 'Mode', value: internship.mode },
            { icon: Users, label: 'Seats', value: `${internship.seatsAvailable} available` },
            { icon: Calendar, label: 'Deadline', value: internship.applicationDeadline },
          ].map(item => (
            <Card key={item.label} className="border-border/50">
              <CardContent className="p-3 flex items-center gap-2">
                <item.icon className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium capitalize">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {internship.isPaid && internship.salaryMin != null && (
          <Card className="border-border/50 bg-primary/5">
            <CardContent className="p-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="font-semibold text-lg text-primary">${internship.salaryMin} – ${internship.salaryMax}</span>
              <span className="text-muted-foreground text-sm">/ month</span>
            </CardContent>
          </Card>
        )}

        <Card className="border-border/50">
          <CardHeader><CardTitle>Description</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground leading-relaxed">{internship.description}</p></CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader><CardTitle>Required Skills</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {internship.requiredSkills.map(skill => {
                const matched = studentSkills.some(s => s.toLowerCase() === skill.toLowerCase());
                return (
                  <Badge key={skill} variant={matched ? 'default' : 'secondary'}
                    className={matched ? 'gradient-primary text-primary-foreground' : ''}>
                    {skill} {matched && '✓'}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {internship.exam && (
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{internship.exam.questions.length > 0 ? "This internship requires an exam" : "This internship does not require an exam"}</p>
                <p className="text-sm text-muted-foreground">{internship.exam.questions.length} questions • {internship.exam.duration} minutes</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          onClick={handleApply}
          disabled={alreadyApplied}
          className="w-full gradient-primary text-primary-foreground h-12 text-lg"
        >
          {alreadyApplied ? 'Already Applied' : internship.exam ? 'Apply & Take Exam' : 'Apply Now'}
        </Button>
      </div>
    </AppLayout>
  );
}

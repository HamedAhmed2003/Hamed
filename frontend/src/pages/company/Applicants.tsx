import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { useInternshipStore } from '@/store/internshipStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, FileText, Mail, Phone } from 'lucide-react';

export default function ApplicantsView() {
  const { internshipId } = useParams<{ internshipId: string }>();
  const { getInternship, getInternshipApplications, updateApplicationStatus } = useInternshipStore();
  const internship = getInternship(internshipId!);
  const applications = getInternshipApplications(internshipId!);

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('score-high');
  const [genderFilter, setGenderFilter] = useState('all');

  const filtered = applications
    .filter(a => {
      if (search && !a.studentName.toLowerCase().includes(search.toLowerCase())) return false;
      if (genderFilter !== 'all' && a.studentGender !== genderFilter) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score-high': return (b.examScore ?? 0) - (a.examScore ?? 0);
        case 'score-low': return (a.examScore ?? 0) - (b.examScore ?? 0);
        case 'fastest': return (a.examTimeTaken ?? 0) - (b.examTimeTaken ?? 0);
        case 'skill-match': return (b.skillMatch ?? 0) - (a.skillMatch ?? 0);
        default: return 0;
      }
    });

  if (!internship) return <AppLayout><p className="text-center py-12 text-muted-foreground">Internship not found</p></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Applicants — {internship.title}</h1>
          <p className="text-muted-foreground">{filtered.length} applicants</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="score-high">Highest Score</SelectItem>
              <SelectItem value="score-low">Lowest Score</SelectItem>
              <SelectItem value="fastest">Fastest</SelectItem>
              <SelectItem value="skill-match">Skill Match</SelectItem>
            </SelectContent>
          </Select>
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filtered.map(app => (
            <Card key={app.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{app.studentName}</h3>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{app.studentEmail}</span>
                      {app.studentPhone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{app.studentPhone}</span>}
                      {app.cvUrl && <span className="flex items-center gap-1 text-primary"><FileText className="h-3.5 w-3.5" />CV</span>}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {app.skills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                    </div>
                    <div className="flex gap-4 text-sm">
                      {app.examScore != null && <span>Score: <strong className="text-primary">{app.examScore}%</strong></span>}
                      {app.examTimeTaken != null && <span>Time: <strong>{Math.round(app.examTimeTaken / 60)}m {app.examTimeTaken % 60}s</strong></span>}
                      {app.skillMatch != null && <span>Match: <strong>{app.skillMatch}%</strong></span>}
                    </div>
                  </div>
                  {app.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" className="gradient-primary text-primary-foreground"
                        onClick={() => { updateApplicationStatus(app.id, 'accepted'); toast.success('Applicant accepted!'); }}>
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive border-destructive/30"
                        onClick={() => { updateApplicationStatus(app.id, 'rejected'); toast.success('Applicant rejected'); }}>
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

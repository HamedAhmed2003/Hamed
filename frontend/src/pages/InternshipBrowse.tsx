import { useState, useMemo, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useInternshipStore } from '@/store/internshipStore';
import { useAuthStore } from '@/store/authStore';
import { InternshipCard } from '@/components/InternshipCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StudentProfile } from '@/types';
import { calculateSkillMatch } from '@/lib/helpers';
import { Search } from 'lucide-react';

export default function InternshipBrowse() {
  const { internships, fetchInternships } = useInternshipStore();
  const user = useAuthStore(s => s.user);
  
  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<string>('all');
  const [paid, setPaid] = useState<string>('all');
  const [duration, setDuration] = useState<string>('all');

  const filtered = useMemo(() => {
    return internships.filter(i => {
      if (search && !i.title.toLowerCase().includes(search.toLowerCase()) &&
          !i.companyName.toLowerCase().includes(search.toLowerCase())) return false;
      if (mode !== 'all' && i.mode !== mode) return false;
      if (paid === 'paid' && !i.isPaid) return false;
      if (paid === 'unpaid' && i.isPaid) return false;
      if (duration !== 'all' && !i.duration.includes(duration)) return false;
      return true;
    });
  }, [internships, search, mode, paid, duration]);

  const studentSkills = user?.role === 'student' ? (user as StudentProfile).skills : [];

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Browse Internships</h1>
          <p className="text-muted-foreground">{filtered.length} internships available</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by title or company..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Mode" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paid} onValueChange={setPaid}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Pay" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Duration" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="3">3 months</SelectItem>
              <SelectItem value="4">4 months</SelectItem>
              <SelectItem value="5">5 months</SelectItem>
              <SelectItem value="6">6 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(internship => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              skillMatch={studentSkills.length > 0 ? calculateSkillMatch(studentSkills, internship.requiredSkills) : undefined}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No internships match your filters.</p>
        )}
      </div>
    </AppLayout>
  );
}

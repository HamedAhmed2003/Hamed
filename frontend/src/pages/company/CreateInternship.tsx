import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { useInternshipStore } from '@/store/internshipStore';
import type { CompanyProfile } from '@/types';
import { Internship, ExamQuestion } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, X, Trash2 } from 'lucide-react';

export default function CreateInternship() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user) as CompanyProfile;
  const { addInternship } = useInternshipStore();

  const [form, setForm] = useState({
    title: '', description: '', duration: '3 months', isPaid: true,
    salaryMin: '', salaryMax: '', mode: 'online' as 'online' | 'offline' | 'hybrid',
    city: '', seatsAvailable: '', applicationDeadline: '',
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [questions, setQuestions] = useState<Partial<ExamQuestion>[]>([]);
  const [examDuration, setExamDuration] = useState('15');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: `nq-${Date.now()}`, question: '', choices: ['', '', '', ''], correctAnswer: 0, weight: 10 }]);
  };

  const updateQuestion = (idx: number, field: string, value: unknown) => {
    setQuestions(questions.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const updateChoice = (qIdx: number, cIdx: number, value: string) => {
    setQuestions(questions.map((q, i) => {
      if (i !== qIdx) return q;
      const choices = [...(q.choices || [])];
      choices[cIdx] = value;
      return { ...q, choices };
    }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || skills.length === 0) {
      toast.error('Please fill in required fields');
      return;
    }
    const internshipPayload = {
      title: form.title,
      description: form.description,
      requiredSkills: skills,
      duration: form.duration,
      isPaid: form.isPaid,
      salaryMin: form.isPaid ? Number(form.salaryMin) : undefined,
      salaryMax: form.isPaid ? Number(form.salaryMax) : undefined,
      mode: form.mode,
      city: form.mode !== 'online' ? form.city : undefined,
      seatsAvailable: Number(form.seatsAvailable) || 5,
      applicationDeadline: form.applicationDeadline,
      exam: questions.length > 0 ? {
        questions: questions.map(({ id, ...rest }) => rest),
        duration: Number(examDuration),
      } : undefined,
    };
    const result = await addInternship(internshipPayload as unknown as Record<string, unknown>);
    if (result) {
      toast.success('Internship created!');
      navigate('/company/internships');
    } else {
      toast.error('Failed to create internship');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl animate-fade-in">
        <h1 className="text-2xl font-bold">Create Internship</h1>

        <Card className="border-border/50">
          <CardHeader><CardTitle>Internship Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Frontend Developer Intern" />
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select value={form.duration} onValueChange={v => setForm({ ...form, duration: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['1 month', '2 months', '3 months', '4 months', '5 months', '6 months'].map(d =>
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mode</Label>
                <Select value={form.mode} onValueChange={v => setForm({ ...form, mode: v as 'online' | 'offline' | 'hybrid' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {form.mode !== 'online' && (
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
              </div>
            )}
            <div className="flex items-center gap-3">
              <Switch checked={form.isPaid} onCheckedChange={v => setForm({ ...form, isPaid: v })} />
              <Label>Paid Internship</Label>
            </div>
            {form.isPaid && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Salary ($)</Label>
                  <Input type="number" value={form.salaryMin} onChange={e => setForm({ ...form, salaryMin: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Max Salary ($)</Label>
                  <Input type="number" value={form.salaryMax} onChange={e => setForm({ ...form, salaryMax: e.target.value })} />
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Seats Available</Label>
                <Input type="number" value={form.seatsAvailable} onChange={e => setForm({ ...form, seatsAvailable: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input type="date" value={form.applicationDeadline} onChange={e => setForm({ ...form, applicationDeadline: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader><CardTitle>Required Skills *</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add skill"
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
              <Button variant="outline" size="icon" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <Badge key={s} variant="secondary" className="gap-1 pr-1">
                  {s}
                  <button onClick={() => setSkills(skills.filter(sk => sk !== s))} className="ml-1 rounded-full hover:bg-destructive/20 p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Exam (Optional)</CardTitle>
            <Button variant="outline" size="sm" onClick={addQuestion} className="gap-1"><Plus className="h-4 w-4" /> Add Question</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.length > 0 && (
              <div className="space-y-2">
                <Label>Exam Duration (minutes)</Label>
                <Input type="number" value={examDuration} onChange={e => setExamDuration(e.target.value)} className="w-32" />
              </div>
            )}
            {questions.map((q, qIdx) => (
              <div key={q.id} className="p-4 rounded-lg border border-border/50 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">Question {qIdx + 1}</p>
                  <Button variant="ghost" size="icon" onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <Input value={q.question} onChange={e => updateQuestion(qIdx, 'question', e.target.value)} placeholder="Question text" />
                {q.choices?.map((c, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2">
                    <input type="radio" name={`correct-${qIdx}`} checked={q.correctAnswer === cIdx}
                      onChange={() => updateQuestion(qIdx, 'correctAnswer', cIdx)} className="accent-primary" />
                    <Input value={c} onChange={e => updateChoice(qIdx, cIdx, e.target.value)} placeholder={`Choice ${cIdx + 1}`} />
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>

        <Button onClick={handleSubmit} className="w-full gradient-primary text-primary-foreground h-12 text-lg">
          Create Internship
        </Button>
      </div>
    </AppLayout>
  );
}

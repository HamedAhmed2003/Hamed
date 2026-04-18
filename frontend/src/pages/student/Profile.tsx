import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useAuthStore } from '@/store/authStore';
import type { StudentProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload, X, Plus, Sparkles } from 'lucide-react';
import { aiService } from '@/services/api';

export default function StudentProfile() {
  const { user, updateProfile, updateSkills } = useAuthStore();
  const student = user as StudentProfile;
  const [newSkill, setNewSkill] = useState('');
  const [extracting, setExtracting] = useState(false);
  
  const [formData, setFormData] = useState({
    username: student.username || '',
    phone: student.phone || '',
    gender: student.gender || 'other'
  });

  const handleAddSkill = () => {
    if (newSkill.trim() && !student.skills.includes(newSkill.trim())) {
      const updatedSkills = [...student.skills, newSkill.trim()];
      updateSkills(updatedSkills);
      updateProfile({ skills: updatedSkills });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const updatedSkills = student.skills.filter(s => s !== skill);
    updateSkills(updatedSkills);
    updateProfile({ skills: updatedSkills });
  };

  const handleExtractSkills = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtracting(true);
    try {
      const res = await aiService.extractSkills(file);
      const { extractedSkills = [], cvUrl } = res.data || {};
      const newSkills = [...new Set([...student.skills, ...extractedSkills])];
      
      updateSkills(newSkills);
      await updateProfile({ skills: newSkills, extractedSkills, cvUrl } as Partial<StudentProfile>);
      
      toast.success('CV uploaded and skills extracted!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to extract skills');
    } finally {
      setExtracting(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleSaveProfile = async () => {
    await updateProfile(formData);
    toast.success('Profile updated!');
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl animate-fade-in">
        <h1 className="text-2xl font-bold">My Profile</h1>

        <Card className="border-border/50">
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={student.email} disabled />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+201234567890" />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={formData.gender} onValueChange={v => setFormData({ ...formData, gender: v as 'male' | 'female' | 'other' })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="gradient-primary text-primary-foreground" onClick={handleSaveProfile}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader><CardTitle>CV & AI Skill Extraction</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Upload your CV (PDF/DOC)</p>
              <Input type="file" accept=".pdf,.doc,.docx" className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto" onChange={handleExtractSkills} disabled={extracting} />
              {student.cvUrl && (
                <p className="mt-2 text-xs text-primary font-medium">✅ CV Uploaded: <a href={`http://localhost:8000${student.cvUrl}`} target="_blank" rel="noreferrer" className="underline hover:text-primary/80">View CV</a></p>
              )}
            </div>
            {extracting && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <Sparkles className="h-4 w-4 animate-spin" /> Extracting skills with AI...
              </div>
            )}
            {student.extractedSkills && student.extractedSkills.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Extracted Skills:</p>
                <div className="flex flex-wrap gap-1.5">
                  {student.extractedSkills.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add a skill"
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())} />
              <Button size="icon" onClick={handleAddSkill} variant="outline"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {student.skills.map(skill => (
                <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                  {skill}
                  <button onClick={() => handleRemoveSkill(skill)} className="ml-1 rounded-full hover:bg-destructive/20 p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

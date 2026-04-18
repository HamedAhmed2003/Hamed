import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useAuthStore } from '@/store/authStore';
import type { CompanyProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

export default function CompanyProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const company = user as CompanyProfile;

  const [formData, setFormData] = useState({
    companyName: company.companyName || '',
    industry: company.industry || '',
    phone: company.phone || '',
    taxRegister: company.taxRegister || '',
    description: company.description || ''
  });

  const handleSaveProfile = async () => {
    await updateProfile(formData);
    toast.success('Profile updated!');
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl animate-fade-in">
        <h1 className="text-2xl font-bold">Company Profile</h1>
        <Card className="border-border/50">
          <CardHeader><CardTitle>Company Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {/* <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Upload Company Logo</p>
              <Input type="file" accept="image/*" className="mt-2 max-w-xs mx-auto" />
            </div> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Tax Register</Label>
                <Input value={formData.taxRegister} onChange={e => setFormData({ ...formData, taxRegister: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4} />
            </div>
            <Button className="gradient-primary text-primary-foreground" onClick={handleSaveProfile}>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

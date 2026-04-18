import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import type { CompanyProfile, StudentProfile } from '@/types';
import { adminService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Users, Building2, ShieldCheck, Search, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<StudentProfile | CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.getStudents(),
      adminService.getCompanies()
    ]).then(([stRes, coRes]) => {
      setStudents(stRes.data);
      setCompanies(coRes.data);
    }).catch(() => {
      toast.error('Failed to load dashboard data');
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const filteredStudents = students.filter(s =>
    (s.username && s.username.toLowerCase().includes(search.toLowerCase())) || 
    (s.email && s.email.toLowerCase().includes(search.toLowerCase()))
  );
  
  const filteredCompanies = companies.filter(c =>
    (c.companyName && c.companyName.toLowerCase().includes(search.toLowerCase())) || 
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const getId = (user: any) => user._id || user.id;

  const approveCompany = async (id: string) => {
    try {
      await adminService.approveCompany(id);
      setCompanies(companies.map(c => getId(c) === id ? { ...c, isApproved: true } : c));
      toast.success('Company approved!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve');
    }
  };

  const rejectCompany = async (id: string) => {
    try {
      await adminService.rejectCompany(id);
      setCompanies(companies.map(c => getId(c) === id ? { ...c, isApproved: false } : c));
      toast.success('Company revoked');
    } catch (err: any) {
      toast.error(err.message || 'Failed to revoke');
    }
  };

  const deleteStudent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student permanently?')) return;
    try {
      await adminService.deleteUser(id);
      setStudents(students.filter(s => getId(s) !== id));
      toast.success('Student deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete student');
    }
  };

  const deleteCompany = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company permanently?')) return;
    try {
      await adminService.deleteUser(id);
      setCompanies(companies.filter(c => getId(c) !== id));
      toast.success('Company deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete company');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-20 text-muted-foreground">
          Loading system data...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Students', value: students.length, icon: Users },
            { label: 'Companies', value: companies.length, icon: Building2 },
            { label: 'Pending Approval', value: companies.filter(c => !c.isApproved).length, icon: ShieldCheck },
          ].map(s => (
            <Card key={s.label} className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary"><s.icon className="h-5 w-5" /></div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>

        <Tabs defaultValue="students">
          <TabsList>
            <TabsTrigger value="students">Students ({filteredStudents.length})</TabsTrigger>
            <TabsTrigger value="companies">Companies ({filteredCompanies.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-3 mt-4">
            {filteredStudents.length === 0 && <p className="text-muted-foreground text-sm">No students found.</p>}
            {filteredStudents.map(student => (
              <Card key={getId(student)} className="border-border/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="cursor-pointer" onClick={() => setSelectedUser(student)}>
                    <p className="font-medium">{student.username || 'No Name'}</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                    <div className="flex gap-1 mt-1">
                      {student.skills?.slice(0, 3).map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteStudent(getId(student))} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="companies" className="space-y-3 mt-4">
            {filteredCompanies.length === 0 && <p className="text-muted-foreground text-sm">No companies found.</p>}
            {filteredCompanies.map(company => (
              <Card key={getId(company)} className="border-border/50">
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="cursor-pointer" onClick={() => setSelectedUser(company)}>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{company.companyName}</p>
                      <StatusBadge status={company.isApproved ? 'approved' : 'pending'} />
                    </div>
                    <p className="text-sm text-muted-foreground">{company.email}</p>
                    {company.industry && <p className="text-xs text-muted-foreground">{company.industry}</p>}
                  </div>
                  <div className="flex gap-2">
                    {!company.isApproved && (
                      <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => approveCompany(getId(company))}>
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    )}
                    {company.isApproved && (
                      <Button size="sm" variant="outline" onClick={() => rejectCompany(getId(company))}>
                        <XCircle className="h-4 w-4 mr-1" /> Revoke
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => deleteCompany(getId(company))} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Email:</span><p className="font-medium">{selectedUser.email}</p></div>
                  <div><span className="text-muted-foreground">Role:</span><p className="font-medium capitalize">{selectedUser.role}</p></div>
                  {'phone' in selectedUser && selectedUser.phone && (
                    <div><span className="text-muted-foreground">Phone:</span><p className="font-medium">{selectedUser.phone}</p></div>
                  )}
                  {'gender' in selectedUser && selectedUser.gender && (
                    <div><span className="text-muted-foreground">Gender:</span><p className="font-medium capitalize">{selectedUser.gender}</p></div>
                  )}
                  {'taxRegister' in selectedUser && selectedUser.taxRegister && (
                    <div><span className="text-muted-foreground">Tax Register:</span><p className="font-medium">{selectedUser.taxRegister}</p></div>
                  )}
                  {'industry' in selectedUser && selectedUser.industry && (
                    <div><span className="text-muted-foreground">Industry:</span><p className="font-medium">{selectedUser.industry}</p></div>
                  )}
                </div>
                {'skills' in selectedUser && selectedUser.skills?.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Skills:</p>
                    <div className="flex flex-wrap gap-1">{selectedUser.skills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}</div>
                  </div>
                )}
                {'description' in selectedUser && selectedUser.description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description:</p>
                    <p className="text-sm">{selectedUser.description}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

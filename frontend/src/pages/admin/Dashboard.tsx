import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import { adminService } from '@/services/api';
import { toast } from 'sonner';
import { getImageUrl } from '@/utils/imageUrl';
import {
  Users, Building2, Briefcase, FileText, CheckCircle, XCircle,
  Clock, ShieldCheck, AlertTriangle, Search, Trash2, UserX,
  BarChart3, RefreshCw, Eye, ChevronRight
} from 'lucide-react';
import { AppUser, Opportunity } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useLocation } from 'react-router-dom';

interface AdminStats {
  totalVolunteers: number;
  totalOrganizations: number;
  pendingOrganizations: number;
  pendingOpportunities: number;
  totalApplications: number;
  totalOpportunities: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalVolunteers: 0, totalOrganizations: 0, pendingOrganizations: 0,
    pendingOpportunities: 0, totalApplications: 0, totalOpportunities: 0,
  });
  const [pendingCompanies, setPendingCompanies] = useState<AppUser[]>([]);
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [allOrgs, setAllOrgs] = useState<AppUser[]>([]);
  const [pendingOpps, setPendingOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [orgSearch, setOrgSearch] = useState('');
  const location = useLocation();
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => { fetchAll(); }, [location.key]);

  const fetchAll = async () => {
    if (stats.totalVolunteers === 0) setLoading(true);
    try {
      const [statsRes, pendingOrgRes, oppsRes, usersRes, orgsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getPendingCompanies(),
        adminService.getPendingOpportunities(),
        adminService.getStudents(),
        adminService.getCompanies(),
      ]);
      setStats(statsRes.data);
      setPendingCompanies(pendingOrgRes.data);
      setPendingOpps(oppsRes.data);
      setAllUsers(usersRes.data);
      setAllOrgs(orgsRes.data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleOrgAction = async (id: string, action: 'approve' | 'reject') => {
    setActionLoading(id + action);
    try {
      await adminService.moderateCompany(id, action);
      toast.success(`Organization ${action}d successfully`);
      await fetchAll();
    } catch (err: any) {
      toast.error(err.message || `Failed to ${action}`);
    } finally { setActionLoading(null); }
  };

  const handleOppAction = async (id: string, action: 'approve' | 'reject') => {
    setActionLoading(id + action);
    try {
      await adminService.moderateOpportunity(id, action);
      toast.success(`Opportunity ${action}d`);
      await fetchAll();
    } catch (err: any) {
      toast.error(err.message || `Failed to ${action}`);
    } finally { setActionLoading(null); }
  };

  const handleSuspend = async (id: string) => {
    setActionLoading(id + 'suspend');
    try {
      await adminService.suspendUser(id);
      toast.success('User suspended');
      await fetchAll();
    } catch (err: any) {
      toast.error(err.message || 'Failed to suspend');
    } finally { setActionLoading(null); }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id + 'delete');
    setConfirmDelete(null);
    try {
      await adminService.deleteUser(id);
      toast.success('User deleted');
      await fetchAll();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    } finally { setActionLoading(null); }
  };

  const filteredUsers = allUsers.filter(u =>
    ((u as any).username || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredOrgs = allOrgs.filter(o =>
    ((o as any).companyName || '').toLowerCase().includes(orgSearch.toLowerCase()) ||
    (o.email || '').toLowerCase().includes(orgSearch.toLowerCase())
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in py-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 p-6 rounded-[2rem] border border-primary/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Admin Control Center</h1>
              <p className="text-muted-foreground mt-1 text-sm">Platform oversight, moderation & user management.</p>
            </div>
          </div>
          <Button variant="outline" onClick={fetchAll} className="rounded-full gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Volunteers', value: stats.totalVolunteers, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/40' },
            { label: 'Organizations', value: stats.totalOrganizations, icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/40' },
            { label: 'Live Opportunities', value: stats.totalOpportunities, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
            { label: 'Total Applications', value: stats.totalApplications, icon: FileText, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40' },
          ].map(s => (
            <Card key={s.label} className="card-premium overflow-hidden">
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pending Alert */}
        {(stats.pendingOpportunities > 0 || stats.pendingOrganizations > 0) && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              {stats.pendingOrganizations > 0 && `${stats.pendingOrganizations} org(s)`}
              {stats.pendingOrganizations > 0 && stats.pendingOpportunities > 0 && ' and '}
              {stats.pendingOpportunities > 0 && `${stats.pendingOpportunities} opportunity(ies)`}
              {' '}pending review.
            </p>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="pending-opps">
          <TabsList className="flex flex-wrap gap-1 h-auto bg-muted p-1 rounded-2xl mb-6">
            {[
              { value: 'pending-opps', label: 'Pending Opportunities', badge: stats.pendingOpportunities },
              { value: 'pending-orgs', label: 'Pending Orgs', badge: stats.pendingOrganizations },
              { value: 'users', label: 'All Volunteers' },
              { value: 'orgs', label: 'All Organizations' },
            ].map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="rounded-xl text-sm gap-2 flex-1 sm:flex-none">
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-destructive text-white text-[10px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Pending Opportunities */}
          <TabsContent value="pending-opps">
            <Card className="card-premium">
              <CardHeader className="flex flex-row items-center gap-3 pb-4 border-b border-border/50">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-amber-600" />
                </div>
                <CardTitle>Pending Opportunities ({stats.pendingOpportunities})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {pendingOpps.length === 0 ? (
                  <div className="p-16 text-center">
                    <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-3" />
                    <p className="font-semibold">All caught up! No pending opportunities.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/40">
                    {pendingOpps.map(opp => (
                      <div key={opp._id || opp.id} className="p-5 hover:bg-violet-50/30 transition-colors">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-grow space-y-1.5">
                            <h4 className="font-bold text-base">{opp.title}</h4>
                            <p className="text-sm font-semibold text-primary">{opp.companyName}</p>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{opp.category || 'Frontend Development'}</span>
                              <span className="text-muted-foreground">{opp.duration} • {opp.mode}</span>
                              <span className="text-muted-foreground">{opp.isPaid ? '💰 Stipend' : '🤝 Volunteer'}</span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{opp.description}</p>
                          </div>
                          <div className="flex gap-2 shrink-0 items-start">
                            <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 rounded-full"
                              disabled={actionLoading === (opp._id || opp.id) + 'reject'}
                              onClick={() => handleOppAction(opp._id || opp.id!, 'reject')}>
                              <XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject
                            </Button>
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                              disabled={actionLoading === (opp._id || opp.id) + 'approve'}
                              onClick={() => handleOppAction(opp._id || opp.id!, 'approve')}>
                              <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                              {actionLoading === (opp._id || opp.id) + 'approve' ? 'Approving...' : 'Approve'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Organizations */}
          <TabsContent value="pending-orgs">
            <Card className="card-premium">
              <CardHeader className="flex flex-row items-center gap-3 pb-4 border-b border-border/50">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-amber-600" />
                </div>
                <CardTitle>Pending Organizations ({stats.pendingOrganizations})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {pendingCompanies.length === 0 ? (
                  <div className="p-16 text-center">
                    <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-3" />
                    <p className="font-semibold">No organizations pending review.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/40">
                    {pendingCompanies.map(company => (
                      <div key={company._id || company.id} className="p-5 hover:bg-violet-50/30 transition-colors">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border border-primary/20">
                              {(company as any).logo ? (
                                <img src={getImageUrl((company as any).logo)} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Building2 className="h-6 w-6 text-primary" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-bold">{(company as any).companyName || 'Unnamed Org'}</h4>
                              <p className="text-sm text-muted-foreground">{company.email}</p>
                              <p className="text-sm text-muted-foreground line-clamp-2">{(company as any).description || 'No description.'}</p>
                              {(company as any).createdAt && (
                                <p className="text-xs text-muted-foreground/60 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Registered {formatDistanceToNow(new Date((company as any).createdAt), { addSuffix: true })}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0 items-start">
                            <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 rounded-full"
                              disabled={actionLoading === (company._id || company.id) + 'reject'}
                              onClick={() => handleOrgAction(company._id || company.id, 'reject')}>
                              <XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject
                            </Button>
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                              disabled={actionLoading === (company._id || company.id) + 'approve'}
                              onClick={() => handleOrgAction(company._id || company.id, 'approve')}>
                              <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                              {actionLoading === (company._id || company.id) + 'approve' ? 'Approving...' : 'Approve'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Volunteers */}
          <TabsContent value="users">
            <Card className="card-premium">
              <CardHeader className="flex flex-row items-center gap-3 pb-4 border-b border-border/50">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center">
                  <Users className="h-5 w-5 text-violet-600" />
                </div>
                <CardTitle>All Volunteers ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  {filteredUsers.map(u => (
                    <div key={u._id || u.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/40 transition-colors group">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {((u as any).username || u.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="font-semibold text-sm truncate">{(u as any).username || 'No username'}</p>
                        <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={u.isVerified ? 'default' : 'secondary'} className={`text-xs ${u.isVerified ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600'}`}>
                          {u.isVerified ? 'Verified' : 'Unverified'}
                        </Badge>
                        {(u as any).hasCompletedOnboarding && (
                          <Badge variant="outline" className="text-xs bg-violet-50 text-violet-700 border-violet-200">Onboarded</Badge>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-amber-600" title="Suspend"
                          onClick={() => handleSuspend(u._id || u.id)}>
                          <UserX className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" title="Delete"
                          onClick={() => setConfirmDelete({ id: u._id || u.id, name: (u as any).username || u.email })}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Organizations */}
          <TabsContent value="orgs">
            <Card className="card-premium">
              <CardHeader className="flex flex-row items-center gap-3 pb-4 border-b border-border/50">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle>All Organizations ({filteredOrgs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={orgSearch}
                    onChange={e => setOrgSearch(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  {filteredOrgs.map(o => (
                    <div key={o._id || o.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/40 transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border border-primary/20">
                        {(o as any).logo ? (
                          <img src={getImageUrl((o as any).logo)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="font-semibold text-sm truncate">{(o as any).companyName || 'Unnamed'}</p>
                        <p className="text-xs text-muted-foreground truncate">{o.email}</p>
                      </div>
                      <Badge variant={(o as any).isApproved ? 'default' : 'secondary'} className={`text-xs ${(o as any).isApproved ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                        {(o as any).isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!(o as any).isApproved && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-emerald-600" title="Approve"
                            onClick={() => handleOrgAction(o._id || o.id, 'approve')}>
                            <CheckCircle className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" title="Delete"
                          onClick={() => setConfirmDelete({ id: o._id || o.id, name: (o as any).companyName || o.email })}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!confirmDelete} onOpenChange={open => !open && setConfirmDelete(null)}>
          <DialogContent className="max-w-sm rounded-2xl">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to permanently delete <strong>{confirmDelete?.name}</strong>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => confirmDelete && handleDelete(confirmDelete.id)}>
                Delete Permanently
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

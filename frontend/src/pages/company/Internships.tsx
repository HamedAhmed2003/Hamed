import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { opportunityService, applicationService } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import {
  Plus, Briefcase, Users, Clock, MapPin, CalendarDays,
  CheckCircle2, AlertCircle, Trash2, Eye, PenLine
} from 'lucide-react';
import { Opportunity } from '@/types';

interface OppWithCount extends Opportunity {
  applicantCount?: number;
}

export default function CompanyInternships() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [opportunities, setOpportunities] = useState<OppWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<OppWithCount | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Reload on mount and on every navigation to this page
  useEffect(() => {
    loadOpportunities();
  }, [location.key]);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      // getMyOpportunities uses /internships/mine — returns ALL statuses for this company
      const { data: opps } = await opportunityService.getMyOpportunities();

      // Fetch applicant counts in parallel for each opportunity
      const withCounts: OppWithCount[] = await Promise.all(
        opps.map(async (opp: Opportunity) => {
          try {
            const id = (opp._id ?? opp.id)!;
            const { data: apps } = await applicationService.getForInternship(id);
            return { ...opp, applicantCount: Array.isArray(apps) ? apps.length : 0 };
          } catch {
            return { ...opp, applicantCount: 0 };
          }
        })
      );

      setOpportunities(withCounts);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const id = (deleteTarget._id || deleteTarget.id)!;
      await opportunityService.delete(id);
      toast.success('Opportunity deleted successfully');
      setDeleteTarget(null);
      // Re-fetch from API to ensure dashboard is in sync with DB
      await loadOpportunities();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8 py-6 animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">My Opportunities</h1>
            <p className="text-muted-foreground mt-1">Manage your posted volunteering opportunities</p>
          </div>
          <Link to="/company/internships/create">
            <Button className="gradient-primary text-white rounded-full h-10 px-5 shadow-md shadow-primary/20 gap-2">
              <Plus className="h-4 w-4" />
              Post New Opportunity
            </Button>
          </Link>
        </div>

        {/* Empty state */}
        {opportunities.length === 0 ? (
          <div className="text-center py-24 card-premium rounded-3xl">
            <div className="w-20 h-20 rounded-full bg-violet-50 flex items-center justify-center mx-auto mb-5">
              <Briefcase className="h-10 w-10 text-violet-200" />
            </div>
            <h2 className="text-xl font-bold mb-2">No opportunities posted yet</h2>
            <p className="text-muted-foreground mb-6">Create your first volunteering opportunity to start finding passionate volunteers.</p>
            <Link to="/company/internships/create">
              <Button className="gradient-primary text-white rounded-full h-11 px-8">
                <Plus className="mr-2 h-4 w-4" /> Post Your First Opportunity
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {opportunities.map(opp => {
              const id = opp._id || opp.id!;
              const isApproved = opp.status === 'approved';
              const isRejected = opp.status === 'rejected';
              const deadline = new Date(opp.applicationDeadline);
              const isExpired = deadline < new Date();

              return (
                <div key={id} className="card-premium p-5 hover:shadow-lg hover:shadow-violet-100/30 transition-all duration-300 group">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">

                    {/* Status Strip */}
                    <div className={`w-1 self-stretch rounded-full shrink-0 ${isApproved ? 'bg-emerald-400' : isRejected ? 'bg-red-400' : 'bg-amber-400'}`} />

                    {/* Info */}
                    <div className="flex-grow space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-base">{opp.title}</h3>
                        <Badge
                          variant="outline"
                          className={isApproved
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-xs'
                            : isRejected
                              ? 'bg-red-50 text-red-700 border-red-200 text-xs'
                              : 'bg-amber-50 text-amber-700 border-amber-200 text-xs'}
                        >
                          {isApproved ? <><CheckCircle2 className="h-3 w-3 mr-1" />Live</> : isRejected ? <><AlertCircle className="h-3 w-3 mr-1" />Rejected</> : <><AlertCircle className="h-3 w-3 mr-1" />Pending Approval</>}
                        </Badge>
                        {opp.category && (
                          <Badge variant="secondary" className="text-xs bg-violet-50 text-violet-700 border-violet-200">
                            {opp.category}
                          </Badge>
                        )}
                        {(opp as any).roleTitle && (
                          <Badge variant="outline" className="text-xs">
                            {(opp as any).roleTitle}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />{opp.duration}
                        </span>
                        <span className="flex items-center gap-1.5 capitalize">
                          <MapPin className="h-3.5 w-3.5" />{opp.mode}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span className={isExpired ? 'text-red-500' : ''}>
                            {isExpired ? 'Expired' : `Closes ${deadline.toLocaleDateString()}`}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Applicant count */}
                    <div className="flex items-center gap-2 shrink-0 bg-violet-50 dark:bg-violet-950/30 px-4 py-2 rounded-2xl border border-violet-100">
                      <Users className="h-4 w-4 text-violet-500" />
                      <div className="text-center">
                        <div className="text-lg font-extrabold text-violet-700">{opp.applicantCount ?? 0}</div>
                        <div className="text-xs text-muted-foreground">Applicant{opp.applicantCount !== 1 ? 's' : ''}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isApproved && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full gap-1.5 text-violet-700 border-violet-200 hover:bg-violet-50"
                          onClick={() => navigate(`/company/internships/${id}/applicants`)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Applicants
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-full"
                        onClick={() => setDeleteTarget(opp)}
                        title="Delete opportunity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation */}
        <Dialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
          <DialogContent className="max-w-sm rounded-2xl">
            <DialogHeader>
              <DialogTitle>Delete Opportunity</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>"{deleteTarget?.title}"</strong>? All applicant data will also be lost.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

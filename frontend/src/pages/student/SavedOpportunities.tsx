import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { OpportunityCard } from '@/components/OpportunityCard';
import { useAuthStore } from '@/store/authStore';
import { onboardingService } from '@/services/api';
import { Opportunity } from '@/types';
import { Bookmark, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function SavedOpportunities() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [savedOpps, setSavedOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      if (user?.role !== 'student') return;
      
      const res = await onboardingService.getSaved();
      // res.data now contains { savedOpportunityIds: string[], savedOpportunities: Opportunity[] }
      setSavedOpps(res.data.savedOpportunities || []);
    } catch (err) {
      toast.error('Failed to load saved opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, [user]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="flex items-center gap-3 mb-8 border-b border-border/50 pb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Bookmark className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Saved Opportunities</h1>
            <p className="text-muted-foreground mt-1">Opportunities you've bookmarked for later.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 rounded-[1rem] bg-accent/50 animate-pulse border border-border"></div>
            ))}
          </div>
        ) : savedOpps.length === 0 ? (
          <div className="text-center py-24 bg-accent/20 rounded-[1rem] border border-border/50">
            <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No saved opportunities</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You haven't bookmarked any opportunities yet. Browse the ecosystem to find roles that match your personality.
            </p>
            <Button className="mt-6 gradient-primary rounded-full" onClick={() => navigate('/internships')}>
              Discover Opportunities <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedOpps.map(opp => (
              <OpportunityCard key={opp._id || opp.id} opportunity={opp} onSaveToggle={fetchSaved} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

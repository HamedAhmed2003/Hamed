import { useEffect, useState } from 'react';
import { useInternshipStore } from '@/store/internshipStore';
import { AppLayout } from '@/components/AppLayout';
import { OpportunityCard } from '@/components/OpportunityCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Briefcase, Filter } from 'lucide-react';
import { INTEREST_CATEGORIES } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function InternshipBrowse() {
  const { internships, fetchInternships, isLoading } = useInternshipStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [paidFilter, setPaidFilter] = useState('all');

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  const filteredOpportunities = internships.filter(opp => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || opp.category === categoryFilter;
    const matchesMode = modeFilter === 'all' || opp.mode === modeFilter;
    const matchesPaid = paidFilter === 'all' || (paidFilter === 'paid' ? opp.isPaid : !opp.isPaid);

    return matchesSearch && matchesCategory && matchesMode && matchesPaid;
  });

  return (
    <AppLayout>
      <div className="bg-primary/5 py-16 border-b border-border/50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Discover <span className="gradient-primary-text">Opportunities</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find the perfect place to make an impact. We match your personality with causes that matter.
          </p>

          <div className="max-w-4xl mx-auto mt-8 bg-card p-2 rounded-2xl shadow-xl shadow-primary/5 border border-primary/10 flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by role or organization..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-none bg-transparent focus-visible:ring-0 text-base"
              />
            </div>
            <div className="w-px bg-border hidden md:block"></div>
            <div className="md:w-48 relative">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-12 border-none bg-transparent focus:ring-0 text-base">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {INTEREST_CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-px bg-border hidden md:block"></div>
            <div className="md:w-40 relative">
              <Select value={modeFilter} onValueChange={setModeFilter}>
                <SelectTrigger className="h-12 border-none bg-transparent focus:ring-0 text-base">
                  <SelectValue placeholder="Work Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Mode</SelectItem>
                  <SelectItem value="online">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="offline">On-site</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="h-12 px-8 rounded-xl gradient-primary text-primary-foreground hidden md:flex">
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">
            {filteredOpportunities.length} {filteredOpportunities.length === 1 ? 'Opportunity' : 'Opportunities'} Found
          </h2>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={paidFilter} onValueChange={setPaidFilter}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Compensation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="paid">Stipend / Paid</SelectItem>
                <SelectItem value="unpaid">Volunteer / Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 rounded-[1rem] bg-accent/50 animate-pulse border border-border"></div>
            ))}
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="text-center py-24 bg-accent/20 rounded-[1rem] border border-border/50">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No opportunities found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
            <Button variant="outline" className="mt-6" onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setModeFilter('all');
              setPaidFilter('all');
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map(opp => (
              <OpportunityCard key={opp._id || opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

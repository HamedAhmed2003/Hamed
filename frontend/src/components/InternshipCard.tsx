import { Internship } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Monitor, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InternshipCardProps {
  internship: Internship;
  skillMatch?: number;
  showApply?: boolean;
}

const modeIcons = { online: Monitor, offline: MapPin, hybrid: Building2 };

export function InternshipCard({ internship, skillMatch, showApply = true }: InternshipCardProps) {
  const navigate = useNavigate();
  const ModeIcon = modeIcons[internship.mode];

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate text-foreground">{internship.title}</h3>
            <p className="text-sm text-muted-foreground">{internship.companyName}</p>
          </div>
          {skillMatch !== undefined && (
            <div className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
              skillMatch >= 75 ? 'gradient-primary text-primary-foreground' :
              skillMatch >= 50 ? 'bg-warning/10 text-warning' :
              'bg-muted text-muted-foreground'
            }`}>
              {skillMatch}% match
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{internship.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {internship.requiredSkills.slice(0, 4).map(skill => (
            <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
          ))}
          {internship.requiredSkills.length > 4 && (
            <Badge variant="outline" className="text-xs">+{internship.requiredSkills.length - 4}</Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{internship.duration}</span>
          <span className="flex items-center gap-1 capitalize"><ModeIcon className="h-3.5 w-3.5" />{internship.mode}</span>
          {internship.isPaid && internship.salaryMin != null && (
            <span className="flex items-center gap-1 text-primary font-medium">
              <DollarSign className="h-3.5 w-3.5" />${internship.salaryMin} – ${internship.salaryMax}
            </span>
          )}
          {!internship.isPaid && <span className="text-muted-foreground">Unpaid</span>}
        </div>
      </CardContent>
      {showApply && (
        <CardFooter className="pt-0">
          <Button
            onClick={() => navigate(`/internships/${internship.id}`)}
            className="w-full gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            View Details
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

import { cn } from '@/lib/utils';

type StatusBadgeProps = {
  status: 'pending' | 'accepted' | 'rejected' | 'approved' | 'suspended';
  className?: string;
};

const statusStyles = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  accepted: 'bg-primary/10 text-primary border-primary/20',
  approved: 'bg-primary/10 text-primary border-primary/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  suspended: 'bg-muted text-muted-foreground border-border',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize',
      statusStyles[status],
      className
    )}>
      {status}
    </span>
  );
}

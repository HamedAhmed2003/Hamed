import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { useNotificationStore, INotification } from '@/store/notificationStore';
import { Bell, BriefcaseBusiness, UserCheck, UserX, CircleCheckBig, CircleAlert, BookOpen, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  opportunity_submitted: { icon: BriefcaseBusiness, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30', label: 'Opportunity Submitted' },
  opportunity_approved: { icon: CircleCheckBig, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', label: 'Opportunity Approved' },
  opportunity_rejected: { icon: CircleAlert, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30', label: 'Opportunity Rejected' },
  application_received: { icon: BookOpen, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/30', label: 'New Application' },
  application_accepted: { icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', label: 'Application Accepted' },
  application_rejected: { icon: UserX, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30', label: 'Application Not Selected' },
};

function NotificationRow({ n, onRead, onDelete }: { n: INotification; onRead: () => void; onDelete: () => void }) {
  const cfg = typeConfig[n.type] || { icon: Bell, color: 'text-violet-600', bg: 'bg-violet-50', label: 'Notification' };
  const Icon = cfg.icon;
  const time = (() => {
    try { return formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }); }
    catch { return ''; }
  })();

  return (
    <div
      className={`relative flex gap-4 p-5 rounded-2xl border transition-all cursor-pointer group hover:shadow-md ${
        !n.isRead
          ? 'border-violet-200 bg-violet-50/50 dark:border-violet-800 dark:bg-violet-950/20 hover:shadow-violet-100/50'
          : 'border-border bg-card hover:border-border/80'
      }`}
      onClick={onRead}
    >
      {!n.isRead && (
        <span className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-violet-500" />
      )}

      <div className={`w-12 h-12 rounded-2xl ${cfg.bg} flex items-center justify-center shrink-0`}>
        <Icon className={`h-6 w-6 ${cfg.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${cfg.color} mb-1 block`}>{cfg.label}</span>
            <h3 className="font-bold text-foreground leading-tight">{n.title}</h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
        {time && <p className="text-xs text-muted-foreground/60 mt-2">{time}</p>}
      </div>

      <div className="flex flex-col gap-2 shrink-0 self-start opacity-0 group-hover:opacity-100 transition-opacity">
        {!n.isRead && (
          <button
            className="p-1.5 rounded-lg hover:bg-violet-100 text-violet-600"
            onClick={e => { e.stopPropagation(); onRead(); }}
            title="Mark as read"
          >
            <CheckCheck className="h-4 w-4" />
          </button>
        )}
        <button
          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
          onClick={e => { e.stopPropagation(); onDelete(); }}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, unreadCount, isLoading, fetchNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6 py-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Notifications</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" className="rounded-full gap-1.5" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-24 card-premium rounded-3xl">
            <div className="w-20 h-20 rounded-full bg-violet-50 flex items-center justify-center mx-auto mb-5">
              <Bell className="h-10 w-10 text-violet-200" />
            </div>
            <h2 className="text-xl font-bold mb-2">No notifications yet</h2>
            <p className="text-muted-foreground">When something happens, we'll let you know here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Unread Section */}
            {notifications.some(n => !n.isRead) && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Unread</h2>
                <div className="space-y-2">
                  {notifications.filter(n => !n.isRead).map(n => (
                    <NotificationRow
                      key={n._id || n.id}
                      n={n}
                      onRead={() => {
                        if (!n.isRead) markAsRead(n._id || n.id!);
                        // Navigate based on type
                        if (n.type === 'opportunity_submitted') navigate('/admin/dashboard');
                        else if (n.type === 'opportunity_approved' || n.type === 'opportunity_rejected') navigate('/company/dashboard');
                        else if (n.type === 'application_received') navigate('/company/dashboard');
                        else if (n.type === 'application_accepted' || n.type === 'application_rejected') navigate('/student/dashboard');
                      }}
                      onDelete={() => deleteNotification(n._id || n.id!)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Read Section */}
            {notifications.some(n => n.isRead) && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 mt-6">Earlier</h2>
                <div className="space-y-2">
                  {notifications.filter(n => n.isRead).map(n => (
                    <NotificationRow
                      key={n._id}
                      n={n}
                      onRead={() => {}}
                      onDelete={() => deleteNotification(n._id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, BriefcaseBusiness, UserCheck, UserX, CircleCheckBig, CircleAlert, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useNotificationStore, INotification } from '@/store/notificationStore';
import { formatDistanceToNow } from 'date-fns';

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  opportunity_submitted: { icon: BriefcaseBusiness, color: 'text-amber-600', bg: 'bg-amber-50' },
  opportunity_approved: { icon: CircleCheckBig, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  opportunity_rejected: { icon: CircleAlert, color: 'text-red-500', bg: 'bg-red-50' },
  application_received: { icon: BookOpen, color: 'text-violet-600', bg: 'bg-violet-50' },
  application_accepted: { icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  application_rejected: { icon: UserX, color: 'text-red-500', bg: 'bg-red-50' },
};

function NotifItem({ n, onRead, onDelete }: { n: INotification; onRead: () => void; onDelete: () => void }) {
  const cfg = typeConfig[n.type] || { icon: Bell, color: 'text-violet-600', bg: 'bg-violet-50' };
  const Icon = cfg.icon;
  const time = (() => {
    try { return formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }); }
    catch { return ''; }
  })();

  return (
    <div
      className={`flex gap-3 p-3 hover:bg-accent/40 rounded-xl cursor-pointer group transition-colors relative ${!n.isRead ? 'bg-violet-50/60 dark:bg-violet-950/20' : ''}`}
      onClick={onRead}
    >
      {!n.isRead && (
        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-violet-500" />
      )}
      <div className={`w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
        <Icon className={`h-4 w-4 ${cfg.color}`} />
      </div>
      <div className="flex-1 min-w-0 pr-3">
        <p className="font-semibold text-sm text-foreground leading-tight">{n.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
        {time && <p className="text-xs text-muted-foreground/60 mt-1">{time}</p>}
      </div>
      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 self-start mt-0.5">
        {!n.isRead && (
          <button
            className="p-1 rounded-md hover:bg-violet-100 text-violet-600"
            onClick={e => { e.stopPropagation(); onRead(); }}
            title="Mark as read"
          >
            <CheckCheck className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
          onClick={e => { e.stopPropagation(); onDelete(); }}
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function NotificationBell() {
  const navigate = useNavigate();
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const recent = notifications.slice(0, 6);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-violet-600 text-white text-[10px] font-bold px-0.5 leading-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-2xl shadow-violet-100/50 border border-border/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-gradient-to-br from-violet-50/60 to-purple-50/60">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-violet-600" />
            <span className="font-bold text-sm text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-violet-600 text-white text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              className="text-xs text-violet-600 font-semibold hover:text-violet-800 flex items-center gap-1 transition-colors"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {recent.length === 0 ? (
            <div className="py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center mx-auto mb-3">
                <Bell className="h-5 w-5 text-violet-300" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">You're all caught up!</p>
              <p className="text-xs text-muted-foreground/60 mt-1">No new notifications</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {recent.map(n => (
                <NotifItem
                  key={n._id || n.id}
                  n={n}
                  onRead={() => {
                    if (!n.isRead) markAsRead(n._id || n.id!);
                    // Navigate based on type
                    if (n.type === 'opportunity_submitted') {
                      setOpen(false);
                      navigate('/admin/dashboard');
                    } else if (n.type === 'opportunity_approved' || n.type === 'opportunity_rejected') {
                      setOpen(false);
                      navigate('/company/dashboard');
                    } else if (n.type === 'application_received') {
                      setOpen(false);
                      navigate('/company/dashboard');
                    } else if (n.type === 'application_accepted' || n.type === 'application_rejected') {
                      setOpen(false);
                      navigate('/student/dashboard');
                    }
                  }}
                  onDelete={() => deleteNotification(n._id || n.id!)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <button
                className="w-full text-center text-xs text-violet-600 font-semibold py-2 rounded-xl hover:bg-violet-50 transition-colors"
                onClick={() => { setOpen(false); navigate('/notifications'); }}
              >
                View all notifications →
              </button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

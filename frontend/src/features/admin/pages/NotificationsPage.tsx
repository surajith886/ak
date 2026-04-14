// ============================================
// Notifications Page - Admin alerts panel
// ============================================

import { useNotifications, useMarkNotificationRead } from "@/hooks/useApi";
import { Bell, AlertTriangle, Clock, ShoppingCart, Package, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap = {
  low_stock: AlertTriangle,
  expiry_warning: Clock,
  new_order: ShoppingCart,
  general: Package,
};

const colorMap = {
  low_stock: "text-accent",
  expiry_warning: "text-warning",
  new_order: "text-primary",
  general: "text-success",
};

const NotificationsPage = () => {
  const { data: notifications = [] } = useNotifications();
  const markReadMutation = useMarkNotificationRead();

  const markAllRead = () => {
    notifications.filter((n) => !n.read).forEach((n) => markReadMutation.mutate(n.id));
  };

  const markRead = (id: string) => {
    markReadMutation.mutate(id);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="w-6 h-6" /> Notifications
          </h1>
          <p className="text-muted-foreground text-sm">{unreadCount} unread alerts</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="border-border text-muted-foreground" onClick={markAllRead}>
            <Check className="w-4 h-4 mr-1" /> Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((notif) => {
          const Icon = iconMap[notif.type];
          return (
            <div
              key={notif.id}
              onClick={() => markRead(notif.id)}
              className={`glass-card p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-secondary/30 ${
                !notif.read ? "border-l-2 border-l-primary" : "opacity-60"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg bg-secondary flex items-center justify-center ${colorMap[notif.type]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{notif.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
              {!notif.read && <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;

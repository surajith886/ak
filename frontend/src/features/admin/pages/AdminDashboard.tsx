// ============================================
// Admin Dashboard - Overview with stats & charts
// ============================================

import { mockMedicines, mockOrders, mockNotifications, mockStockUsage } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, DollarSign, ShoppingCart, TrendingUp, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AdminDashboard = () => {
  const totalMedicines = mockMedicines.length;
  const lowStockCount = mockMedicines.filter((m) => m.stock <= m.lowStockThreshold).length;
  const expiringCount = mockMedicines.filter((m) => {
    const days = Math.ceil((new Date(m.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days <= 30 && days > 0;
  }).length;
  const pendingOrders = mockOrders.filter((o) => o.status === "pending").length;
  const totalRevenue = mockOrders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0);
  const unreadNotifs = mockNotifications.filter((n) => !n.read).length;

  const stats = [
    { label: "Total Medicines", value: totalMedicines, icon: Package, color: "text-primary" },
    { label: "Low Stock", value: lowStockCount, icon: AlertTriangle, color: "text-accent", alert: lowStockCount > 0 },
    { label: "Expiring Soon", value: expiringCount, icon: Clock, color: "text-warning", alert: expiringCount > 0 },
    { label: "Pending Orders", value: pendingOrders, icon: ShoppingCart, color: "text-primary" },
    { label: "Revenue", value: `₹${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-success" },
    { label: "Alerts", value: unreadNotifs, icon: TrendingUp, color: "text-accent", alert: unreadNotifs > 0 },
  ];

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back, here's your pharmacy overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-5 relative overflow-hidden">
            {stat.alert && (
              <div className="absolute top-3 right-3">
                <span className="w-2.5 h-2.5 rounded-full bg-accent block animate-pulse-glow" />
              </div>
            )}
            <div className={`w-9 h-9 rounded-lg bg-secondary flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Stock Usage Chart */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Stock Usage Overview</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockStockUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(228 12% 18%)" />
              <XAxis dataKey="month" stroke="hsl(215 15% 55%)" fontSize={12} />
              <YAxis stroke="hsl(215 15% 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(228 14% 12%)",
                  border: "1px solid hsl(228 12% 18%)",
                  borderRadius: "8px",
                  color: "hsl(210 20% 92%)",
                }}
              />
              <Legend />
              <Bar dataKey="sold" fill="hsl(172 66% 50%)" radius={[4, 4, 0, 0]} name="Units Sold" />
              <Bar dataKey="restocked" fill="hsl(25 95% 53%)" radius={[4, 4, 0, 0]} name="Restocked" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Stock & Expiring */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Low Stock Medicines */}
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-accent" />
            Low Stock Medicines
          </h3>
          <div className="space-y-3">
            {mockMedicines
              .filter((m) => m.stock <= m.lowStockThreshold)
              .map((med) => (
                <div key={med.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{med.name}</p>
                    <p className="text-xs text-muted-foreground">{med.category}</p>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {med.stock} left
                  </Badge>
                </div>
              ))}
            {lowStockCount === 0 && <p className="text-sm text-muted-foreground">All stock levels are healthy ✓</p>}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" />
            Recent Orders
          </h3>
          <div className="space-y-3">
            {mockOrders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""} · ₹{order.total.toFixed(2)}
                  </p>
                </div>
                <Badge
                  className={`text-xs capitalize border-0 ${
                    order.status === "pending"
                      ? "bg-warning/20 text-warning"
                      : order.status === "delivered"
                      ? "bg-success/20 text-success"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  {order.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

// ============================================
// Customer Orders Page
// ============================================

import { useOrders } from "@/hooks/useApi";
import { Badge } from "@/components/ui/badge";
import { Package, FileImage } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-warning/20 text-warning",
  approved: "bg-primary/20 text-primary",
  processing: "bg-accent/20 text-accent",
  delivered: "bg-success/20 text-success",
  cancelled: "bg-destructive/20 text-destructive",
};

const CustomerOrders = () => {
  const { data: orders = [], isLoading } = useOrders();

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground text-sm">Track your order history</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-primary">{order.id}</span>
                  <Badge className={`${statusColors[order.status]} border-0 capitalize text-xs`}>{order.status}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="space-y-1">
                {order.items.map((item) => (
                  <div key={item.medicineId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.medicineName} x{item.quantity}</span>
                    <span className="text-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {order.prescriptionRequired && (
                    <Badge className="text-xs bg-primary/20 text-primary border-0 gap-1">
                      <FileImage className="w-3 h-3" /> Prescription
                    </Badge>
                  )}
                </div>
                <span className="font-bold text-foreground">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;

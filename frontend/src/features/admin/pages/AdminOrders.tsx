// ============================================
// Admin Orders Page
// ============================================

import { useState } from "react";
import { useOrders, useUpdateOrderStatus } from "@/hooks/useApi";
import { Order, OrderStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, FileImage } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-warning/20 text-warning",
  approved: "bg-primary/20 text-primary",
  rejected: "bg-destructive/20 text-destructive",
  delivered: "bg-success/20 text-success",
  cancelled: "bg-destructive/20 text-destructive",
};

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { data: orders = [] } = useOrders();
  const updateOrderMutation = useUpdateOrderStatus();

  const updateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderMutation.mutate({ orderId, status });
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground text-sm">Manage customer orders and prescriptions</p>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Order ID", "Customer", "Items", "Total", "Prescription", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 text-sm font-mono text-primary">{order.id}</td>
                <td className="px-4 py-3 text-sm text-foreground">{order.customerName}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{order.items.length} items</td>
                <td className="px-4 py-3 text-sm font-medium text-foreground">₹{order.total.toFixed(2)}</td>
                <td className="px-4 py-3">
                  {order.prescriptionRequired ? (
                    <Badge className="text-xs bg-primary/20 text-primary border-0 gap-1">
                      <FileImage className="w-3 h-3" /> Required
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">N/A</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v as OrderStatus)}>
                    <SelectTrigger className="w-32 h-8 text-xs bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {(["pending", "approved", "rejected", "delivered", "cancelled"] as OrderStatus[]).map((s) => (
                        <SelectItem key={s} value={s} className="capitalize text-xs">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => setSelectedOrder(order)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Order {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="text-foreground font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge className={`${statusColors[selectedOrder.status]} border-0 capitalize`}>{selectedOrder.status}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="text-foreground">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="text-foreground font-medium">₹{selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Items</p>
                {selectedOrder.items.map((item) => (
                  <div key={item.medicineId} className="flex justify-between p-2 rounded bg-secondary/50 mb-1 text-sm">
                    <span className="text-foreground">{item.medicineName} x{item.quantity}</span>
                    <span className="text-muted-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {selectedOrder.prescriptionUrl && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Prescription</p>
                  <div className="w-full h-40 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground text-sm">
                    <FileImage className="w-8 h-8 mr-2" /> Prescription image preview
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;

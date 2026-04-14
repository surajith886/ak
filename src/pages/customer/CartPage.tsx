// ============================================
// Shopping Cart Page
// ============================================

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateOrder } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingCart, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, clearCart, total, itemCount } = useCart();
  const { user } = useAuth();
  const createOrderMutation = useCreateOrder();

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to place an order.");
      return;
    }

    try {
      await createOrderMutation.mutateAsync({
        items: items.map((item) => ({
          medicineId: item.medicine.id,
          medicineName: item.medicine.name,
          quantity: item.quantity,
          price: item.medicine.price,
        })),
        total,
        prescriptionRequired: items.some((item) => item.medicine.requiresPrescription),
      });

      toast.success("Order placed successfully", {
        description: "Your order has been created and is pending review.",
      });
      clearCart();
    } catch {
      toast.error("Could not place order. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-slide-in">
        <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground text-sm mb-6">Browse medicines to add items to your cart</p>
        <Link to="/">
          <Button className="gradient-primary text-primary-foreground">Browse Medicines</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
        <p className="text-muted-foreground text-sm">{itemCount} items in your cart</p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.medicine.id} className="glass-card p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground">{item.medicine.name}</h3>
              <p className="text-xs text-muted-foreground">{item.medicine.dosage}</p>
              <p className="text-sm font-medium text-primary mt-1">₹{item.medicine.price.toFixed(2)} each</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 border-border" onClick={() => updateQuantity(item.medicine.id, item.quantity - 1)}>
                <Minus className="w-3 h-3" />
              </Button>
              <Input
                value={item.quantity}
                onChange={(e) => updateQuantity(item.medicine.id, parseInt(e.target.value) || 1)}
                className="w-14 h-8 text-center bg-secondary border-border text-sm"
              />
              <Button variant="outline" size="icon" className="h-8 w-8 border-border" onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            <p className="text-sm font-bold text-foreground w-20 text-right">
              ₹{(item.medicine.price * item.quantity).toFixed(2)}
            </p>

            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.medicine.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Checkout Summary */}
      <div className="glass-card p-6 glow-primary">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground font-medium">₹{total.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span className="text-foreground font-medium">₹{(total * 0.08).toFixed(2)}</span>
        </div>
        <div className="border-t border-border pt-4 flex items-center justify-between mb-6">
          <span className="text-foreground font-semibold">Total</span>
          <span className="text-xl font-bold text-primary">₹{(total * 1.08).toFixed(2)}</span>
        </div>
        <Button
          className="w-full gradient-primary text-primary-foreground gap-2 h-11"
          onClick={handleCheckout}
          disabled={createOrderMutation.isPending}
        >
          <CreditCard className="w-4 h-4" />
          {createOrderMutation.isPending ? "Placing Order..." : "Place Order"}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Orders are submitted to the backend API.
        </p>
      </div>
    </div>
  );
};

export default CartPage;

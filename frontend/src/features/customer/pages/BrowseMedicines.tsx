// ============================================
// Browse Medicines - Customer view
// ============================================

import { useState } from "react";
import { medicineCategories } from "@/data/mockData";
import { useCart } from "@/features/customer/context/CartContext";
import { useMedicines } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Plus, FileText } from "lucide-react";
import { toast } from "sonner";

const BrowseMedicines = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { addToCart } = useCart();
  const { data: filtered = [], isLoading } = useMedicines({
    category: category === "All" ? undefined : category,
    keyword: search || undefined,
  });

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Browse Medicines</h1>
        <p className="text-muted-foreground text-sm">Find and order your medicines</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or generic name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {medicineCategories.map((cat) => (
            <Button
              key={cat}
              variant="outline"
              size="sm"
              onClick={() => setCategory(cat)}
              className={`text-xs border-border ${
                category === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Medicine Grid */}
      {isLoading && <p className="text-sm text-muted-foreground">Loading medicines...</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((med) => (
          <div key={med.id} className="glass-card p-5 flex flex-col justify-between hover:border-primary/30 transition-colors">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                {med.requiresPrescription && (
                  <Badge className="text-xs bg-primary/20 text-primary border-0">Rx</Badge>
                )}
              </div>
              <h3 className="text-sm font-semibold text-foreground">{med.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{med.genericName} · {med.category}</p>
              <p className="text-xs text-muted-foreground mt-1">{med.dosage}</p>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{med.description}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-bold text-foreground">₹{med.price.toFixed(2)}</span>
              <Button
                size="sm"
                className="gradient-primary text-primary-foreground gap-1"
                onClick={() => {
                  addToCart(med);
                  toast.success(`${med.name} added to cart`);
                }}
                disabled={med.stock === 0}
              >
                <Plus className="w-3.5 h-3.5" />
                <ShoppingCart className="w-3.5 h-3.5" />
              </Button>
            </div>
            {med.stock <= med.lowStockThreshold && med.stock > 0 && (
              <p className="text-xs text-accent mt-2">⚠ Only {med.stock} left in stock</p>
            )}
            {med.stock === 0 && <p className="text-xs text-destructive mt-2">Out of stock</p>}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No medicines found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default BrowseMedicines;

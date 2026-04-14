// ============================================
// Medicine Management Page - Admin CRUD
// ============================================

import { useState } from "react";
import { Medicine } from "@/types";
import { useCreateMedicine, useDeleteMedicine, useMedicines, useUpdateMedicine } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit2, Trash2, AlertTriangle, Clock } from "lucide-react";

const MedicineManagement = () => {
  const [search, setSearch] = useState("");
  const [editMedicine, setEditMedicine] = useState<Medicine | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: medicines = [], isLoading } = useMedicines({ keyword: search || undefined });
  const createMedicineMutation = useCreateMedicine();
  const updateMedicineMutation = useUpdateMedicine();
  const deleteMedicineMutation = useDeleteMedicine();

  const filtered = medicines;

  const isLowStock = (m: Medicine) => m.stock <= m.lowStockThreshold;
  const isExpiringSoon = (m: Medicine) => {
    const days = Math.ceil((new Date(m.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days <= 30;
  };

  const handleDelete = (id: string) => {
    deleteMedicineMutation.mutate(id);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload: Omit<Medicine, "id"> = {
      name: form.get("name") as string,
      genericName: form.get("genericName") as string,
      category: form.get("category") as string,
      manufacturer: form.get("manufacturer") as string,
      price: parseFloat(form.get("price") as string),
      stock: parseInt(form.get("stock") as string),
      lowStockThreshold: parseInt(form.get("threshold") as string),
      expiryDate: form.get("expiryDate") as string,
      description: form.get("description") as string,
      dosage: form.get("dosage") as string,
      requiresPrescription: form.get("prescription") === "on",
    };

    if (editMedicine) {
      await updateMedicineMutation.mutateAsync({ medicineId: editMedicine.id, payload });
    } else {
      await createMedicineMutation.mutateAsync(payload);
    }
    setDialogOpen(false);
    setEditMedicine(null);
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Medicines</h1>
          <p className="text-muted-foreground text-sm">Manage your pharmacy inventory</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditMedicine(null); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground gap-2">
              <Plus className="w-4 h-4" /> Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">{editMedicine ? "Edit" : "Add"} Medicine</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-3">
              {[
                { name: "name", label: "Name", defaultValue: editMedicine?.name },
                { name: "genericName", label: "Generic Name", defaultValue: editMedicine?.genericName },
                { name: "category", label: "Category", defaultValue: editMedicine?.category },
                { name: "manufacturer", label: "Manufacturer", defaultValue: editMedicine?.manufacturer },
                { name: "dosage", label: "Dosage", defaultValue: editMedicine?.dosage },
                { name: "description", label: "Description", defaultValue: editMedicine?.description },
              ].map((f) => (
                <div key={f.name}>
                  <Label className="text-foreground text-sm">{f.label}</Label>
                  <Input name={f.name} defaultValue={f.defaultValue || ""} className="bg-secondary border-border mt-1" required />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-foreground text-sm">Price (₹)</Label>
                  <Input name="price" type="number" step="0.01" defaultValue={editMedicine?.price} className="bg-secondary border-border mt-1" required />
                </div>
                <div>
                  <Label className="text-foreground text-sm">Stock</Label>
                  <Input name="stock" type="number" defaultValue={editMedicine?.stock} className="bg-secondary border-border mt-1" required />
                </div>
                <div>
                  <Label className="text-foreground text-sm">Low Stock Threshold</Label>
                  <Input name="threshold" type="number" defaultValue={editMedicine?.lowStockThreshold} className="bg-secondary border-border mt-1" required />
                </div>
                <div>
                  <Label className="text-foreground text-sm">Expiry Date</Label>
                  <Input name="expiryDate" type="date" defaultValue={editMedicine?.expiryDate} className="bg-secondary border-border mt-1" required />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input name="prescription" type="checkbox" defaultChecked={editMedicine?.requiresPrescription} className="rounded" />
                <Label className="text-foreground text-sm">Requires Prescription</Label>
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground">
                {editMedicine ? "Update" : "Add"} Medicine
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search medicines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-secondary border-border"
        />
      </div>

      {/* Table */}
      {isLoading && <p className="text-sm text-muted-foreground">Loading medicines...</p>}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Name", "Category", "Price", "Stock", "Expiry", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((med) => (
                <tr key={med.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{med.name}</p>
                    <p className="text-xs text-muted-foreground">{med.manufacturer}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{med.category}</td>
                  <td className="px-4 py-3 text-sm text-foreground">₹{med.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${isLowStock(med) ? "text-destructive" : "text-foreground"}`}>
                      {med.stock}
                    </span>
                    {isLowStock(med) && <AlertTriangle className="inline w-3.5 h-3.5 text-accent ml-1" />}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${isExpiringSoon(med) ? "text-warning" : "text-muted-foreground"}`}>
                      {new Date(med.expiryDate).toLocaleDateString()}
                    </span>
                    {isExpiringSoon(med) && <Clock className="inline w-3.5 h-3.5 text-warning ml-1" />}
                  </td>
                  <td className="px-4 py-3">
                    {med.requiresPrescription ? (
                      <Badge className="text-xs bg-primary/20 text-primary border-0">Rx</Badge>
                    ) : (
                      <Badge className="text-xs bg-success/20 text-success border-0">OTC</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => { setEditMedicine(med); setDialogOpen(true); }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(med.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedicineManagement;

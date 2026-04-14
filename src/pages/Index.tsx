// ============================================
// Index Page - Routes to correct dashboard based on role
// ============================================

import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import BrowseMedicines from "@/pages/customer/BrowseMedicines";

const Index = () => {
  const { user } = useAuth();

  if (user?.role === "admin") return <AdminDashboard />;
  return <BrowseMedicines />;
};

export default Index;

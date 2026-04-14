// ============================================
// Index Page - Routes to correct dashboard based on role
// ============================================

import { useAuth } from "@/features/auth/context/AuthContext";
import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import BrowseMedicines from "@/features/customer/pages/BrowseMedicines";

const Index = () => {
  const { user } = useAuth();

  if (user?.role === "admin") return <AdminDashboard />;
  return <BrowseMedicines />;
};

export default Index;

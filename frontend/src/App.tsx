import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { CartProvider } from "@/features/customer/context/CartContext";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import Index from "@/pages/Index";
import MedicineManagement from "@/features/admin/pages/MedicineManagement";
import AdminOrders from "@/features/admin/pages/AdminOrders";
import AnalyticsPage from "@/features/admin/pages/AnalyticsPage";
import NotificationsPage from "@/features/admin/pages/NotificationsPage";
import CartPage from "@/features/customer/pages/CartPage";
import CustomerOrders from "@/features/customer/pages/CustomerOrders";
import PrescriptionUpload from "@/features/customer/pages/PrescriptionUpload";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Authenticated routes */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<Index />} />
                {/* Admin routes */}
                <Route path="/medicines" element={<MedicineManagement />} />
                <Route path="/orders" element={<AdminOrders />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                {/* Customer routes */}
                <Route path="/cart" element={<CartPage />} />
                <Route path="/my-orders" element={<CustomerOrders />} />
                <Route path="/prescription" element={<PrescriptionUpload />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

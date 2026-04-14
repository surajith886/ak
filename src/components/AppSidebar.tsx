// ============================================
// App Sidebar - Navigation for admin & customer
// ============================================

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import {
  LayoutDashboard,
  Pill,
  ShoppingCart,
  ClipboardList,
  Bell,
  Search,
  Upload,
  LogOut,
  Package,
  BarChart3,
  UserCog,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AppSidebar = () => {
  const { user, logout, switchRole } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  if (!user) return null;

  const isAdmin = user.role === "admin";

  const adminLinks = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/medicines", icon: Pill, label: "Medicines" },
    { to: "/orders", icon: ClipboardList, label: "Orders" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/notifications", icon: Bell, label: "Notifications", badge: 3 },
  ];

  const customerLinks = [
    { to: "/", icon: Search, label: "Browse" },
    { to: "/cart", icon: ShoppingCart, label: "Cart", badge: itemCount || undefined },
    { to: "/my-orders", icon: Package, label: "My Orders" },
    { to: "/prescription", icon: Upload, label: "Prescription" },
  ];

  const links = isAdmin ? adminLinks : customerLinks;

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <Pill className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">MediVault</span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
              }`}
            >
              <link.icon className="w-4 h-4" />
              <span>{link.label}</span>
              {link.badge ? (
                <Badge className="ml-auto text-xs px-1.5 py-0.5 gradient-primary text-primary-foreground border-0">
                  {link.badge}
                </Badge>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Controls */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        {/* Role Switcher (demo) */}
        <button
          onClick={() => switchRole(isAdmin ? "customer" : "admin")}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <UserCog className="w-3.5 h-3.5" />
          Switch to {isAdmin ? "Customer" : "Admin"} View
        </button>

        {/* User */}
        <div className="flex items-center gap-3 px-3">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;

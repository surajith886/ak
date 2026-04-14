// ============================================
// Login Page
// ============================================

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pill, Loader2 } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) navigate("/");
      else setError("Invalid credentials");
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Quick login helpers for demo
  const quickLogin = async (role: "admin" | "customer") => {
    setLoading(true);
    setError("");
    const demoProfiles = {
      admin: { name: "Dr. Sarah Chen", email: "admin@medivault.com", role: "admin" as const },
      customer: { name: "John Doe", email: "john@example.com", role: "customer" as const },
    };
    const profile = demoProfiles[role];
    let success = await login(profile.email, "password123");

    // If seed users are missing, create them on-demand for smooth demo login.
    if (!success) {
      success = await register(profile.name, profile.email, "password123", profile.role);
    }

    if (success) {
      navigate("/");
    } else {
      setError("Quick login failed. Seed data and backend might not be running.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Pill className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">MediVault</span>
          </div>
          <p className="text-muted-foreground">Smart Medicine Management System</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-8 glow-primary">
          <h2 className="text-xl font-semibold text-foreground mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-1 bg-secondary border-border"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 bg-secondary border-border"
                required
              />
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>

          {/* Demo Quick Login */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3 text-center">Quick Demo Login</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 text-sm border-primary/30 text-primary hover:bg-primary/10"
                onClick={() => quickLogin("admin")}
                disabled={loading}
              >
                Admin Demo
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-sm border-accent/30 text-accent hover:bg-accent/10"
                onClick={() => quickLogin("customer")}
                disabled={loading}
              >
                Customer Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

// ============================================
// Analytics Page - Stock usage charts
// ============================================

import { mockStockUsage, mockMedicines } from "@/data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["hsl(172 66% 50%)", "hsl(25 95% 53%)", "hsl(142 71% 45%)", "hsl(38 92% 50%)", "hsl(0 72% 51%)", "hsl(228 14% 40%)"];

const AnalyticsPage = () => {
  // Category distribution
  const categoryData = mockMedicines.reduce((acc, m) => {
    const existing = acc.find((a) => a.name === m.category);
    if (existing) existing.value += m.stock;
    else acc.push({ name: m.category, value: m.stock });
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm">Stock usage insights and trends</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Stock Usage */}
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Monthly Stock Movement</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockStockUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(228 12% 18%)" />
                <XAxis dataKey="month" stroke="hsl(215 15% 55%)" fontSize={12} />
                <YAxis stroke="hsl(215 15% 55%)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(228 14% 12%)", border: "1px solid hsl(228 12% 18%)", borderRadius: "8px", color: "hsl(210 20% 92%)" }} />
                <Legend />
                <Bar dataKey="sold" fill="hsl(172 66% 50%)" radius={[4, 4, 0, 0]} name="Sold" />
                <Bar dataKey="restocked" fill="hsl(25 95% 53%)" radius={[4, 4, 0, 0]} name="Restocked" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Stock by Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(228 14% 12%)", border: "1px solid hsl(228 12% 18%)", borderRadius: "8px", color: "hsl(210 20% 92%)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

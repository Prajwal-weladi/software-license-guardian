
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { departmentCosts } from "@/data/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from "@/lib/utils";

const COLORS = ['#0ea5e9', '#0891b2', '#f59e0b', '#10b981', '#8b5cf6'];

const CostBreakdown = () => {
  const totalCost = departmentCosts.reduce((sum, item) => sum + item.cost, 0);
  
  // Calculate percentages for display
  const data = departmentCosts.map(item => ({
    ...item,
    value: item.cost,
    percentage: ((item.cost / totalCost) * 100).toFixed(1)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
        <CardDescription>License cost distribution by department</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="department"
                label={({ department, percentage }) => `${department} (${percentage}%)`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(name) => `Department: ${name}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={item.department} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div
                  className="h-3 w-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{item.department}</span>
              </div>
              <span className="font-medium">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CostBreakdown;

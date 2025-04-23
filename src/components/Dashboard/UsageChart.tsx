import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usageData } from "@/data/mockData";
import { License } from "@/data/mockData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UsageChartProps {
  selectedLicense?: License | null;
}

const UsageChart = ({ selectedLicense }: UsageChartProps) => {
  // Get data for the chart (last 14 days)
  const chartData = usageData.slice(-14);
  
  // Format dates for display
  const formattedData = chartData.map(data => ({
    ...data,
    formattedDate: new Date(data.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }));

  // If we have a selected license, simulate usage data specific to this license
  // In a real app, you would have actual per-license usage data
  const licenseSpecificData = selectedLicense 
    ? formattedData.map(data => ({
        ...data,
        users: Math.round(data.users * (selectedLicense.usedSeats / 100)) // Simulate license-specific usage
      }))
    : formattedData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Software Usage</CardTitle>
        <CardDescription>
          {selectedLicense 
            ? `Daily active users for ${selectedLicense.name}`
            : 'Daily active users over the last 14 days'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={licenseSpecificData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickFormatter={(value) => value.toLocaleString()}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip
                formatter={(value: number) => [value.toLocaleString(), 'Users']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#0ea5e9" 
                fillOpacity={1} 
                fill="url(#colorUsers)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageChart;

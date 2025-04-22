
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { licenseSummary } from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const LicenseSummary = () => {
  const usagePercentage = Math.round((licenseSummary.usedSeats / licenseSummary.totalSeats) * 100);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="stat-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Licenses</CardTitle>
          <div className="h-4 w-4 rounded-full bg-license-blue/20">
            <div className="h-full w-full rounded-full bg-license-blue/60" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{licenseSummary.total}</div>
          <p className="text-xs text-muted-foreground pt-1">
            {licenseSummary.active} active, {licenseSummary.expiring} expiring, {licenseSummary.expired} expired
          </p>
        </CardContent>
      </Card>
      
      <Card className="stat-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          <div className="h-4 w-4 rounded-full bg-license-teal/20">
            <div className="h-full w-full rounded-full bg-license-teal/60" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(licenseSummary.totalCost)}</div>
          <p className="text-xs text-muted-foreground pt-1">Annual subscription costs</p>
        </CardContent>
      </Card>

      <Card className="stat-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Seat Utilization</CardTitle>
          <div className="h-4 w-4 rounded-full bg-license-blue/20">
            <div className="h-full w-full rounded-full bg-license-blue/60" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{usagePercentage}%</div>
          <div className="flex items-center space-x-2 pt-2">
            <Progress value={usagePercentage} className="h-2" />
            <span className="text-xs text-muted-foreground">{licenseSummary.usedSeats}/{licenseSummary.totalSeats}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="stat-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Licenses Expiring</CardTitle>
          <div className="h-4 w-4 rounded-full bg-license-warning/20">
            <div className="h-full w-full rounded-full bg-license-warning/60" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{licenseSummary.expiring}</div>
          <p className="text-xs text-muted-foreground pt-1">Expiring in the next 30 days</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LicenseSummary;

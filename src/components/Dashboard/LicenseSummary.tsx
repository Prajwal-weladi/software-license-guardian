import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { licenseSummary } from "@/data/mockData";
import { License } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, DollarSign, Tag } from "lucide-react";

interface LicenseSummaryProps {
  selectedLicense: License | null;
}

const LicenseSummary = ({ selectedLicense }: LicenseSummaryProps) => {
  // If no specific license is selected, show the general summary
  if (!selectedLicense) {
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
  }
  
  // If a specific license is selected, show its details in the summary format
  const usagePercentage = Math.round((selectedLicense.usedSeats / selectedLicense.seats) * 100);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-license-valid/10 text-license-valid';
      case 'expiring':
        return 'bg-license-warning/10 text-license-warning';
      case 'expired':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'expiring':
        return 'Expiring Soon';
      case 'expired':
        return 'Expired';
      default:
        return status;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-1">{selectedLicense.name}</h2>
          <div className="flex items-center space-x-2">
            <p className="text-muted-foreground">{selectedLicense.vendor}</p>
            <span>•</span>
            <Badge variant="outline" className={getStatusColor(selectedLicense.status)}>
              {getStatusText(selectedLicense.status)}
            </Badge>
          </div>
        </div>
      </div>
    
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">License Type</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{selectedLicense.type}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Department: {selectedLicense.department}
            </p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(selectedLicense.cost)}</div>
            <p className="text-xs text-muted-foreground pt-1">
              {formatCurrency(selectedLicense.cost / selectedLicense.seats)} per seat
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seat Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{selectedLicense.usedSeats}/{selectedLicense.seats}</div>
            <div className="flex items-center space-x-2 pt-2">
              <Progress value={usagePercentage} className="h-2" />
              <span className="text-xs text-muted-foreground">{usagePercentage}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiry Date</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatDate(selectedLicense.expiryDate)}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Started: {formatDate(selectedLicense.startDate)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LicenseSummary;


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { licenses } from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ExpiringLicenses = () => {
  // Get licenses expiring in the next 60 days
  const today = new Date();
  const expiringLicenses = licenses
    .filter(license => {
      const expiryDate = new Date(license.expiryDate);
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 60;
    })
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
    .slice(0, 5);

  const formatDaysRemaining = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Expires today";
    if (diffDays === 1) return "Expires tomorrow";
    return `Expires in ${diffDays} days`;
  };

  const getStatusColor = (days: number) => {
    if (days <= 7) return "bg-destructive/10 text-destructive";
    if (days <= 30) return "bg-license-warning/10 text-license-warning";
    return "bg-license-blue/10 text-license-blue";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Upcoming Renewals</CardTitle>
            <CardDescription>Licenses expiring in the next 60 days</CardDescription>
          </div>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expiringLicenses.length > 0 ? (
            expiringLicenses.map((license) => {
              const daysRemaining = Math.ceil(
                (new Date(license.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
              );
              
              return (
                <div key={license.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{license.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <span>{license.vendor}</span>
                      <span>•</span>
                      <span>{license.seats} seats</span>
                      <span>•</span>
                      <span>{formatCurrency(license.cost)}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(daysRemaining)}>
                    {formatDaysRemaining(license.expiryDate)}
                  </Badge>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No licenses expiring soon</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpiringLicenses;

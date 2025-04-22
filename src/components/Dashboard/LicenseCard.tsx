
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { License } from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";
import { CalendarDays, Info, Users } from "lucide-react";

interface LicenseCardProps {
  license: License;
}

const LicenseCard = ({ license }: LicenseCardProps) => {
  const usagePercentage = Math.round((license.usedSeats / license.seats) * 100);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-license-valid/10 text-license-valid hover:bg-license-valid/20';
      case 'expiring':
        return 'bg-license-warning/10 text-license-warning hover:bg-license-warning/20';
      case 'expired':
        return 'bg-destructive/10 text-destructive hover:bg-destructive/20';
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="license-card overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{license.name}</h3>
            <p className="text-sm text-muted-foreground">{license.vendor}</p>
          </div>
          <Badge variant="outline" className={getStatusColor(license.status)}>
            {getStatusText(license.status)}
          </Badge>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center text-sm space-x-4">
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>Expires: {formatDate(license.expiryDate)}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{license.type}</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Seat usage</span>
              <span className="font-medium">{license.usedSeats}/{license.seats}</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Department: {license.department}</span>
            <span className="font-semibold">{formatCurrency(license.cost)}/year</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/30 px-6 py-3 flex justify-between">
        <div className="flex space-x-1">
          {license.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Info className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LicenseCard;

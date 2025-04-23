import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { License, licenses } from "@/data/mockData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LicenseUsageCard = () => {
  const navigate = useNavigate();
  
  // Sort licenses by seat usage percentage descending
  const sortedLicenses = [...licenses]
    .sort((a, b) => {
      const aPercentage = (a.usedSeats / a.seats) * 100;
      const bPercentage = (b.usedSeats / b.seats) * 100;
      return bPercentage - aPercentage;
    })
    .slice(0, 5); // Top 5 most utilized licenses
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  const handleManageUsers = () => {
    navigate('/users');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>License Utilization</CardTitle>
        <CardDescription>Seat allocation for top licenses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedLicenses.map((license) => {
            const usagePercentage = Math.round((license.usedSeats / license.seats) * 100);
            
            return (
              <div key={license.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{license.name}</p>
                    <p className="text-xs text-muted-foreground">{license.department}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="font-medium">{license.usedSeats}/{license.seats}</span>
                    <span className="text-xs text-muted-foreground">seats</span>
                  </div>
                </div>
                
                <div className="relative pt-1">
                  <Progress 
                    value={usagePercentage} 
                    className={`h-2 ${
                      usagePercentage >= 90 ? 'bg-destructive/30' : 
                      usagePercentage >= 75 ? 'bg-license-warning/30' : 
                      'bg-license-valid/30'
                    }`} 
                  />
                  
                  <div className="flex -space-x-2 mt-2">
                    {/* Placeholder avatars for assigned users */}
                    {Array.from({ length: Math.min(5, license.usedSeats) }).map((_, index) => (
                      <Avatar key={index} className="h-6 w-6 border border-background">
                        <AvatarFallback className="text-[10px]">
                          {getInitials(["PW", "TS", "SS", "YP", "MW"][index % 5])}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    
                    {license.usedSeats > 5 && (
                      <Avatar className="h-6 w-6 border border-background">
                        <AvatarFallback className="text-[10px]">
                          +{license.usedSeats - 5}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <Button 
          onClick={handleManageUsers} 
          variant="outline" 
          className="w-full mt-4"
        >
          <Users className="mr-2 h-4 w-4" />
          Manage User Assignments
        </Button>
      </CardContent>
    </Card>
  );
};

export default LicenseUsageCard; 
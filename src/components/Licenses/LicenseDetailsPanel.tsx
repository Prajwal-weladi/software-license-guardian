import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send } from 'lucide-react';
import { License } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate, calculateDaysRemaining } from "@/lib/utils";
import { X, Calendar, Users, Book, Edit, FileText, Archive } from "lucide-react";
import LicenseEmailNotification from './LicenseEmailNotification';
import emailjs from '@emailjs/browser';

interface LicenseDetailsPanelProps {
  license: License | null;
  onClose: () => void;
}

const LicenseDetailsPanel = ({ license, onClose }: LicenseDetailsPanelProps) => {
  if (!license) return null;

  const usagePercentage = Math.round((license.usedSeats / license.seats) * 100);
  const daysRemaining = calculateDaysRemaining(license.expiryDate);
  
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

  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleTestEmail = async () => {
    if (!license) return;

    setIsSending(true);
    try {
      const templateParams = {
        from_name: "License Management System",
        to_name: "User",
        to_email: "prajwalweladi1@gmail.com",
        subject: `Test Email for License: ${license.name}`,
        message: `
          This is a test email for license: ${license.name}
          Vendor: ${license.vendor}
          Expiry Date: ${formatDate(license.expiryDate)}
          
          If you're seeing this, your email configuration is working correctly!
        `
      };

      await emailjs.send(
        "service_ccr2vb2",  // Updated Service ID
        "template_rm0shl1", // Updated Template ID
        templateParams,
        "BnPNSRI9vhiqPLdSX" // Updated Public Key
      );

      toast({
        title: "Email Test Successful",
        description: "A test email has been sent successfully.",
      });
    } catch (error) {
      console.error('Email test failed:', error);
      toast({
        variant: "destructive",
        title: "Email Test Failed",
        description: "Unable to send test email. Please check your configuration.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="border-b pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>License Details</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-3 rounded-none">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="p-4 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{license.name}</h3>
                  <p className="text-sm text-muted-foreground">{license.vendor}</p>
                </div>
                <Badge variant="outline" className={getStatusColor(license.status)}>
                  {getStatusText(license.status)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">License Type</p>
                  <p className="font-medium">{license.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{license.department}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{formatDate(license.startDate)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{formatDate(license.expiryDate)}</p>
                    {daysRemaining <= 30 && (
                      <Badge variant={daysRemaining <= 7 ? "destructive" : "outline"} className="text-xs">
                        {daysRemaining <= 0 
                          ? 'Expired' 
                          : daysRemaining === 1 
                            ? '1 day left' 
                            : `${daysRemaining} days left`}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Annual Cost</p>
                  <p className="font-medium">{formatCurrency(license.cost)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Cost per Seat</p>
                  <p className="font-medium">{formatCurrency(license.cost / license.seats)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Seat Utilization</span>
                  <span className="font-medium">{license.usedSeats}/{license.seats}</span>
                </div>
                <Progress value={usagePercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {usagePercentage >= 90 
                    ? "Near capacity - consider purchasing additional seats" 
                    : usagePercentage <= 50 
                      ? "Underutilized - consider optimizing license allocation" 
                      : "Healthy utilization"}
                </p>
              </div>
              
              {license.tags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {license.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="usage" className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Renewal Schedule</p>
                <p className="text-xs text-muted-foreground">
                  Next renewal on {formatDate(license.expiryDate)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">User Assignment</p>
                <p className="text-xs text-muted-foreground">
                  {license.usedSeats} of {license.seats} seats assigned
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Historical Usage</p>
              <div className="h-40 bg-muted/30 rounded-md flex items-center justify-center text-sm text-muted-foreground">
                Usage chart will be displayed here
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="p-4">
            <LicenseEmailNotification licenseId={license.id} />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t p-4 flex justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleTestEmail}
            disabled={isSending}
          >
            <Send className="mr-2 h-4 w-4" />
            {isSending ? 'Sending...' : 'Test Email'}
          </Button>
          <Button variant="outline" size="sm">
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </Button>
        </div>
        <Button size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit License
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LicenseDetailsPanel;

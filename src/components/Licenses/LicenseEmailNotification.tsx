
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabaseClient';

interface LicenseEmailNotificationProps {
  licenseId: string;
}

const LicenseEmailNotification = ({ licenseId }: LicenseEmailNotificationProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('license_notifications')
        .insert([
          { license_id: licenseId, email, created_at: new Date().toISOString() }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Email notification settings saved successfully",
      });
      
      setEmail('');
    } catch (error) {
      console.error('Error saving notification:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save email notification settings",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Email Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter email for notifications"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              You'll receive notifications when this license is about to expire
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Notification Settings'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LicenseEmailNotification;

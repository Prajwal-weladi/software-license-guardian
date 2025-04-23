import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabaseClient';
// Import EmailJS
import * as emailjsModule from '@emailjs/browser';
const emailjs = emailjsModule.default || emailjsModule;

interface LicenseEmailNotificationProps {
  licenseId: string;
  licenseName?: string;
}

const LicenseEmailNotification = ({ licenseId, licenseName }: LicenseEmailNotificationProps) => {
  // Set default email to prajwalweladi1@gmail.com
  const [email, setEmail] = useState('prajwalweladi1@gmail.com');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save to database first (if Supabase is available)
      try {
        if (supabase.from) {
          const { error } = await supabase
            .from('license_notifications')
            .insert([
              { license_id: licenseId, email: 'prajwalweladi1@gmail.com', created_at: new Date().toISOString() }
            ]);
  
          if (error) throw error;
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue anyway to send the email
      }

      // Send a confirmation email using EmailJS
      const templateParams = {
        from_name: "License Management System",
        to_name: "User",
        to_email: email,
        subject: `Email Notifications Set for ${licenseName || 'License'}`,
        message: `You have successfully subscribed to receive notifications for the license: ${licenseName || 'your software license'}.`
      };

      await emailjs.send(
        "service_ccr2vb2",  // Updated Service ID
        "template_rm0shl1", // Updated Template ID
        templateParams,
        "BnPNSRI9vhiqPLdSX" // Updated Public Key
      );

      toast({
        title: "Success",
        description: "Email notification settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving notification:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to save email notification settings";
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for the "Send Test Email" action
  const handleSendTestEmail = async () => {
    setIsSubmitting(true);
    try {
      // Send a test email using EmailJS directly
      const templateParams = {
        from_name: "License Management System",
        to_name: "User",
        to_email: email,
        subject: "Test Email from License Management System",
        message: "This is a test email from your License Management System. If you're seeing this, your email configuration is working correctly!"
      };

      await emailjs.send(
        "service_ccr2vb2",  // Updated Service ID
        "template_rm0shl1", // Updated Template ID
        templateParams,
        "BnPNSRI9vhiqPLdSX" // Updated Public Key
      );

      toast({
        title: "Test Email Sent",
        description: "A test email has been sent to the provided address.",
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      
      toast({
        variant: "destructive",
        title: "Email Test Failed",
        description: "Unable to send test email. Please check your configuration.",
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
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Notification Settings'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSendTestEmail} 
              disabled={isSubmitting || !email}
            >
              Test
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LicenseEmailNotification;

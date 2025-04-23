import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { License } from "@/data/mockData";
import { getLicenses, assignLicensesToUser } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";

interface AssignLicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onLicensesUpdated?: () => void;
}

const AssignLicenseDialog = ({
  open,
  onOpenChange,
  user,
  onLicensesUpdated,
}: AssignLicenseDialogProps) => {
  const [availableLicenses, setAvailableLicenses] = useState<License[]>([]);
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
  const [department, setDepartment] = useState(user?.department || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [licenseType, setLicenseType] = useState("all");
  const { toast } = useToast();

  // Initialize already assigned licenses and refresh available licenses
  useEffect(() => {
    if (user && open) {
      // Get user's currently assigned license IDs
      const assignedLicenseIds = user.assignedLicenses.map((license: any) => license.id.toString());
      setSelectedLicenses(assignedLicenseIds);
      setDepartment(user.department);
      
      // Load fresh license data
      refreshAvailableLicenses();
    }
  }, [user, open]);

  // Function to refresh available licenses
  const refreshAvailableLicenses = () => {
    // Get licenses from data service
    const allLicenses = getLicenses();
    
    // Include all licenses that either:
    // 1. Have available seats (usedSeats < seats)
    // 2. Are already assigned to this user
    const userAssignedLicenseIds = user.assignedLicenses.map((lic: any) => lic.id.toString());
    
    const availLicenses = allLicenses.filter(license => 
      license.usedSeats < license.seats || userAssignedLicenseIds.includes(license.id)
    );
    
    setAvailableLicenses(availLicenses);
  };

  const handleLicenseToggle = (licenseId: string) => {
    setSelectedLicenses(prev => {
      if (prev.includes(licenseId)) {
        return prev.filter(id => id !== licenseId);
      } else {
        return [...prev, licenseId];
      }
    });
  };

  const handleLicenseTypeChange = (type: string) => {
    setLicenseType(type);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Assign licenses to user using data service
      assignLicensesToUser(user.id, selectedLicenses);
      
      // Close dialog
      onOpenChange(false);

      // Call callback if provided
      if (onLicensesUpdated) {
        onLicensesUpdated();
      }

      // Show success toast
      toast({
        title: "Licenses Updated",
        description: `License assignments for ${user.name} have been updated.`,
      });
    } catch (error) {
      console.error("Error assigning licenses:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to assign licenses",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter licenses by department and license type
  const filteredLicenses = availableLicenses.filter(license => {
    const matchesDepartment = department 
      ? license.department === department || license.department === "All"
      : true;
      
    const matchesType = licenseType !== "all" 
      ? license.type === licenseType
      : true;
      
    return matchesDepartment && matchesType;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Licenses</DialogTitle>
          <DialogDescription>
            {user ? `Manage license assignments for ${user.name}` : "Loading user data..."}
          </DialogDescription>
        </DialogHeader>

        {user ? (
          <>
            <div className="py-4">
              <div className="mb-4">
                <Label>Department</Label>
                <p className="text-sm text-muted-foreground">{user.department}</p>
              </div>

              <div className="mb-4">
                <Label className="mb-2 block">Filter by license type</Label>
                <Select
                  value={licenseType}
                  onValueChange={handleLicenseTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Subscription">Subscription</SelectItem>
                    <SelectItem value="User-based">User-based</SelectItem>
                    <SelectItem value="Perpetual">Perpetual</SelectItem>
                    <SelectItem value="Device-based">Device-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Label className="mb-2 block">
                Available Licenses ({filteredLicenses.length})
              </Label>
              <ScrollArea className="h-[200px] border rounded-md p-2">
                {filteredLicenses.length > 0 ? (
                  <div className="space-y-2">
                    {filteredLicenses.map((license) => (
                      <div
                        key={license.id}
                        className="flex items-center space-x-2 py-2 border-b last:border-0"
                      >
                        <Checkbox
                          id={`license-${license.id}`}
                          checked={selectedLicenses.includes(license.id)}
                          onCheckedChange={() => handleLicenseToggle(license.id)}
                        />
                        <div className="grid gap-1.5">
                          <Label
                            htmlFor={`license-${license.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {license.name} ({license.vendor})
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {license.usedSeats}/{license.seats} seats used • {license.department} • {license.type}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">
                      {licenseType !== "all" || department 
                        ? "No matching licenses found. Try changing your filters."
                        : "No available licenses found."}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Assignments"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-8 flex justify-center">Loading...</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssignLicenseDialog; 
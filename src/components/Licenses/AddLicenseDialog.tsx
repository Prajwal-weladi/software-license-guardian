
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { licenses } from "@/data/mockData";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface AddLicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddLicenseDialog = ({ open, onOpenChange }: AddLicenseDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    vendor: "",
    type: "subscription",
    seats: "",
    department: "",
    cost: "",
    startDate: "",
    expiryDate: "",
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.vendor || !formData.type || !formData.seats || !formData.department) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Create new license object
    const newLicense = {
      id: `license-${Date.now()}`,
      name: formData.name,
      vendor: formData.vendor,
      type: formData.type,
      seats: parseInt(formData.seats),
      usedSeats: 0, // New licenses start with 0 used seats
      department: formData.department,
      cost: formData.cost ? parseFloat(formData.cost) : 0,
      purchaseDate: formData.startDate || new Date().toISOString().split('T')[0],
      expiryDate: formData.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      notes: formData.notes || null,
      assignedUsers: []
    };
    
    // Add to the licenses array
    licenses.unshift(newLicense);
    
    toast({
      title: "License added",
      description: "The license has been successfully added to inventory"
    });
    
    // Reset form and close dialog
    setFormData({
      name: "",
      vendor: "",
      type: "subscription",
      seats: "",
      department: "",
      cost: "",
      startDate: "",
      expiryDate: "",
      notes: ""
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New License</DialogTitle>
          <DialogDescription>
            Enter the details of the software license you want to add.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">License Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Adobe Creative Cloud"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor/Publisher *</Label>
              <Input
                id="vendor"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                placeholder="e.g. Adobe"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">License Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="perpetual">Perpetual</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="floating">Floating</SelectItem>
                  <SelectItem value="site">Site License</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seats">Number of Seats *</Label>
              <Input
                id="seats"
                name="seats"
                type="number"
                min="1"
                value={formData.seats}
                onChange={handleChange}
                placeholder="e.g. 25"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleSelectChange("department", value)}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cost">Annual Cost</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={handleChange}
                placeholder="e.g. 5000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative">
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <div className="relative">
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleChange}
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information about this license"
              className="min-h-[80px]"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add License</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLicenseDialog;

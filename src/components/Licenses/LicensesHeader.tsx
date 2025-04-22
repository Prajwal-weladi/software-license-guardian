
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { useState } from "react";
import AddLicenseDialog from "./AddLicenseDialog";

interface LicensesHeaderProps {
  onLicenseAdded?: () => void;
}

const LicensesHeader = ({ onLicenseAdded }: LicensesHeaderProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleDialogOpenChange = (open: boolean) => {
    setShowAddDialog(open);
    if (!open && onLicenseAdded) {
      // If dialog is being closed, trigger the license refresh
      onLicenseAdded();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">License Inventory</h1>
        <p className="text-muted-foreground">
          Manage and track all your software licenses in one place
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button size="sm" onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add License
        </Button>
      </div>
      
      <AddLicenseDialog 
        open={showAddDialog} 
        onOpenChange={handleDialogOpenChange} 
      />
    </div>
  );
};

export default LicensesHeader;


import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { useState } from "react";
import AddLicenseDialog from "./AddLicenseDialog";

const LicensesHeader = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);

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
        onOpenChange={setShowAddDialog} 
      />
    </div>
  );
};

export default LicensesHeader;

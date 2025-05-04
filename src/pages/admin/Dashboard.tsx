import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import LicenseSummary from "@/components/Dashboard/LicenseSummary";
import ExpiringLicenses from "@/components/Dashboard/ExpiringLicenses";
import UsageChart from "@/components/Dashboard/UsageChart";
import CostBreakdown from "@/components/Dashboard/CostBreakdown";
import LicenseCard from "@/components/Dashboard/LicenseCard";
import LicenseUsageCard from "@/components/Dashboard/LicenseUsageCard";
import { License } from "@/data/mockData";
import { getLicenses } from "@/services/dataService";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const AdminDashboard = () => {
  // State for the selected license and licenses data
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [licenses, setLicenses] = useState<License[]>([]);
  
  // Load licenses when component mounts
  useEffect(() => {
    loadLicenses();
  }, []);
  
  // Function to load licenses
  const loadLicenses = () => {
    const loadedLicenses = getLicenses();
    setLicenses(loadedLicenses);
  };
  
  // Get 3 recent licenses to display
  const recentLicenses = [...licenses]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 3);

  // Handler to select a license
  const handleLicenseSelect = (license: License) => {
    setSelectedLicense(license);
  };

  // Handler to clear the selection
  const handleClearSelection = () => {
    setSelectedLicense(null);
  };

  return (
    <DashboardLayout>
      <DashboardHeader />
      
      <div className="space-y-6">
        {selectedLicense && (
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">
              Viewing details for selected license
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearSelection}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear selection
            </Button>
          </div>
        )}
        
        <LicenseSummary selectedLicense={selectedLicense} />
        
        {/* Always show charts but pass selectedLicense to them */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UsageChart selectedLicense={selectedLicense} />
          <CostBreakdown selectedLicense={selectedLicense} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Recent Licenses</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recentLicenses.map((license) => (
                <LicenseCard 
                  key={license.id} 
                  license={license} 
                  onSelectLicense={handleLicenseSelect}
                  isSelected={selectedLicense?.id === license.id}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Expiring Soon</h2>
              <ExpiringLicenses onSelectLicense={handleLicenseSelect} />
            </div>
            
            <div>
              <LicenseUsageCard />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard; 
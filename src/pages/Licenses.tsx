import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import LicensesHeader from "@/components/Licenses/LicensesHeader";
import LicensesTable from "@/components/Licenses/LicensesTable";
import LicenseDetailsPanel from "@/components/Licenses/LicenseDetailsPanel";
import { License } from "@/data/mockData";
import { getLicenses } from "@/services/dataService"; // Import from data service
import { useToast } from "@/hooks/use-toast";

const Licenses = () => {
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [licenses, setLicenses] = useState<License[]>([]); // Add state for licenses
  const { toast } = useToast();
  
  // Load licenses when component mounts or refreshTrigger changes
  useEffect(() => {
    loadLicenses();
  }, [refreshTrigger]);
  
  // Function to load licenses from the data service
  const loadLicenses = () => {
    const loadedLicenses = getLicenses();
    setLicenses(loadedLicenses);
    
    // If we have a selected license, update it with the latest data
    if (selectedLicense) {
      const updatedSelectedLicense = loadedLicenses.find(
        license => license.id === selectedLicense.id
      );
      if (updatedSelectedLicense) {
        setSelectedLicense(updatedSelectedLicense);
      }
    }
  };

  const handleLicenseSelect = (license: License) => {
    setSelectedLicense(license);
    setDetailsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setDetailsPanelOpen(false);
  };

  const refreshLicenses = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <DashboardLayout>
      <LicensesHeader onLicenseAdded={refreshLicenses} />
      <div className="flex flex-col md:flex-row gap-6">
        <div className={`flex-1 ${detailsPanelOpen ? 'md:w-2/3' : 'w-full'}`}>
          <LicensesTable 
            licenses={licenses} // Pass licenses as a prop
            onSelectLicense={handleLicenseSelect} 
          />
        </div>
        
        {detailsPanelOpen && (
          <div className="md:w-1/3">
            <LicenseDetailsPanel 
              license={selectedLicense} 
              onClose={handleClosePanel} 
              onLicenseUpdated={refreshLicenses} // Add this prop
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Licenses;

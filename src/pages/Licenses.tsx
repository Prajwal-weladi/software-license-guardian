
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import LicensesHeader from "@/components/Licenses/LicensesHeader";
import LicensesTable from "@/components/Licenses/LicensesTable";
import LicenseDetailsPanel from "@/components/Licenses/LicenseDetailsPanel";
import { License, licenses } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const Licenses = () => {
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

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
          <LicensesTable onSelectLicense={handleLicenseSelect} key={refreshTrigger} />
        </div>
        
        {detailsPanelOpen && (
          <div className="md:w-1/3">
            <LicenseDetailsPanel 
              license={selectedLicense} 
              onClose={handleClosePanel} 
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Licenses;


import { useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import LicensesHeader from "@/components/Licenses/LicensesHeader";
import LicensesTable from "@/components/Licenses/LicensesTable";
import LicenseDetailsPanel from "@/components/Licenses/LicenseDetailsPanel";
import { License } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const Licenses = () => {
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  const { toast } = useToast();

  const handleLicenseSelect = (license: License) => {
    setSelectedLicense(license);
    setDetailsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setDetailsPanelOpen(false);
  };

  return (
    <DashboardLayout>
      <LicensesHeader />
      <div className="flex flex-col md:flex-row gap-6">
        <div className={`flex-1 ${detailsPanelOpen ? 'md:w-2/3' : 'w-full'}`}>
          <LicensesTable onSelectLicense={handleLicenseSelect} />
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

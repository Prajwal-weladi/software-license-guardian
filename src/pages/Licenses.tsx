import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import LicensesHeader from "@/components/Licenses/LicensesHeader";
import LicensesTable from "@/components/Licenses/LicensesTable";
import LicenseDetailsPanel from "@/components/Licenses/LicenseDetailsPanel";
import { License } from "@/data/mockData";
import { getLicenses, deleteLicense, updateLicenseSeats } from "@/services/dataService"; // Import from data service
import { useToast } from "@/hooks/use-toast";

const Licenses = () => {
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [licenses, setLicenses] = useState<License[]>([]); // Add state for licenses
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // Load licenses when component mounts or refreshTrigger changes
  useEffect(() => {
    loadLicenses();
  }, [refreshTrigger]);

  // Check for license ID in URL params when component mounts
  useEffect(() => {
    const licenseId = searchParams.get('id');
    if (licenseId) {
      const loadedLicenses = getLicenses();
      const licenseFromUrl = loadedLicenses.find(license => license.id === licenseId);
      if (licenseFromUrl) {
        setSelectedLicense(licenseFromUrl);
        setDetailsPanelOpen(true);
      }
    }
  }, [searchParams]);

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

  // Handle license deletion
  const handleDeleteLicense = (licenseId: string) => {
    try {
      // If the license being deleted is currently selected, close the details panel
      if (selectedLicense && selectedLicense.id === licenseId) {
        setDetailsPanelOpen(false);
        setSelectedLicense(null);
      }

      // Delete the license
      deleteLicense(licenseId);

      // Update license seat counts
      updateLicenseSeats();

      // Refresh the licenses list
      refreshLicenses();

      // Show success toast
      toast({
        title: "License Deleted",
        description: "The license has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting license:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the license. Please try again.",
      });
    }
  };

  return (
    <DashboardLayout>
      <LicensesHeader onLicenseAdded={refreshLicenses} />
      <div className="flex flex-col md:flex-row gap-6">
        <div className={`flex-1 ${detailsPanelOpen ? 'md:w-2/3' : 'w-full'}`}>
          <LicensesTable
            licenses={licenses}
            onSelectLicense={handleLicenseSelect}
            onDeleteLicense={handleDeleteLicense}
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

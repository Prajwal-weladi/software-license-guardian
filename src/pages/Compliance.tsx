import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Upload, Eye, AlertTriangle, CheckCircle, Shield } from "lucide-react";
import { License } from "@/data/mockData";
import { getLicenses, updateLicense } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";
import DocumentUploadDialog from "@/components/Compliance/DocumentUploadDialog";
import DocumentViewDialog from "@/components/Compliance/DocumentViewDialog";

const Compliance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [licenses, setLicenses] = useState<License[]>([]);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  // Load licenses when component mounts or refresh is triggered
  useEffect(() => {
    loadLicenses();
  }, [refreshTrigger]);

  // Load licenses from the data service
  const loadLicenses = () => {
    const loadedLicenses = getLicenses();
    setLicenses(loadedLicenses);
  };

  // Filter licenses based on search
  const filteredLicenses = licenses.filter(license =>
    license.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    license.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    license.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle opening the upload dialog
  const handleUploadClick = (license: License) => {
    setSelectedLicense(license);
    setIsUploadDialogOpen(true);
  };

  // Handle opening the view dialog
  const handleViewClick = (license: License) => {
    setSelectedLicense(license);
    setIsViewDialogOpen(true);
  };

  // Handle document upload completion
  const handleDocumentUploaded = () => {
    // Refresh the licenses list
    setRefreshTrigger(prev => prev + 1);

    // If we have a selected license, refresh it with the updated data
    if (selectedLicense) {
      const updatedLicenses = getLicenses();
      const updatedLicense = updatedLicenses.find(lic => lic.id === selectedLicense.id);
      if (updatedLicense) {
        setSelectedLicense(updatedLicense);
      }
    }
  };

  // Get compliance status for a license
  const getComplianceStatus = (license: License) => {
    // Check if the license has documents
    if (license.documents && license.documents.length > 0) {
      return "compliant";
    } else {
      return "non-compliant";
    }
  };

  // Get badge variant based on compliance status
  const getComplianceBadgeVariant = (status: string) => {
    switch (status) {
      case "compliant":
        return "success";
      case "non-compliant":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Compliance Management</h1>
          <p className="text-muted-foreground">
            Manage compliance documentation for your software licenses
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>License Compliance</CardTitle>
              <CardDescription>
                Upload and manage compliance documentation for your licenses
              </CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search licenses..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>License</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Compliance Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLicenses.length > 0 ? (
                filteredLicenses.map(license => {
                  const complianceStatus = getComplianceStatus(license);
                  return (
                    <TableRow key={license.id}>
                      <TableCell>
                        <div className="font-medium">{license.name}</div>
                      </TableCell>
                      <TableCell>{license.vendor}</TableCell>
                      <TableCell>{license.department}</TableCell>
                      <TableCell>{license.expiryDate}</TableCell>
                      <TableCell>
                        <Badge variant={getComplianceBadgeVariant(complianceStatus)}>
                          {complianceStatus === "compliant" ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <AlertTriangle className="mr-1 h-3 w-3" />
                          )}
                          {complianceStatus === "compliant" ? "Compliant" : "Non-compliant"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUploadClick(license)}
                          >
                            <Upload className="mr-1 h-4 w-4" />
                            Upload
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewClick(license)}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Shield className="h-10 w-10 mb-2" />
                      <p>No licenses found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedLicense && (
        <>
          <DocumentUploadDialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
            license={selectedLicense}
            onDocumentUploaded={handleDocumentUploaded}
          />
          <DocumentViewDialog
            open={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
            license={selectedLicense}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default Compliance;

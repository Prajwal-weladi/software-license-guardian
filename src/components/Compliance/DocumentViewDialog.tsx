import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { License } from "@/data/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { File, Download, Eye, Trash2 } from "lucide-react";
import { updateLicense } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";

interface DocumentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  license: License;
}

const DocumentViewDialog = ({
  open,
  onOpenChange,
  license
}: DocumentViewDialogProps) => {
  const { toast } = useToast();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debug: Log license documents when dialog opens
  useEffect(() => {
    if (open && license) {
      console.log("DocumentViewDialog opened with license:", license.name);
      console.log("Documents available:", license.documents?.length || 0);
      if (license.documents && license.documents.length > 0) {
        console.log("First document:", license.documents[0]);
        console.log("First document dataUrl exists:", !!license.documents[0].dataUrl);
        console.log("First document dataUrl length:", license.documents[0].dataUrl?.length || 0);

        // Auto-select the first document when dialog opens
        if (!selectedDocumentId && license.documents.length > 0) {
          const firstDoc = license.documents[0];
          console.log("Auto-selecting first document:", firstDoc.name);
          // We'll set the ID and URL directly instead of calling handlePreview to avoid the dependency issue
          setSelectedDocumentId(firstDoc.id);
          if (firstDoc.dataUrl) {
            setPreviewUrl(firstDoc.dataUrl);
            console.log("Preview URL set for document:", firstDoc.name);
          }
        }
      }
    }
  }, [open, license]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedDocumentId(null);
      setPreviewUrl(null);
    }
  }, [open]);

  // Handle document preview
  const handlePreview = (documentId: string) => {
    if (!license.documents) {
      console.log("No documents available for this license");
      return;
    }

    const document = license.documents.find(doc => doc.id === documentId);
    console.log("Selected document:", document?.name, "Has dataUrl:", !!document?.dataUrl);

    if (document && document.dataUrl) {
      setSelectedDocumentId(documentId);
      setPreviewUrl(document.dataUrl);
      console.log("Preview URL set for document:", document.name);
    } else {
      setSelectedDocumentId(documentId);
      setPreviewUrl(null);
      console.log("Document found but no dataUrl available");

      toast({
        title: "Preview Unavailable",
        description: "The document data is not available for preview.",
        variant: "destructive"
      });
    }
  };

  // Handle document download
  const handleDownload = (documentId: string) => {
    if (!license.documents) {
      console.log("No documents available for this license");
      return;
    }

    const document = license.documents.find(doc => doc.id === documentId);
    console.log("Attempting to download document:", document?.name);

    if (document && document.dataUrl) {
      try {
        const link = document.dataUrl;
        const a = document.createElement('a');
        a.href = link;
        a.download = document.name || 'document';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log("Document download initiated");
      } catch (error) {
        console.error("Error downloading document:", error);
        toast({
          title: "Download Failed",
          description: "There was an error downloading the document.",
          variant: "destructive"
        });
      }
    } else {
      console.log("Document found but no dataUrl available for download");
      toast({
        title: "Download Unavailable",
        description: "The document data is not available for download.",
        variant: "destructive"
      });
    }
  };

  // Handle document deletion
  const handleDelete = (documentId: string) => {
    if (!license.documents) return;

    setIsDeleting(true);

    // Simulate deletion delay
    setTimeout(() => {
      try {
        // Create a copy of the license
        const updatedLicense = { ...license };

        // Filter out the document to delete
        updatedLicense.documents = updatedLicense.documents?.filter(
          doc => doc.id !== documentId
        ) || [];

        // Update the license in the data service
        updateLicense(updatedLicense);

        // Reset preview if the deleted document was being previewed
        if (selectedDocumentId === documentId) {
          setSelectedDocumentId(null);
          setPreviewUrl(null);
        }

        toast({
          title: "Document Deleted",
          description: "The document has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting document:", error);
        toast({
          title: "Deletion Failed",
          description: "There was an error deleting the document.",
          variant: "destructive"
        });
      } finally {
        setIsDeleting(false);
      }
    }, 500);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get document icon based on file type
  const getDocumentIcon = (type: string) => {
    if (type.includes('pdf')) {
      return <File className="h-5 w-5 text-red-500" />;
    } else if (type.includes('word') || type.includes('doc')) {
      return <File className="h-5 w-5 text-blue-500" />;
    } else if (type.includes('image')) {
      return <File className="h-5 w-5 text-green-500" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Compliance Documents</DialogTitle>
          <DialogDescription>
            View and manage compliance documents for {license.name}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-4 overflow-hidden flex-1">
          <div className="md:w-1/2 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {license.documents && license.documents.length > 0 ? (
                  license.documents.map(doc => (
                    <TableRow key={doc.id} className={selectedDocumentId === doc.id ? "bg-muted/50" : ""}>
                      <TableCell>
                        <div className="flex items-center">
                          {getDocumentIcon(doc.type)}
                          <div className="ml-2">
                            <div className="font-medium truncate max-w-[150px]">{doc.name}</div>
                            <div className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePreview(doc.id)}
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(doc.id)}
                            className="h-8 w-8"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(doc.id)}
                            className="h-8 w-8 text-destructive"
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6">
                      <p className="text-muted-foreground">No documents available</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="md:w-1/2 overflow-hidden flex flex-col">
            <Card className="h-full flex flex-col">
              <CardContent className="p-4 flex-1 overflow-hidden">
                {selectedDocumentId ? (
                  <div className="h-full flex flex-col">
                    <div className="text-sm font-medium mb-2">
                      {license.documents?.find(doc => doc.id === selectedDocumentId)?.name}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      {previewUrl ? (
                        previewUrl.startsWith('data:image') ? (
                          <img
                            src={previewUrl}
                            alt="Document preview"
                            className="max-w-full max-h-full object-contain mx-auto"
                          />
                        ) : previewUrl.startsWith('data:application/pdf') ? (
                          <div className="h-full flex items-center justify-center bg-muted/30 rounded-md">
                            <div className="text-center p-4">
                              <File className="h-10 w-10 text-red-500 mx-auto mb-2" />
                              <p className="text-sm">PDF document preview not available</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => handleDownload(selectedDocumentId)}
                              >
                                <Download className="mr-1 h-4 w-4" />
                                Download to view
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center bg-muted/30 rounded-md">
                            <div className="text-center p-4">
                              <File className="h-10 w-10 text-primary mx-auto mb-2" />
                              <p className="text-sm">Document preview not available</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => handleDownload(selectedDocumentId)}
                              >
                                <Download className="mr-1 h-4 w-4" />
                                Download to view
                              </Button>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="h-full flex items-center justify-center bg-muted/30 rounded-md">
                          <div className="text-center p-4">
                            <File className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                            <p className="text-sm">Document data not available</p>
                            <p className="text-xs text-muted-foreground mt-1">The document may be corrupted or not properly uploaded</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {license.documents?.find(doc => doc.id === selectedDocumentId)?.description && (
                      <div className="mt-2 p-2 bg-muted/30 rounded-md text-sm">
                        <p className="font-medium text-xs mb-1">Description:</p>
                        <p>{license.documents?.find(doc => doc.id === selectedDocumentId)?.description}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center bg-muted/30 rounded-md">
                    <div className="text-center p-4">
                      <File className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Select a document to preview</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // Refresh the document data
                if (selectedDocumentId) {
                  console.log("Refreshing document view for:", selectedDocumentId);
                  handlePreview(selectedDocumentId);
                }
              }}
            >
              Refresh
            </Button>
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewDialog;

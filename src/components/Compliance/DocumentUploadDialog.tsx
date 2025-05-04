import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { updateLicense, getLicenses, saveLicenses } from "@/services/dataService";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { License } from "@/data/mockData";
import { Upload, File, X } from "lucide-react";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  license: License;
  onDocumentUploaded: () => void;
}

interface Document {
  id: string;
  name: string;
  description: string;
  type: string;
  size: number;
  uploadDate: string;
  file: File | null;
  dataUrl?: string;
}

const DocumentUploadDialog = ({
  open,
  onOpenChange,
  license,
  onDocumentUploaded
}: DocumentUploadDialogProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [document, setDocument] = useState<Document>({
    id: "",
    name: "",
    description: "",
    type: "",
    size: 0,
    uploadDate: "",
    file: null,
    dataUrl: ""
  });
  const [isUploading, setIsUploading] = useState(false);

  // Maximum file size in bytes (500KB)
  const MAX_FILE_SIZE = 500 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed");

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("File selected:", file.name, "Type:", file.type, "Size:", file.size);

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        console.error("File too large:", file.size, "bytes");
        toast({
          title: "File Too Large",
          description: `The file size exceeds the maximum allowed size of ${formatFileSize(MAX_FILE_SIZE)}. Please select a smaller file.`,
          variant: "destructive"
        });

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Use FileReader to read the file
      const reader = new FileReader();

      reader.onload = (event) => {
        console.log("FileReader onload event fired");

        if (event.target && event.target.result) {
          const dataUrl = event.target.result as string;
          console.log("File read successfully, dataUrl length:", dataUrl.length);

          // Create new document object
          const newDocument = {
            id: Date.now().toString(),
            name: file.name,
            description: "",
            type: file.type,
            size: file.size,
            uploadDate: new Date().toISOString(),
            file: file,
            dataUrl: dataUrl
          };

          console.log("Setting document state with file data");
          setDocument(newDocument);
        } else {
          console.error("FileReader result is null or undefined");
          toast({
            title: "File Read Error",
            description: "Could not read the file. Please try again.",
            variant: "destructive"
          });
        }
      };

      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        toast({
          title: "File Read Error",
          description: "There was an error reading the file. Please try again.",
          variant: "destructive"
        });
      };

      console.log("Starting to read file as data URL");
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected or file selection canceled");
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDocument(prev => ({
      ...prev,
      description: e.target.value
    }));
  };

  const handleClearFile = () => {
    setDocument({
      id: "",
      name: "",
      description: "",
      type: "",
      size: 0,
      uploadDate: "",
      file: null,
      dataUrl: ""
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit handler called");

    if (!document.file) {
      console.log("No file selected");
      toast({
        title: "No file selected",
        description: "Please select a document to upload",
        variant: "destructive"
      });
      return;
    }

    console.log("File selected:", document.file.name);

    if (!document.dataUrl) {
      console.log("No dataUrl available");
      toast({
        title: "Upload Error",
        description: "Document data is not available. Please try selecting the file again.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      console.log("Creating document object to save");

      // Create a document object to save (without the file property which can't be serialized)
      const newDocument = {
        id: document.id,
        name: document.name,
        description: document.description,
        type: document.type,
        size: document.size,
        uploadDate: document.uploadDate,
        dataUrl: document.dataUrl
      };

      console.log("Document prepared for saving:", newDocument.name, "Type:", newDocument.type);

      // Get current licenses
      const licenses = getLicenses();

      // Find the license to update
      const licenseToUpdate = licenses.find(lic => lic.id === license.id);

      if (!licenseToUpdate) {
        throw new Error("License not found");
      }

      // Initialize documents array if it doesn't exist
      if (!licenseToUpdate.documents) {
        licenseToUpdate.documents = [];
      }

      // Add the new document
      licenseToUpdate.documents.push(newDocument);
      console.log("Document added to license:", license.name);

      // Save the updated licenses
      saveLicenses(licenses);
      console.log("Licenses saved to localStorage");

      // Call the callback to refresh the UI
      onDocumentUploaded();

      // Show success toast
      toast({
        title: "Document Uploaded",
        description: `${document.name} has been successfully uploaded.`,
      });

      // Reset form and close dialog
      handleClearFile();
      onOpenChange(false);

    } catch (error) {
      console.error("Error uploading document:", error);

      // Check if it's a storage quota error
      if (error instanceof DOMException &&
          (error.name === 'QuotaExceededError' ||
           error.message.includes('quota'))) {

        toast({
          title: "Storage Limit Exceeded",
          description: "The file is too large to store. Please use a smaller file.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Upload Failed",
          description: "There was an error uploading the document. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Upload Compliance Document</DialogTitle>
          <DialogDescription>
            Upload a compliance document for {license.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                id="document-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.txt"
              />

              {!document.file ? (
                <label htmlFor="document-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mb-1">
                    JPG, JPEG, PNG, PDF, TXT
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: 500KB
                  </p>
                </label>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center">
                      <File className="h-8 w-8 text-primary mr-2" />
                      <div className="text-left">
                        <p className="text-sm font-medium truncate max-w-[300px]">{document.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(document.size)}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFile}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {document.file && (
              <div className="space-y-2">
                <Label htmlFor="description">Document Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter a description for this document"
                  value={document.description}
                  onChange={handleDescriptionChange}
                  rows={3}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!document.file || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;


import { useState } from "react";
import { licenses } from "@/data/mockData";
import { formatCurrency, formatDate, calculateDaysRemaining, getStatusColor } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Info, Search, FileText } from "lucide-react";

interface LicensesTableProps {
  onSelectLicense: (license: any) => void;
}

const LicensesTable = ({ onSelectLicense }: LicensesTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  
  // Get unique departments for filter
  const departments = Array.from(new Set(licenses.map(license => license.department)));
  
  // Filter licenses based on search and filters
  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = 
      license.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      license.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || license.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || license.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <div className="rounded-md border">
      <div className="p-4 flex flex-col sm:flex-row gap-3 border-b">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search licenses..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expiring">Expiring Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLicenses.length > 0 ? (
              filteredLicenses.map((license) => {
                const daysRemaining = calculateDaysRemaining(license.expiryDate);
                let statusText = license.status;
                if (license.status === 'active' && daysRemaining <= 30) {
                  statusText = 'expiring';
                }
                
                return (
                  <TableRow key={license.id}>
                    <TableCell className="font-medium">{license.name}</TableCell>
                    <TableCell>{license.vendor}</TableCell>
                    <TableCell>{license.type}</TableCell>
                    <TableCell>
                      {license.usedSeats}/{license.seats}
                    </TableCell>
                    <TableCell>{license.department}</TableCell>
                    <TableCell>
                      <span className={daysRemaining <= 7 ? 'text-destructive' : ''}>
                        {formatDate(license.expiryDate)}
                      </span>
                    </TableCell>
                    <TableCell>{formatCurrency(license.cost)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(statusText)}>
                        {statusText === 'active' ? 'Active' : 
                         statusText === 'expiring' ? 'Expiring Soon' : 
                         statusText === 'expired' ? 'Expired' : statusText}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onSelectLicense(license)}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No licenses found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LicensesTable;

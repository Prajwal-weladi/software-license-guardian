
import { useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, User } from "lucide-react";

// Mock user data with license assignments
const mockUsers = [
  { 
    id: 1, 
    name: "John Doe", 
    email: "john.doe@example.com", 
    department: "Engineering", 
    assignedLicenses: [
      { id: 1, name: "Visual Studio Enterprise", status: "active" },
      { id: 2, name: "GitHub Enterprise", status: "active" }
    ]
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    email: "jane.smith@example.com", 
    department: "Marketing", 
    assignedLicenses: [
      { id: 3, name: "Adobe Creative Cloud", status: "active" },
      { id: 4, name: "Figma Professional", status: "active" }
    ]
  },
  { 
    id: 3, 
    name: "Robert Johnson", 
    email: "robert.johnson@example.com", 
    department: "Sales", 
    assignedLicenses: [
      { id: 5, name: "Salesforce Enterprise", status: "active" },
      { id: 6, name: "Zoom Business", status: "active" }
    ]
  },
  { 
    id: 4, 
    name: "Emily Davis", 
    email: "emily.davis@example.com", 
    department: "HR", 
    assignedLicenses: [
      { id: 7, name: "Workday HCM", status: "active" },
      { id: 8, name: "Microsoft 365 E3", status: "active" }
    ]
  },
  { 
    id: 5, 
    name: "Michael Wilson", 
    email: "michael.wilson@example.com", 
    department: "IT", 
    assignedLicenses: [
      { id: 9, name: "AWS Enterprise Support", status: "active" },
      { id: 10, name: "Microsoft 365 E5", status: "active" }
    ]
  }
];

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter users based on search
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users and their license assignments
          </p>
        </div>
        
        <Button size="sm" className="mt-4 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users & License Assignments</CardTitle>
              <CardDescription>
                View and manage users and their assigned software licenses
              </CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Assigned Licenses</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="bg-muted h-8 w-8 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.assignedLicenses.map(license => (
                        <Badge key={license.id} variant="outline" className="text-xs">
                          {license.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Manage</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Users;

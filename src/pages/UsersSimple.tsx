import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Trash2, Edit } from "lucide-react";
import AddUserDialog from "@/components/Users/AddUserDialog";
import AssignLicenseDialog from "@/components/Users/AssignLicenseDialog";
import { getUsers, deleteUser, updateLicenseSeats } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";

const UsersSimple = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  // Load users when component mounts or refresh is triggered
  useEffect(() => {
    loadUsers();
    console.log("Loading users...");
  }, [refreshTrigger]);

  // Load users from the data service
  const loadUsers = () => {
    try {
      const loadedUsers = getUsers();
      console.log("Loaded users:", loadedUsers);
      setUsers(loadedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users. Please try again.",
      });
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle adding a new user
  const handleUserAdded = (newUser: any) => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Open assign license dialog for a user
  const handleManageClick = (user: any) => {
    setSelectedUser(user);
    setIsAssignDialogOpen(true);
  };

  // Handle deleting a user
  const handleDeleteUser = (userId: number) => {
    deleteUser(userId);
    updateLicenseSeats();
    setRefreshTrigger(prev => prev + 1);

    toast({
      title: "User Deleted",
      description: "The user has been removed from the system.",
    });
  };

  // Handle license assignments updated
  const handleLicensesUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users and their license assignments
          </p>
        </div>

        <AddUserDialog onUserAdded={handleUserAdded} />
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
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
                        {user.assignedLicenses && user.assignedLicenses.length > 0 ? (
                          user.assignedLicenses.map((license: any) => (
                            <Badge
                              key={license.id}
                              variant="outline"
                              className={`text-xs ${
                                license.status === 'expired' ? 'text-destructive border-destructive/30' :
                                license.status === 'expiring' ? 'text-license-warning border-license-warning/30' :
                                'text-license-valid border-license-valid/30'
                              }`}
                            >
                              {license.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No licenses</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleManageClick(user)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for assigning licenses */}
      {selectedUser && (
        <AssignLicenseDialog
          open={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          user={selectedUser}
          onLicensesUpdated={handleLicensesUpdated}
        />
      )}
    </DashboardLayout>
  );
};

export default UsersSimple;

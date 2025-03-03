import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Pagination, PaginationContent, PaginationEllipsis, 
  PaginationItem, PaginationLink, PaginationNext, PaginationPrevious 
} from '@/components/ui/pagination';
import { 
  Search, MoreHorizontal, UserPlus, 
  Edit, Trash2, Shield, Mail 
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    email: '',
    first_name: '',
    last_name: '',
    company: '',
    role: 'user',
    isActive: true,
    inviteMethod: 'invite',
    password: ''
  });
  const [editUser, setEditUser] = useState({
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    companyName: '',
    workspaceId: '',
    role: 'user'
  });
  const [addingUser, setAddingUser] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
    fetchWorkspaces();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // First, get all users from auth.users
      const { data: authUsers, error: authError } = await supabase
        .from('profiles')
        .select('*');
      
      if (authError) {
        console.error('Error fetching user profiles:', authError);
        toast.error('Failed to load users: ' + authError.message);
        return;
      }
      
      // Log for debugging
      console.log('Fetched users:', authUsers);
      
      setUsers(authUsers || []);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast.error('An unexpected error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*');
      
      if (error) {
        console.error('Error fetching workspaces:', error);
        return;
      }
      
      setWorkspaces(data || []);
    } catch (error) {
      console.error('Error in fetchWorkspaces:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleAddUser = async () => {
    try {
      if (!newUser.email || !newUser.first_name || !newUser.last_name) {
        toast.error('Email, first name, and last name are required');
        return;
      }

      if (newUser.inviteMethod === 'password' && !newUser.password) {
        toast.error('Password is required when creating user with password');
        return;
      }

      setAddingUser(true);

      // Create the user in Supabase Auth
      let userData;
      
      if (newUser.inviteMethod === 'password') {
        // Create user with password
        const { data, error } = await supabase.auth.admin.createUser({
          email: newUser.email,
          password: newUser.password,
          email_confirm: true,
          user_metadata: {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            company: newUser.company,
            role: newUser.role
          }
        });
        
        if (error) throw error;
        userData = data.user;
        
      } else {
        // Send invitation email
        const { data, error } = await supabase.auth.admin.inviteUserByEmail(newUser.email, {
          data: {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            company: newUser.company,
            role: newUser.role
          }
        });
        
        if (error) throw error;
        userData = data.user;
      }

      // Create or update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userData.id,
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          company: newUser.company,
          role: newUser.role,
          isActive: newUser.isActive
        });

      if (profileError) {
        throw profileError;
      }

      // Add to admin_users table if role is admin
      if (newUser.role === 'admin') {
        const { error: adminError } = await supabase
          .from('admin_users')
          .insert({ id: userData.id });

        if (adminError) {
          console.error('Error adding user to admin_users:', adminError);
        }
      }

      toast.success(
        newUser.inviteMethod === 'invite' 
          ? 'Invitation sent successfully!' 
          : 'User created successfully!'
      );
      
      setIsAddUserOpen(false);
      setNewUser({
        email: '',
        first_name: '',
        last_name: '',
        company: '',
        role: 'user',
        isActive: true,
        inviteMethod: 'invite',
        password: ''
      });
      
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error(`Failed to create user: ${error.message}`);
    } finally {
      setAddingUser(false);
    }
  };

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    setEditUser({
      id: user.id,
      email: user.email,
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      companyName: user.company_name || '',
      role: user.is_admin ? 'admin' : 'user',
      isActive: user.is_active !== false
    });
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      // Update user metadata
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        editUser.id,
        {
          user_metadata: {
            first_name: editUser.firstName,
            last_name: editUser.lastName,
            company_name: editUser.companyName
          }
        }
      );

      if (updateError) {
        throw updateError;
      }

      // Handle role change
      if (editUser.role === 'admin') {
        // Add admin role if not already present
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: editUser.id,
            role: 'admin'
          });

        if (roleError) {
          throw roleError;
        }
      } else {
        // Remove admin role if present
        const { error: roleError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', editUser.id)
          .eq('role', 'admin');

        if (roleError) {
          throw roleError;
        }
      }

      toast.success('User updated successfully!');
      setIsEditUserOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user');
      console.error('Update user error:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const { error } = await supabase.auth.admin.deleteUser(userId);

        if (error) {
          throw error;
        }

        toast.success('User deleted successfully!');
        fetchUsers();
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete user');
        console.error('Delete user error:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with the following details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  className="col-span-3"
                  placeholder="user@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="first-name" className="text-right">
                  First Name
                </Label>
                <Input
                  id="first-name"
                  className="col-span-3"
                  value={newUser.first_name}
                  onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="last-name" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="last-name"
                  className="col-span-3"
                  value={newUser.last_name}
                  onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  Company
                </Label>
                <Input
                  id="company"
                  className="col-span-3"
                  value={newUser.company}
                  onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger id="role" className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="invite-method" className="text-right">
                  Invite Method
                </Label>
                <Select 
                  value={newUser.inviteMethod} 
                  onValueChange={(value) => setNewUser({ ...newUser, inviteMethod: value })}
                >
                  <SelectTrigger id="invite-method" className="col-span-3">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invite">Send Invitation Email</SelectItem>
                    <SelectItem value="password">Create Password</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {newUser.inviteMethod === 'password' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    className="col-span-3"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </div>
              )}
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Active
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={newUser.isActive}
                    onCheckedChange={(checked) => setNewUser({ ...newUser, isActive: checked })}
                  />
                  <Label htmlFor="isActive" className="text-sm text-muted-foreground">
                    User can access the platform
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <UserPlus className="h-8 w-8 mb-2" />
                    <p>No users found</p>
                    {searchQuery && (
                      <Button 
                        variant="link" 
                        onClick={() => setSearchQuery('')}
                        className="mt-2"
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.company_name || '-'}</TableCell>
                  <TableCell>
                    {user.is_admin ? (
                      <Badge variant="default" className="bg-purple-500">Admin</Badge>
                    ) : (
                      <Badge variant="outline">User</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.is_active !== false ? (
                      <Badge variant="default" className="bg-green-500">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-500 border-red-500">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditClick(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber;
            if (totalPages <= 5) {
              pageNumber = i + 1;
            } else if (currentPage <= 3) {
              pageNumber = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + i;
            } else {
              pageNumber = currentPage - 2 + i;
            }
            
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  isActive={currentPage === pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  disabled={loading}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || loading}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editUser.email}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="edit-firstName"
                  value={editUser.firstName}
                  onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="edit-lastName"
                  value={editUser.lastName}
                  onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-companyName" className="text-right">
                  Company
                </Label>
                <Input
                  id="edit-companyName"
                  value={editUser.companyName}
                  onChange={(e) => setEditUser({ ...editUser, companyName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Role
                </Label>
                <Select
                  value={editUser.role}
                  onValueChange={(value) => setEditUser({ ...editUser, role: value })}
                >
                  <SelectTrigger id="edit-role" className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-isActive" className="text-right">
                  Active
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="edit-isActive"
                    checked={editUser.isActive}
                    onCheckedChange={(checked) => setEditUser({ ...editUser, isActive: checked })}
                  />
                  <Label htmlFor="edit-isActive" className="text-sm text-muted-foreground">
                    User can access the platform
                  </Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagement; 
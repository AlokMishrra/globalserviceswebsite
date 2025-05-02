import { useState } from "react";
import { useUsers, UserWithoutPassword, UserFormValues } from "@/hooks/use-users";

import AdminLayout from "@/components/layout/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Pencil, Plus, Trash } from "lucide-react";

// Available permissions for user management
const AVAILABLE_PERMISSIONS = [
  { id: "create_content", label: "Create Content" },
  { id: "edit_content", label: "Edit Content" },
  { id: "delete_content", label: "Delete Content" },
  { id: "manage_users", label: "Manage Users" },
  { id: "access_analytics", label: "Access Analytics" },
  { id: "publish_content", label: "Publish Content" },
  { id: "manage_settings", label: "Manage Settings" },
  { id: "view_dashboard", label: "View Dashboard" },
];

export default function AdminUsersPage() {
  const {
    users,
    isLoading,
    error,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
    useUserForm,
    userToFormValues,
  } = useUsers();

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithoutPassword | null>(null);

  // Form initialization
  const form = useUserForm();

  // Handle form submission
  const onSubmit = async (data: UserFormValues) => {
    try {
      if (isEditMode && selectedUser) {
        await updateUserMutation.mutateAsync({ id: selectedUser.id, data });
      } else {
        await createUserMutation.mutateAsync(data);
      }
      
      // Close dialog and reset form on success
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      // Error is handled in the mutation itself via toast
      console.error("Form submission error:", error);
    }
  };

  // Open dialog to create a new user
  const openCreateDialog = () => {
    setIsEditMode(false);
    form.reset(); // Reset to default values
    setIsDialogOpen(true);
  };

  // Open dialog to edit an existing user
  const openEditDialog = (user: UserWithoutPassword) => {
    setIsEditMode(true);
    setSelectedUser(user);
    
    // Convert user data to form values and set them
    const formValues = userToFormValues(user);
    Object.entries(formValues).forEach(([key, value]) => {
      form.setValue(key as keyof UserFormValues, value as any);
    });
    
    // Set empty password/confirmPassword for edit mode
    form.setValue('password', '');
    form.setValue('confirmPassword', '');
    
    setIsDialogOpen(true);
  };

  // Open confirmation dialog for user deletion
  const openDeleteDialog = (user: UserWithoutPassword) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Confirm user deletion
  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        await deleteUserMutation.mutateAsync(selectedUser.id);
        setIsDeleteDialogOpen(false);
      } catch (error) {
        // Error is handled in the mutation
        console.error("Delete error:", error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                Error loading users: {error.message}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No users found. Create your first user.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' 
                              ? 'bg-primary/10 text-primary' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {user.permissions && user.permissions.length > 0 
                            ? user.permissions.join(', ') 
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => openEditDialog(user)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => openDeleteDialog(user)}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md sm:max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit User" : "Create New User"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Update user details and permissions" 
                : "Add a new user to the system"}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isEditMode ? "New Password (leave blank to keep current)" : "Password"}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isEditMode ? "Confirm New Password" : "Confirm Password"}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Permissions</FormLabel>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {AVAILABLE_PERMISSIONS.map((permission) => (
                          <FormField
                            key={permission.id}
                            control={form.control}
                            name="permissions"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={permission.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(permission.id)}
                                      onCheckedChange={(checked) => {
                                        const permissions = field.value || [];
                                        if (checked) {
                                          field.onChange([...permissions, permission.id]);
                                        } else {
                                          field.onChange(
                                            permissions.filter(
                                              (value) => value !== permission.id
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {permission.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <DialogFooter className="mt-6 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createUserMutation.isPending || updateUserMutation.isPending}
                  >
                    {(createUserMutation.isPending || updateUserMutation.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEditMode ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      isEditMode ? "Update User" : "Create User"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user '{selectedUser?.username}'? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
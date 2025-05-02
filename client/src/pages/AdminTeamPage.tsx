import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { TableCell, TableRow, TableHeader, TableHead, Table, TableBody } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Pencil, Plus, X, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ImageUploader from '@/components/ImageUploader';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  imageUrl: string | null;
  socialLinks: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Form schema for team member form
const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  position: z.string().min(1, 'Position is required'),
  bio: z.string().min(1, 'Bio is required'),
  imageUrl: z.string().nullable().optional(),
  socialLinks: z.string().nullable().optional(),
  order: z.number().min(0, 'Order must be a positive number'),
  isActive: z.boolean().default(true),
});

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

const AdminTeamPage: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const { toast } = useToast();

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: '',
      position: '',
      bio: '',
      imageUrl: '',
      socialLinks: '',
      order: 0,
      isActive: true,
    },
  });

  // Query to fetch team members
  const { data: teamMembers = [], isLoading, error } = useQuery<TeamMember[]>({
    queryKey: ['/api/admin/team']
  });

  // Mutation to create a team member
  const createMutation = useMutation({
    mutationFn: async (data: TeamMemberFormValues) => {
      const response = await apiRequest('/api/admin/team', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/team'] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: 'Success',
        description: 'Team member created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create team member.',
        variant: 'destructive',
      });
    },
  });

  // Mutation to update a team member
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TeamMemberFormValues }) => {
      const response = await apiRequest(`/api/admin/team/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/team'] });
      setIsEditDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Team member updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update team member.',
        variant: 'destructive',
      });
    },
  });

  // Mutation to delete a team member
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/team/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/team'] });
      setIsDeleteDialogOpen(false);
      setSelectedMember(null);
      toast({
        title: 'Success',
        description: 'Team member deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete team member.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: TeamMemberFormValues) => {
    if (selectedMember) {
      updateMutation.mutate({ id: selectedMember.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    form.reset({
      name: member.name,
      position: member.position,
      bio: member.bio,
      imageUrl: member.imageUrl || '',
      socialLinks: member.socialLinks || '',
      order: member.order,
      isActive: member.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedMember) {
      deleteMutation.mutate(selectedMember.id);
    }
  };

  const handleAdd = () => {
    setSelectedMember(null);
    form.reset({
      name: '',
      position: '',
      bio: '',
      imageUrl: '',
      socialLinks: '',
      order: teamMembers.length,
      isActive: true,
    });
    setIsAddDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Team Members Management</h1>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus size={16} /> Add Team Member
          </Button>
        </div>

        {isLoading ? (
          <p>Loading team members...</p>
        ) : error ? (
          <p className="text-red-500">Error loading team members</p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team members information displayed on the website.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No team members found. Create one to get started.</TableCell>
                    </TableRow>
                  ) : (
                    teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.position}</TableCell>
                        <TableCell>{member.order}</TableCell>
                        <TableCell>
                          {member.isActive ? (
                            <span className="flex items-center text-green-600">
                              <CheckCircle size={16} className="mr-1" /> Active
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600">
                              <AlertCircle size={16} className="mr-1" /> Inactive
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleEdit(member)} title="Edit">
                              <Pencil size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDelete(member)} title="Delete">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Add Team Member Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>Add a new team member to your website.</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...form.register('name')} />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" {...form.register('position')} />
                  {form.formState.errors.position && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.position.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" {...form.register('bio')} />
                  {form.formState.errors.bio && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.bio.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input id="imageUrl" {...form.register('imageUrl')} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="socialLinks">Social Links (JSON format)</Label>
                  <Textarea 
                    id="socialLinks" 
                    {...form.register('socialLinks')} 
                    placeholder='{"linkedin": "https://linkedin.com/in/username", "twitter": "https://twitter.com/username"}'
                  />
                </div>
                <div className="col-span-1">
                  <Label htmlFor="order">Display Order</Label>
                  <Input 
                    id="order" 
                    type="number" 
                    {...form.register('order', { valueAsNumber: true })} 
                  />
                  {form.formState.errors.order && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.order.message}</p>
                  )}
                </div>
                <div className="col-span-1">
                  <div className="flex items-center h-full mt-8">
                    <Label htmlFor="isActive" className="mr-2">Is Active</Label>
                    <Switch 
                      id="isActive" 
                      checked={form.watch('isActive')} 
                      onCheckedChange={(checked) => form.setValue('isActive', checked)} 
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Team Member Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
              <DialogDescription>Update team member information.</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...form.register('name')} />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" {...form.register('position')} />
                  {form.formState.errors.position && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.position.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" {...form.register('bio')} />
                  {form.formState.errors.bio && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.bio.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input id="imageUrl" {...form.register('imageUrl')} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="socialLinks">Social Links (JSON format)</Label>
                  <Textarea 
                    id="socialLinks" 
                    {...form.register('socialLinks')} 
                    placeholder='{"linkedin": "https://linkedin.com/in/username", "twitter": "https://twitter.com/username"}'
                  />
                </div>
                <div className="col-span-1">
                  <Label htmlFor="order">Display Order</Label>
                  <Input 
                    id="order" 
                    type="number" 
                    {...form.register('order', { valueAsNumber: true })} 
                  />
                  {form.formState.errors.order && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.order.message}</p>
                  )}
                </div>
                <div className="col-span-1">
                  <div className="flex items-center h-full mt-8">
                    <Label htmlFor="isActive" className="mr-2">Is Active</Label>
                    <Switch 
                      id="isActive" 
                      checked={form.watch('isActive')} 
                      onCheckedChange={(checked) => form.setValue('isActive', checked)} 
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedMember?.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminTeamPage;
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, Pencil, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ImageUploader from '@/components/ImageUploader';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface CompanyInfo {
  id: number;
  title: string;
  content: string;
  section: string;
  subtitle: string | null;
  imageUrl: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Form schema for company info form
const companyInfoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  section: z.string().min(1, 'Section is required'),
  subtitle: z.string().nullable(),
  imageUrl: z.string().nullable(),
  order: z.number().min(0, 'Order must be a positive number'),
});

type CompanyInfoFormValues = z.infer<typeof companyInfoSchema>;

// Define common sections for company information
const COMPANY_SECTIONS = [
  { value: 'about', label: 'About Us' },
  { value: 'mission', label: 'Our Mission' },
  { value: 'vision', label: 'Our Vision' },
  { value: 'values', label: 'Our Values' },
  { value: 'history', label: 'Company History' },
  { value: 'process', label: 'Our Process' },
  { value: 'approach', label: 'Our Approach' },
  { value: 'testimonials', label: 'Testimonials' },
];

const AdminCompanyInfoPage: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<CompanyInfo | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<CompanyInfoFormValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      title: '',
      content: '',
      section: 'about',
      subtitle: null,
      imageUrl: null,
      order: 0,
    },
  });

  // Query to fetch company info
  const { data: companyInfo = [], isLoading, error } = useQuery<CompanyInfo[]>({
    queryKey: ['/api/admin/company-info']
  });

  // Filtered company info based on active filter
  const filteredCompanyInfo = activeFilter
    ? companyInfo.filter(info => info.section === activeFilter)
    : companyInfo;

  // Mutation to create company info
  const createMutation = useMutation({
    mutationFn: async (data: CompanyInfoFormValues) => {
      const response = await apiRequest('/api/admin/company-info', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/company-info'] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: 'Success',
        description: 'Company information created successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: 'Failed to create company information.',
        variant: 'destructive',
      });
    },
  });

  // Mutation to update company info
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CompanyInfoFormValues }) => {
      const response = await apiRequest(`/api/admin/company-info/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/company-info'] });
      setIsEditDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Company information updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: 'Failed to update company information.',
        variant: 'destructive',
      });
    },
  });

  // Mutation to delete company info
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/company-info/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/company-info'] });
      setIsDeleteDialogOpen(false);
      setSelectedInfo(null);
      toast({
        title: 'Success',
        description: 'Company information deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete company information.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: CompanyInfoFormValues) => {
    if (selectedInfo) {
      updateMutation.mutate({ id: selectedInfo.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (info: CompanyInfo) => {
    setSelectedInfo(info);
    form.reset({
      title: info.title,
      content: info.content,
      section: info.section,
      subtitle: info.subtitle,
      imageUrl: info.imageUrl,
      order: info.order,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (info: CompanyInfo) => {
    setSelectedInfo(info);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedInfo) {
      deleteMutation.mutate(selectedInfo.id);
    }
  };

  const handleAdd = () => {
    setSelectedInfo(null);
    
    // Count items in the active section for default order
    const countInSection = activeFilter 
      ? companyInfo.filter(info => info.section === activeFilter).length
      : 0;
    
    form.reset({
      title: '',
      content: '',
      section: activeFilter || 'about',
      subtitle: null,
      imageUrl: null,
      order: countInSection,
    });
    setIsAddDialogOpen(true);
  };

  // Get unique sections from the data
  const uniqueSections = Array.from(new Set(companyInfo.map(info => info.section)));

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Company Information Management</h1>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus size={16} /> Add Company Info
          </Button>
        </div>

        {/* Filter section */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant={activeFilter === null ? "default" : "outline"} 
              onClick={() => setActiveFilter(null)}
            >
              All
            </Button>
            {uniqueSections.map(section => (
              <Button 
                key={section} 
                variant={activeFilter === section ? "default" : "outline"} 
                onClick={() => setActiveFilter(section)}
              >
                {COMPANY_SECTIONS.find(s => s.value === section)?.label || section}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p>Loading company information...</p>
        ) : error ? (
          <p className="text-red-500">Error loading company information</p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Manage your company information displayed on the website.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanyInfo.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No company information found. Create one to get started.</TableCell>
                    </TableRow>
                  ) : (
                    filteredCompanyInfo.map((info) => (
                      <TableRow key={info.id}>
                        <TableCell className="font-medium">{info.title}</TableCell>
                        <TableCell>
                          {COMPANY_SECTIONS.find(s => s.value === info.section)?.label || info.section}
                        </TableCell>
                        <TableCell>{info.order}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleEdit(info)} title="Edit">
                              <Pencil size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDelete(info)} title="Delete">
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

        {/* Add Company Info Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Company Information</DialogTitle>
              <DialogDescription>Add new information about your company.</DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="About Our Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Our story and mission" 
                          {...field} 
                          value={field.value || ''} 
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a section" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COMPANY_SECTIONS.map(section => (
                            <SelectItem key={section.value} value={section.value}>
                              {section.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter the content for this section..." 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUploader
                          currentImageUrl={field.value}
                          onImageChange={(url) => field.onChange(url)}
                          label="Section Image"
                          description="Upload an image for this company information section (optional)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers display first
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Saving...' : 'Save'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Company Info Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Company Information</DialogTitle>
              <DialogDescription>Update company information.</DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="About Our Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Our story and mission" 
                          {...field} 
                          value={field.value || ''} 
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a section" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COMPANY_SECTIONS.map(section => (
                            <SelectItem key={section.value} value={section.value}>
                              {section.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter the content for this section..." 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUploader
                          currentImageUrl={field.value}
                          onImageChange={(url) => field.onChange(url)}
                          label="Section Image"
                          description="Upload an image for this company information section (optional)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers display first
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? 'Updating...' : 'Update'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedInfo?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCompanyInfoPage;
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { InsertBlogPost, BlogPost } from "@shared/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Pencil, Trash, Image, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Define form schema
const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  category: z.string().min(1, "Category is required"),
  author: z.string().min(1, "Author is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens",
  }),
  readTime: z.coerce.number().min(1, "Read time is required"),
  imageUrl: z.string().nullable().optional(),
  publishDate: z.date(),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

export default function AdminBlogPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();

  // Fetch blog posts
  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      const res = await apiRequest("/api/blog");
      return res.json();
    },
  });

  // Setup form
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category: "",
      author: "",
      slug: "",
      readTime: 5,
      imageUrl: null,
      publishDate: new Date(),
    },
  });

  // Create blog post mutation
  const createBlogPostMutation = useMutation({
    mutationFn: async (data: BlogPostFormValues) => {
      const res = await apiRequest("/api/blog", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          publishDate: data.publishDate.toISOString(),
        }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create blog post");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update blog post mutation
  const updateBlogPostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: BlogPostFormValues }) => {
      const res = await apiRequest(`/api/blog/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...data,
          publishDate: data.publishDate.toISOString(),
        }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update blog post");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setIsDialogOpen(false);
      setSelectedPost(null);
      form.reset();
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete blog post mutation
  const deleteBlogPostMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest(`/api/blog/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete blog post");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setIsDeleteDialogOpen(false);
      setSelectedPost(null);
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = async (data: BlogPostFormValues) => {
    if (isEditMode && selectedPost) {
      updateBlogPostMutation.mutate({ id: selectedPost.id, data });
    } else {
      createBlogPostMutation.mutate(data);
    }
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  // Open dialog for editing
  const openEditDialog = (post: BlogPost) => {
    setSelectedPost(post);
    setIsEditMode(true);
    form.reset({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      author: post.author,
      slug: post.slug,
      readTime: post.readTime,
      imageUrl: post.imageUrl,
      publishDate: new Date(post.publishDate),
    });
    setIsDialogOpen(true);
  };

  // Open dialog for creating
  const openCreateDialog = () => {
    setSelectedPost(null);
    setIsEditMode(false);
    form.reset({
      title: "",
      content: "",
      excerpt: "",
      category: "",
      author: "",
      slug: "",
      readTime: 5,
      imageUrl: null,
      publishDate: new Date(),
    });
    setIsDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (selectedPost) {
      deleteBlogPostMutation.mutate(selectedPost.id);
    }
  };

  // Format date
  const formatDate = (dateString: string | Date) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Blog Management</h1>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Blog Post
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Blog Posts</CardTitle>
            <CardDescription>Manage your blog posts and articles</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center my-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogPosts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No blog posts found. Create your first post.
                      </TableCell>
                    </TableRow>
                  ) : (
                    blogPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          {post.imageUrl ? (
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                              <img 
                                src={post.imageUrl} 
                                alt={post.title} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex items-center justify-center text-muted-foreground">
                              <Image className="h-6 w-6" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>{post.category}</TableCell>
                        <TableCell>{formatDate(post.publishDate)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => openEditDialog(post)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => openDeleteDialog(post)}
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

      {/* Create/Edit Blog Post Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Blog Post" : "Create Blog Post"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Update your blog post details" 
                : "Add a new post to your blog"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!isEditMode && !form.getValues().slug) {
                            form.setValue("slug", generateSlug(e.target.value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="your-blog-post" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="readTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Read Time (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={1} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ""} 
                          placeholder="https://example.com/image.jpg" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publishDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Publish Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${
                                !field.value ? "text-muted-foreground" : ""
                              }`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Brief summary of the blog post" 
                        rows={3}
                      />
                    </FormControl>
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
                        {...field} 
                        placeholder="Write your blog post content here" 
                        rows={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createBlogPostMutation.isPending || updateBlogPostMutation.isPending}
                >
                  {(createBlogPostMutation.isPending || updateBlogPostMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    isEditMode ? "Update Post" : "Create Post"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedPost?.title}"? This action cannot be undone.
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
              disabled={deleteBlogPostMutation.isPending}
            >
              {deleteBlogPostMutation.isPending ? (
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
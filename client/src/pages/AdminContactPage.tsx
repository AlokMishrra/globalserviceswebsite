import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ContactSubmission } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Trash } from "lucide-react";
import { format } from "date-fns";

export default function AdminContactPage() {
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch contact submissions
  const { data: submissions = [], isLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contact"],
    queryFn: async () => {
      const res = await apiRequest("/api/admin/contact");
      return res.json();
    },
  });

  // Delete mutation
  const deleteSubmissionMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/admin/contact/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete submission");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact"] });
      setDeleteDialogOpen(false);
      setSelectedSubmission(null);
      toast({
        title: "Success",
        description: "Contact submission deleted successfully",
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

  // Open view dialog
  const openViewDialog = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (selectedSubmission) {
      deleteSubmissionMutation.mutate(selectedSubmission.id);
    }
  };

  // Format date
  const formatDate = (dateString: string | Date) => {
    return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Contact Submissions</h1>

        <Card>
          <CardHeader>
            <CardTitle>All Contact Submissions</CardTitle>
            <CardDescription>View and manage website contact form submissions</CardDescription>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No contact form submissions yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.name}</TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>{submission.company || "-"}</TableCell>
                        <TableCell>{submission.service || "-"}</TableCell>
                        <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openViewDialog(submission)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => openDeleteDialog(submission)}
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

      {/* View Submission Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Submission Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedSubmission && formatDate(selectedSubmission.submittedAt)}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p>{selectedSubmission.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{selectedSubmission.email}</p>
              </div>
              {selectedSubmission.company && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
                  <p>{selectedSubmission.company}</p>
                </div>
              )}
              {selectedSubmission.service && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Service Interested In</h3>
                  <p>{selectedSubmission.service}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Message</h3>
                <div className="p-4 bg-muted rounded-md mt-1">
                  <p className="whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setViewDialogOpen(false);
                if (selectedSubmission) {
                  openDeleteDialog(selectedSubmission);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact submission from {selectedSubmission?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteSubmissionMutation.isPending}
            >
              {deleteSubmissionMutation.isPending ? (
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
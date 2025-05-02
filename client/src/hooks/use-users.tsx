import { useQuery, useMutation } from "@tanstack/react-query";
import { User, insertUserSchema } from '@shared/schema';
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "./use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Create a type without the password
export type UserWithoutPassword = Omit<User, 'password'>;

// Extended schema with password confirmation
export const userFormSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export function useUsers() {
  const { toast } = useToast();
  
  // Get all users
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<UserWithoutPassword[]>({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/users');
      return await res.json();
    },
  });

  // Create a new user
  const createUserMutation = useMutation({
    mutationFn: async (data: UserFormValues) => {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = data;
      const res = await apiRequest('POST', '/api/admin/users', userData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "User created",
        description: "The user has been created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create user",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update an existing user
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<UserFormValues> }) => {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = data;
      const res = await apiRequest('PATCH', `/api/admin/users/${id}`, userData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "User updated",
        description: "The user has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update user",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete a user
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "User deleted",
        description: "The user has been deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete user",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Form utilities for creating and editing users
  const getDefaultUserFormValues = (): UserFormValues => ({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    firstName: '',
    lastName: '',
    permissions: []
  });

  // Get form for a new user
  const useUserForm = (defaultValues: Partial<UserFormValues> = {}) => {
    return useForm<UserFormValues>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
        ...getDefaultUserFormValues(),
        ...defaultValues,
      },
    });
  };

  // Convert user to form values for editing
  const userToFormValues = (user: UserWithoutPassword): Partial<UserFormValues> => ({
    username: user.username,
    email: user.email,
    role: user.role,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    permissions: user.permissions || []
  });

  return {
    users,
    isLoading,
    error,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
    useUserForm,
    userToFormValues,
  };
}
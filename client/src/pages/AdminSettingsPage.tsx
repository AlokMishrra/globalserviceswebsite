import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";

// Define schemas for the different settings sections
const generalSettingsSchema = z.object({
  siteName: z.string().min(2, "Site name is required"),
  siteTagline: z.string().optional(),
  siteDescription: z.string().optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
});

const contactSettingsSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
  contactFormEmail: z.string().email("Please enter a valid email address"),
});

const socialSettingsSchema = z.object({
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  youtube: z.string().optional(),
  pinterest: z.string().optional(),
});

const footerSettingsSchema = z.object({
  copyrightText: z.string().optional(),
  footerText: z.string().optional(),
  showSocialIcons: z.boolean().default(true),
  showContactInfo: z.boolean().default(true),
  showQuickLinks: z.boolean().default(true),
});

// Combine all schemas
const settingsSchema = z.object({
  general: generalSettingsSchema,
  contact: contactSettingsSchema,
  social: socialSettingsSchema,
  footer: footerSettingsSchema,
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");

  // Query to fetch settings
  const { 
    data: settings, 
    isLoading, 
    error 
  } = useQuery<any>({
    queryKey: ['/api/admin/settings'],
    queryFn: async () => {
      try {
        const res = await apiRequest('/api/admin/settings');
        return await res.json();
      } catch (err) {
        // If settings don't exist yet, return default values
        return {
          general: {
            siteName: "Global Services",
            siteTagline: "Digital Marketing Agency",
            siteDescription: "Full-scale Digital Marketing Agency creating innovative solutions",
            logoUrl: "",
            faviconUrl: "",
            primaryColor: "#10B981",
            secondaryColor: "#F3F4F6",
            accentColor: "#FFC107",
          },
          contact: {
            email: "contact@example.com",
            phone: "+1 (555) 123-4567",
            address: "123 Main St, New York, NY 10001",
            mapEmbedUrl: "",
            contactFormEmail: "contact@example.com",
          },
          social: {
            facebook: "https://facebook.com/globalservices",
            twitter: "https://twitter.com/globalservices",
            instagram: "https://instagram.com/globalservices",
            linkedin: "https://linkedin.com/company/globalservices",
            youtube: "",
            pinterest: "",
          },
          footer: {
            copyrightText: "© 2025 Global Services. All rights reserved.",
            footerText: "Strategy. Creativity. Results.",
            showSocialIcons: true,
            showContactInfo: true,
            showQuickLinks: true,
          }
        };
      }
    },
  });

  // Form definition
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings || {
      general: {
        siteName: "",
        siteTagline: "",
        siteDescription: "",
        logoUrl: "",
        faviconUrl: "",
        primaryColor: "",
        secondaryColor: "",
        accentColor: "",
      },
      contact: {
        email: "",
        phone: "",
        address: "",
        mapEmbedUrl: "",
        contactFormEmail: "",
      },
      social: {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
        youtube: "",
        pinterest: "",
      },
      footer: {
        copyrightText: "",
        footerText: "",
        showSocialIcons: true,
        showContactInfo: true,
        showQuickLinks: true,
      }
    },
  });

  // Set form values when settings are loaded
  React.useEffect(() => {
    if (settings) {
      Object.keys(settings).forEach(section => {
        Object.keys(settings[section]).forEach(field => {
          form.setValue(`${section}.${field}` as any, settings[section][field]);
        });
      });
    }
  }, [settings, form]);

  // Mutation to save settings
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: SettingsFormValues) => {
      const res = await apiRequest('/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      toast({
        title: "Settings saved",
        description: "Your website settings have been successfully updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save settings",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Form submission handler
  const onSubmit = async (data: SettingsFormValues) => {
    await saveSettingsMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Settings</h2>
          <p className="text-muted-foreground mb-4">{(error as Error).message}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Website Settings</h1>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={saveSettingsMutation.isPending}
          >
            {saveSettingsMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save All Settings
              </>
            )}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Website Content</CardTitle>
            <CardDescription>
              Configure all aspects of your website including general information, 
              contact details, social media links, and footer content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-8">
                <Tabs 
                  defaultValue="general" 
                  value={activeTab} 
                  onValueChange={setActiveTab} 
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 mb-8">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="social">Social Media</TabsTrigger>
                    <TabsTrigger value="footer">Footer</TabsTrigger>
                  </TabsList>

                  {/* General Settings */}
                  <TabsContent value="general" className="space-y-6">
                    <div className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="general.siteName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Site Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              The name of your website
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="general.siteTagline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Site Tagline</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              A short tagline for your website
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="general.siteDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Site Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                className="min-h-24"
                              />
                            </FormControl>
                            <FormDescription>
                              A brief description of your website (used for SEO)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="general.logoUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Logo URL</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>
                                URL to your website logo
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="general.faviconUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Favicon URL</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>
                                URL to your website favicon
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="general.primaryColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Color</FormLabel>
                              <div className="flex gap-2">
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <Input 
                                  type="color" 
                                  value={field.value || "#10B981"} 
                                  onChange={(e) => field.onChange(e.target.value)}
                                  className="w-10 p-1 h-10"
                                />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="general.secondaryColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Secondary Color</FormLabel>
                              <div className="flex gap-2">
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <Input 
                                  type="color" 
                                  value={field.value || "#F3F4F6"} 
                                  onChange={(e) => field.onChange(e.target.value)}
                                  className="w-10 p-1 h-10"
                                />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="general.accentColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Accent Color</FormLabel>
                              <div className="flex gap-2">
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <Input 
                                  type="color" 
                                  value={field.value || "#FFC107"} 
                                  onChange={(e) => field.onChange(e.target.value)}
                                  className="w-10 p-1 h-10"
                                />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Contact Settings */}
                  <TabsContent value="contact" className="space-y-6">
                    <div className="grid gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="contact.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormDescription>
                                Public email address displayed on the website
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contact.phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>
                                Public phone number displayed on the website
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="contact.address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormDescription>
                              Physical address displayed on the website
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contact.mapEmbedUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Google Maps Embed URL</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              URL for embedded Google Maps on the contact page
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contact.contactFormEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Form Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormDescription>
                              Email address where contact form submissions will be sent
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  {/* Social Media Settings */}
                  <TabsContent value="social" className="space-y-6">
                    <div className="grid gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="social.facebook"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Facebook URL</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="social.twitter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Twitter URL</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="social.instagram"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Instagram URL</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="social.linkedin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>LinkedIn URL</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="social.youtube"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>YouTube URL</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="social.pinterest"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pinterest URL</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Footer Settings */}
                  <TabsContent value="footer" className="space-y-6">
                    <div className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="footer.copyrightText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Copyright Text</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Copyright text displayed in the footer
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="footer.footerText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Footer Text</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormDescription>
                              Additional text displayed in the footer
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Footer Display Options */}
                      {/* Additional settings for what sections to show in footer could be added here */}
                    </div>
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
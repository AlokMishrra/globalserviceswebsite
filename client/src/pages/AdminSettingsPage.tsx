import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Settings {
  general: {
    siteName: string;
    siteTagline: string;
    siteDescription: string;
    logoUrl: string;
    faviconUrl: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  header: {
    showLogo: boolean;
    showNav: boolean;
    showCTA: boolean;
    ctaText: string;
    ctaLink: string;
    navItems: Array<{
      text: string;
      link: string;
      visible: boolean;
    }>;
  };
  footer: {
    showFooter: boolean;
    copyrightText: string;
    footerText: string;
    showSocialIcons: boolean;
    showContactInfo: boolean;
    showQuickLinks: boolean;
    columns: Array<{
      title: string;
      links: Array<{
        text: string;
        url: string;
      }>;
    }>;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    mapEmbedUrl: string;
    contactFormEmail: string;
  };
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    pinterest: string;
  };
}

const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch settings
  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ['/api/admin/settings'],
    queryFn: async () => {
      const response = await apiRequest('/api/admin/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      return response.json();
    },
  });

  const form = useForm<Settings>({
    defaultValues: settings || {
      general: {
        siteName: "",
        siteTagline: "",
        siteDescription: "",
        logoUrl: "",
        faviconUrl: "",
        primaryColor: "#10B981",
        secondaryColor: "#F3F4F6",
        accentColor: "#FFC107",
      },
      header: {
        showLogo: true,
        showNav: true,
        showCTA: true,
        ctaText: "Contact Us",
        ctaLink: "/contact",
        navItems: [
          { text: "Home", link: "/", visible: true },
          { text: "About", link: "/about", visible: true },
          { text: "Services", link: "/services", visible: true },
          { text: "Work", link: "/work", visible: true },
          { text: "Blog", link: "/blog", visible: true },
          { text: "Careers", link: "/careers", visible: true },
          { text: "Contact", link: "/contact", visible: true },
        ],
      },
      footer: {
        showFooter: true,
        copyrightText: "© 2025 Global Services. All rights reserved.",
        footerText: "Strategy. Creativity. Results.",
        showSocialIcons: true,
        showContactInfo: true,
        showQuickLinks: true,
        columns: [
          {
            title: "Quick Links",
            links: [
              { text: "Home", url: "/" },
              { text: "About", url: "/about" },
              { text: "Services", url: "/services" },
              { text: "Portfolio", url: "/work" },
              { text: "Contact", url: "/contact" },
            ],
          },
          {
            title: "Services",
            links: [
              { text: "Social Media Marketing", url: "/services/social-media-marketing" },
              { text: "Content Marketing", url: "/services/content-marketing" },
              { text: "SEO Optimization", url: "/services/seo-optimization" },
              { text: "Email Marketing", url: "/services/email-marketing" },
              { text: "PPC Advertising", url: "/services/ppc-advertising" },
            ],
          },
        ],
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
    },
  });

  // Update form when settings data is loaded
  React.useEffect(() => {
    if (settings) {
      form.reset(settings);
      // Set preview URLs if they exist
      if (settings.general.logoUrl) {
        setLogoPreview(settings.general.logoUrl);
      }
      if (settings.general.faviconUrl) {
        setFaviconPreview(settings.general.faviconUrl);
      }
    }
  }, [settings, form]);

  // Update settings mutation
  const { mutate: updateSettings, isPending } = useMutation({
    mutationFn: async (data: Settings) => {
      // Handle logo upload if there's a file
      if (logoFile) {
        const formData = new FormData();
        formData.append('file', logoFile);
        formData.append('type', 'logo');
        
        const uploadResponse = await apiRequest('/api/admin/upload', {
          method: 'POST',
          body: formData,
          headers: {
            // Don't set Content-Type, browser will set it with boundary for FormData
          },
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload logo');
        }
        
        const uploadResult = await uploadResponse.json();
        data.general.logoUrl = uploadResult.url;
      }
      
      // Handle favicon upload if there's a file
      if (faviconFile) {
        const formData = new FormData();
        formData.append('file', faviconFile);
        formData.append('type', 'favicon');
        
        const uploadResponse = await apiRequest('/api/admin/upload', {
          method: 'POST',
          body: formData,
          headers: {
            // Don't set Content-Type, browser will set it with boundary for FormData
          },
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload favicon');
        }
        
        const uploadResult = await uploadResponse.json();
        data.general.faviconUrl = uploadResult.url;
      }

      // Update settings
      const response = await apiRequest('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your website settings have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      
      // Reset file inputs
      setLogoFile(null);
      setFaviconFile(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFaviconFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setFaviconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: Settings) => {
    updateSettings(data);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Website Settings</h1>
            <p className="text-muted-foreground">
              Manage your website appearance, content, and functionality
            </p>
          </div>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="bg-primary hover:bg-primary/90"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="header">Header</TabsTrigger>
                <TabsTrigger value="footer">Footer</TabsTrigger>
                <TabsTrigger value="contact">Contact Info</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                      Basic information about your website
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="general.siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Website Name" {...field} />
                          </FormControl>
                          <FormDescription>
                            The name of your website, displayed in the browser tab
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
                            <Input placeholder="Your Website Tagline" {...field} />
                          </FormControl>
                          <FormDescription>
                            A short description of your business
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
                              placeholder="Describe your website in a few sentences"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Used for SEO and social media sharing
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <FormLabel>Logo</FormLabel>
                        <div className="flex items-center gap-4">
                          {logoPreview && (
                            <div className="w-16 h-16 overflow-hidden rounded border flex items-center justify-center bg-white">
                              <img 
                                src={logoPreview} 
                                alt="Logo preview" 
                                className="max-w-full max-h-full object-contain" 
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <Input
                              id="logo-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleLogoChange}
                            />
                          </div>
                        </div>
                        <FormDescription>
                          Upload your website logo (Recommended size: 200x80px)
                        </FormDescription>

                        <FormField
                          control={form.control}
                          name="general.logoUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Logo URL</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://example.com/logo.png" 
                                  {...field} 
                                  disabled={!!logoFile}
                                />
                              </FormControl>
                              <FormDescription>
                                Or provide a URL to your logo
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <FormLabel>Favicon</FormLabel>
                        <div className="flex items-center gap-4">
                          {faviconPreview && (
                            <div className="w-16 h-16 overflow-hidden rounded border flex items-center justify-center bg-white">
                              <img 
                                src={faviconPreview} 
                                alt="Favicon preview" 
                                className="max-w-full max-h-full object-contain" 
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <Input
                              id="favicon-upload"
                              type="file"
                              accept="image/x-icon,image/png,image/svg+xml"
                              onChange={handleFaviconChange}
                            />
                          </div>
                        </div>
                        <FormDescription>
                          Upload your website favicon (Recommended size: 32x32px)
                        </FormDescription>

                        <FormField
                          control={form.control}
                          name="general.faviconUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Favicon URL</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://example.com/favicon.ico" 
                                  {...field} 
                                  disabled={!!faviconFile}
                                />
                              </FormControl>
                              <FormDescription>
                                Or provide a URL to your favicon
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                      <FormField
                        control={form.control}
                        name="general.primaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Color</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input type="color" {...field} className="w-12 h-10 p-1" />
                              </FormControl>
                              <Input 
                                value={field.value} 
                                onChange={(e) => field.onChange(e.target.value)}
                                className="flex-1"
                              />
                            </div>
                            <FormDescription>
                              Main brand color, used for buttons and accents
                            </FormDescription>
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
                                <Input type="color" {...field} className="w-12 h-10 p-1" />
                              </FormControl>
                              <Input 
                                value={field.value} 
                                onChange={(e) => field.onChange(e.target.value)}
                                className="flex-1"
                              />
                            </div>
                            <FormDescription>
                              Secondary color for backgrounds and sections
                            </FormDescription>
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
                                <Input type="color" {...field} className="w-12 h-10 p-1" />
                              </FormControl>
                              <Input 
                                value={field.value} 
                                onChange={(e) => field.onChange(e.target.value)}
                                className="flex-1"
                              />
                            </div>
                            <FormDescription>
                              Accent color for highlights and special elements
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Header Settings */}
              <TabsContent value="header">
                <Card>
                  <CardHeader>
                    <CardTitle>Header Settings</CardTitle>
                    <CardDescription>
                      Configure how your website header appears
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="header.showLogo"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base font-semibold">Display Logo</FormLabel>
                              <FormDescription>
                                Show your logo in the header
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="header.showNav"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base font-semibold">Show Navigation</FormLabel>
                              <FormDescription>
                                Display navigation menu in header
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="header.showCTA"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base font-semibold">Show CTA Button</FormLabel>
                              <FormDescription>
                                Display call-to-action button
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <FormField
                        control={form.control}
                        name="header.ctaText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CTA Button Text</FormLabel>
                            <FormControl>
                              <Input placeholder="Contact Us" {...field} />
                            </FormControl>
                            <FormDescription>
                              Text displayed on the call-to-action button
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="header.ctaLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CTA Button Link</FormLabel>
                            <FormControl>
                              <Input placeholder="/contact" {...field} />
                            </FormControl>
                            <FormDescription>
                              Where the button should link to
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="pt-6">
                      <h3 className="text-lg font-semibold mb-4">Navigation Items</h3>
                      <div className="space-y-4">
                        {form.getValues().header?.navItems?.map((_, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border p-4 rounded-md">
                            <div className="md:col-span-5">
                              <FormField
                                control={form.control}
                                name={`header.navItems.${index}.text`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Menu Text</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Home" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="md:col-span-5">
                              <FormField
                                control={form.control}
                                name={`header.navItems.${index}.link`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Menu Link</FormLabel>
                                    <FormControl>
                                      <Input placeholder="/" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="md:col-span-2 flex items-end justify-center h-full pb-2">
                              <FormField
                                control={form.control}
                                name={`header.navItems.${index}.visible`}
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-2">
                                    <FormLabel>Visible</FormLabel>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Footer Settings */}
              <TabsContent value="footer">
                <Card>
                  <CardHeader>
                    <CardTitle>Footer Settings</CardTitle>
                    <CardDescription>
                      Configure your website footer
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="footer.showFooter"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base font-semibold">Display Footer</FormLabel>
                            <FormDescription>
                              Show or hide the entire footer section
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                      <FormField
                        control={form.control}
                        name="footer.showSocialIcons"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base font-semibold">Social Icons</FormLabel>
                              <FormDescription>
                                Show social media icons
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="footer.showContactInfo"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base font-semibold">Contact Info</FormLabel>
                              <FormDescription>
                                Show contact information
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="footer.showQuickLinks"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base font-semibold">Quick Links</FormLabel>
                              <FormDescription>
                                Show quick links columns
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <FormField
                        control={form.control}
                        name="footer.copyrightText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Copyright Text</FormLabel>
                            <FormControl>
                              <Input placeholder="© 2025 Your Company. All rights reserved." {...field} />
                            </FormControl>
                            <FormDescription>
                              Copyright notice displayed at the bottom
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
                            <FormLabel>Footer Tagline</FormLabel>
                            <FormControl>
                              <Input placeholder="Your company tagline or slogan" {...field} />
                            </FormControl>
                            <FormDescription>
                              Short text displayed in the footer
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="pt-6">
                      <h3 className="text-lg font-semibold mb-4">Footer Columns</h3>
                      <div className="space-y-8">
                        {form.getValues().footer?.columns?.map((column, colIndex) => (
                          <div key={colIndex} className="border p-4 rounded-md space-y-4">
                            <FormField
                              control={form.control}
                              name={`footer.columns.${colIndex}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Column Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Quick Links" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <h4 className="text-md font-medium mt-4 mb-2">Links in this column</h4>
                            <div className="space-y-4">
                              {column.links?.map((_, linkIndex) => (
                                <div key={linkIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-3 rounded-md">
                                  <FormField
                                    control={form.control}
                                    name={`footer.columns.${colIndex}.links.${linkIndex}.text`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Link Text</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Home" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`footer.columns.${colIndex}.links.${linkIndex}.url`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Link URL</FormLabel>
                                        <FormControl>
                                          <Input placeholder="/" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contact Info Settings */}
              <TabsContent value="contact">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                      Manage your contact details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="contact.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="contact@example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                              Primary contact email address
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
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormDescription>
                              Business phone number
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
                            <Textarea
                              placeholder="123 Main St, City, State 12345"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Physical business address
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
                            <Input
                              placeholder="https://www.google.com/maps/embed?..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            URL for embedding Google Maps on your contact page
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
                          <FormLabel>Contact Form Recipient</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="inquiries@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Email address where contact form submissions are sent
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Social Media Settings */}
              <TabsContent value="social">
                <Card>
                  <CardHeader>
                    <CardTitle>Social Media Profiles</CardTitle>
                    <CardDescription>
                      Connect your social media accounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="social.facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook</FormLabel>
                            <FormControl>
                              <Input placeholder="https://facebook.com/yourpage" {...field} />
                            </FormControl>
                            <FormDescription>
                              Your Facebook page URL
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="social.twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Twitter / X</FormLabel>
                            <FormControl>
                              <Input placeholder="https://twitter.com/youraccount" {...field} />
                            </FormControl>
                            <FormDescription>
                              Your Twitter profile URL
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="social.instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram</FormLabel>
                            <FormControl>
                              <Input placeholder="https://instagram.com/youraccount" {...field} />
                            </FormControl>
                            <FormDescription>
                              Your Instagram profile URL
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="social.linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn</FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/company/yourcompany" {...field} />
                            </FormControl>
                            <FormDescription>
                              Your LinkedIn company page URL
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="social.youtube"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>YouTube</FormLabel>
                            <FormControl>
                              <Input placeholder="https://youtube.com/c/yourchannel" {...field} />
                            </FormControl>
                            <FormDescription>
                              Your YouTube channel URL
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="social.pinterest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pinterest</FormLabel>
                            <FormControl>
                              <Input placeholder="https://pinterest.com/youraccount" {...field} />
                            </FormControl>
                            <FormDescription>
                              Your Pinterest profile URL
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
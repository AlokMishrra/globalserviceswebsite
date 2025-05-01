import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart } from "@/components/ui/charts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    services: 0,
    portfolioItems: 0,
    blogPosts: 0,
    jobOpenings: 0,
    contactSubmissions: 0,
  });
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Fetch dashboard stats
  useEffect(() => {
    async function fetchDashboardStats() {
      setIsLoading(true);
      try {
        // Check if user is authenticated
        const meResponse = await apiRequest("/api/auth/me");
        if (!meResponse.ok) {
          navigate("/admin/login");
          return;
        }

        // Fetch counts from each endpoint
        const [services, portfolio, blog, jobs, contacts] = await Promise.all([
          apiRequest("/api/services").then(res => res.json()),
          apiRequest("/api/portfolio").then(res => res.json()),
          apiRequest("/api/blog").then(res => res.json()),
          apiRequest("/api/jobs").then(res => res.json()),
          apiRequest("/api/admin/contact").then(res => {
            if (res.ok) return res.json();
            return [];
          }).catch(() => []) // Handle case where admin isn't authenticated
        ]);

        setStats({
          services: services.length || 0,
          portfolioItems: portfolio.length || 0,
          blogPosts: blog.length || 0,
          jobOpenings: jobs.length || 0,
          contactSubmissions: contacts.length || 0,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardStats();
  }, [navigate, toast]);

  // Chart config
  const overviewChartConfig = {
    services: { label: "Services" },
    portfolioItems: { label: "Portfolio" },
    blogPosts: { label: "Blog" },
    jobOpenings: { label: "Jobs" },
  };

  // Generate chart data from stats
  const chartData = [
    {
      name: "Content Items",
      services: stats.services,
      portfolioItems: stats.portfolioItems,
      blogPosts: stats.blogPosts,
      jobOpenings: stats.jobOpenings,
    },
  ];

  // Pie chart data
  const pieData = [
    { name: "Services", value: stats.services },
    { name: "Portfolio", value: stats.portfolioItems },
    { name: "Blog", value: stats.blogPosts },
    { name: "Jobs", value: stats.jobOpenings },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.services}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Items</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.portfolioItems}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.blogPosts}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Job Openings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.jobOpenings}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <BarChart
                data={chartData}
                config={overviewChartConfig}
                className="h-[300px]"
              />
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <PieChart
                data={pieData}
                config={{
                  value: { label: "Items" },
                }}
                className="h-[300px]"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="content">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
                <TabsTrigger value="content">Add Content</TabsTrigger>
                <TabsTrigger value="manage">Manage</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <a href="/admin/services?action=new" className="block">
                    <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <span className="text-4xl mb-2">➕</span>
                        <span className="font-medium">New Service</span>
                      </CardContent>
                    </Card>
                  </a>
                  <a href="/admin/portfolio?action=new" className="block">
                    <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <span className="text-4xl mb-2">➕</span>
                        <span className="font-medium">New Portfolio</span>
                      </CardContent>
                    </Card>
                  </a>
                  <a href="/admin/blog?action=new" className="block">
                    <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <span className="text-4xl mb-2">➕</span>
                        <span className="font-medium">New Blog Post</span>
                      </CardContent>
                    </Card>
                  </a>
                  <a href="/admin/jobs?action=new" className="block">
                    <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <span className="text-4xl mb-2">➕</span>
                        <span className="font-medium">New Job</span>
                      </CardContent>
                    </Card>
                  </a>
                </div>
              </TabsContent>
              <TabsContent value="manage" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <a href="/admin/services" className="block">
                    <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <span className="text-4xl mb-2">🔧</span>
                        <span className="font-medium">Manage Services</span>
                      </CardContent>
                    </Card>
                  </a>
                  <a href="/admin/portfolio" className="block">
                    <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <span className="text-4xl mb-2">🔧</span>
                        <span className="font-medium">Manage Portfolio</span>
                      </CardContent>
                    </Card>
                  </a>
                  <a href="/admin/blog" className="block">
                    <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <span className="text-4xl mb-2">🔧</span>
                        <span className="font-medium">Manage Blog</span>
                      </CardContent>
                    </Card>
                  </a>
                  <a href="/admin/jobs" className="block">
                    <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <span className="text-4xl mb-2">🔧</span>
                        <span className="font-medium">Manage Jobs</span>
                      </CardContent>
                    </Card>
                  </a>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {stats.contactSubmissions > 0 && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Contact Submissions</span>
                <a href="/admin/contact" className="text-sm text-primary hover:underline">
                  View all
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4">
                <p className="text-lg font-medium text-muted-foreground">
                  You have {stats.contactSubmissions} contact submissions to review
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
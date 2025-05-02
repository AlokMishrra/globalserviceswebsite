import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminLayoutProps {
  children: ReactNode;
}

interface AdminNavItemProps {
  href: string;
  title: string;
  isActive: boolean;
  isMobile?: boolean;
  onClick?: () => void;
}

function AdminNavItem({ href, title, isActive, isMobile, onClick }: AdminNavItemProps) {
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-muted hover:text-foreground transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground",
        isMobile && "justify-center"
      )}
      onClick={onClick}
    >
      {title}
    </Link>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, navigate] = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Check authentication on component mount
  useEffect(() => {
    async function checkAuth() {
      try {
        console.log("Checking authentication...");
        setIsLoading(true);
        
        // Check the session status
        const response = await apiRequest("/api/auth/status");
        const data = await response.json();
        console.log("Auth status:", data);
        
        if (!data.isAuthenticated || data.session?.userRole !== 'admin') {
          console.log("Not authenticated or not admin, redirecting to login page");
          navigate("/admin/login");
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/admin/login");
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuth();
  }, [navigate]);

  async function handleLogout() {
    try {
      const response = await apiRequest("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        window.location.href = "/admin/login";
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  }

  // Close mobile nav when location changes
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, the effect will redirect, but just in case
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r">
        <div className="px-6 py-6 flex items-center justify-between border-b">
          <Link href="/admin" className="font-bold text-lg">
            Admin Dashboard
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-1 p-4">
            <p className="text-xs font-medium text-muted-foreground p-2">Content Management</p>
            <AdminNavItem 
              href="/admin/services" 
              title="Services" 
              isActive={location === "/admin/services"} 
            />
            <AdminNavItem 
              href="/admin/portfolio" 
              title="Portfolio" 
              isActive={location === "/admin/portfolio"} 
            />
            <AdminNavItem 
              href="/admin/blog" 
              title="Blog" 
              isActive={location === "/admin/blog"} 
            />
            <AdminNavItem 
              href="/admin/jobs" 
              title="Careers" 
              isActive={location === "/admin/jobs"} 
            />
            <AdminNavItem 
              href="/admin/contact" 
              title="Contact Submissions" 
              isActive={location === "/admin/contact"} 
            />
            <AdminNavItem 
              href="/admin/team" 
              title="Team Members" 
              isActive={location === "/admin/team"} 
            />
            <AdminNavItem 
              href="/admin/company-info" 
              title="Company Info" 
              isActive={location === "/admin/company-info"} 
            />
            
            <p className="text-xs font-medium text-muted-foreground p-2 mt-4">Administration</p>
            <AdminNavItem 
              href="/admin/users" 
              title="Users" 
              isActive={location === "/admin/users"} 
            />
            <AdminNavItem 
              href="/admin/settings" 
              title="Website Settings" 
              isActive={location === "/admin/settings"} 
            />
            <div className="mt-auto pt-4 border-t">
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-destructive/10 text-destructive transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </nav>
        </ScrollArea>
      </aside>

      {/* Mobile header and navigation */}
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 md:hidden">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="rounded-md p-1 text-foreground"
          >
            {mobileNavOpen ? <X /> : <Menu />}
          </button>
          <div className="font-bold">Admin Dashboard</div>
        </header>

        {/* Mobile navigation dropdown */}
        {mobileNavOpen && (
          <div className="fixed inset-0 top-16 z-50 bg-background md:hidden">
            <nav className="grid gap-2 p-4">
              <p className="text-xs font-medium text-muted-foreground p-2">Content Management</p>
              <AdminNavItem 
                href="/admin/services" 
                title="Services" 
                isActive={location === "/admin/services"} 
                onClick={() => setMobileNavOpen(false)}
              />
              <AdminNavItem 
                href="/admin/portfolio" 
                title="Portfolio" 
                isActive={location === "/admin/portfolio"} 
                onClick={() => setMobileNavOpen(false)}
              />
              <AdminNavItem 
                href="/admin/blog" 
                title="Blog" 
                isActive={location === "/admin/blog"} 
                onClick={() => setMobileNavOpen(false)}
              />
              <AdminNavItem 
                href="/admin/jobs" 
                title="Careers" 
                isActive={location === "/admin/jobs"} 
                onClick={() => setMobileNavOpen(false)}
              />
              <AdminNavItem 
                href="/admin/contact" 
                title="Contact Submissions" 
                isActive={location === "/admin/contact"} 
                onClick={() => setMobileNavOpen(false)}
              />
              <AdminNavItem 
                href="/admin/team" 
                title="Team Members" 
                isActive={location === "/admin/team"} 
                onClick={() => setMobileNavOpen(false)}
              />
              <AdminNavItem 
                href="/admin/company-info" 
                title="Company Info" 
                isActive={location === "/admin/company-info"} 
                onClick={() => setMobileNavOpen(false)}
              />
              
              <p className="text-xs font-medium text-muted-foreground p-2 mt-4">Administration</p>
              <AdminNavItem 
                href="/admin/users" 
                title="Users" 
                isActive={location === "/admin/users"} 
                onClick={() => setMobileNavOpen(false)}
              />
              <AdminNavItem 
                href="/admin/settings" 
                title="Website Settings" 
                isActive={location === "/admin/settings"} 
                onClick={() => setMobileNavOpen(false)}
              />
              
              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
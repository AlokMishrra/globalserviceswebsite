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
    <Link href={href}>
      <a
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
      </a>
    </Link>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

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

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r">
        <div className="px-6 py-6 flex items-center justify-between border-b">
          <Link href="/admin">
            <a className="font-bold text-lg">Admin Dashboard</a>
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
            
            <p className="text-xs font-medium text-muted-foreground p-2 mt-4">Administration</p>
            <AdminNavItem 
              href="/admin/users" 
              title="Users" 
              isActive={location === "/admin/users"} 
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
              
              <p className="text-xs font-medium text-muted-foreground p-2 mt-4">Administration</p>
              <AdminNavItem 
                href="/admin/users" 
                title="Users" 
                isActive={location === "/admin/users"} 
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
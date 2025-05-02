import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import WorkPage from "@/pages/WorkPage";
import BlogPage from "@/pages/BlogPage";
import ContactPage from "@/pages/ContactPage";
import CareersPage from "@/pages/CareersPage";
import NotFound from "@/pages/not-found";

// Admin pages
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminServicesPage from "@/pages/AdminServicesPage";
import AdminPortfolioPage from "@/pages/AdminPortfolioPage";
import AdminBlogPage from "@/pages/AdminBlogPage";
import AdminJobsPage from "@/pages/AdminJobsPage";
import AdminContactPage from "@/pages/AdminContactPage";
import AdminUsersPage from "@/pages/AdminUsersPage";

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <Switch>
        <Route path="/admin/login" component={AdminLoginPage} />
        <Route path="/admin" component={AdminDashboardPage} />
        <Route path="/admin/services" component={AdminServicesPage} />
        <Route path="/admin/portfolio" component={AdminPortfolioPage} />
        <Route path="/admin/blog" component={AdminBlogPage} />
        <Route path="/admin/jobs" component={AdminJobsPage} />
        <Route path="/admin/contact" component={AdminContactPage} />
        <Route path="/admin/users" component={AdminUsersPage} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/services" component={ServicesPage} />
          <Route path="/work" component={WorkPage} />
          <Route path="/blog" component={BlogPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/careers" component={CareersPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollArea className="h-screen">
          <Router />
          <Toaster />
        </ScrollArea>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

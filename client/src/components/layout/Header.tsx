import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/logo";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  // Fetch website settings
  const { data: settings } = useQuery<any>({
    queryKey: ['/api/admin/settings'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (!response.ok) {
          // If we can't get admin settings, fallback to defaults
          return {
            general: { siteName: 'Global Services' },
            header: {
              showLogo: true,
              showNav: true,
              showCTA: true,
              ctaText: 'Contact Us',
              ctaLink: '/contact',
              navItems: [
                { text: "Home", link: "/", visible: true },
                { text: "About Us", link: "/about", visible: true },
                { text: "Our Services", link: "/services", visible: true },
                { text: "Our Work", link: "/work", visible: true },
                { text: "Blog", link: "/blog", visible: true },
                { text: "Get in Touch", link: "/contact", visible: true },
                { text: "Work With Us", link: "/careers", visible: true },
              ]
            }
          };
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching settings:', error);
        // Return default settings if fetching fails
        return {
          general: { siteName: 'Global Services' },
          header: {
            showLogo: true,
            showNav: true,
            showCTA: true,
            ctaText: 'Contact Us',
            ctaLink: '/contact',
            navItems: [
              { text: "Home", link: "/", visible: true },
              { text: "About Us", link: "/about", visible: true },
              { text: "Our Services", link: "/services", visible: true },
              { text: "Our Work", link: "/work", visible: true },
              { text: "Blog", link: "/blog", visible: true },
              { text: "Get in Touch", link: "/contact", visible: true },
              { text: "Work With Us", link: "/careers", visible: true },
            ]
          }
        };
      }
    },
    staleTime: 300000, // Cache settings for 5 minutes
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Define types for navigation items
  type NavItem = {
    text: string;
    link: string;
    visible: boolean;
  };
  
  type NavLink = {
    name: string;
    path: string;
  };
  
  // Use settings navItems if available, otherwise fall back to default
  const navLinks: NavLink[] = settings?.header?.navItems
    ? (settings.header.navItems as NavItem[])
      .filter((item: NavItem) => item.visible)
      .map((item: NavItem) => ({ name: item.text, path: item.link }))
    : [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Our Services", path: "/services" },
        { name: "Our Work", path: "/work" },
        { name: "Blog", path: "/blog" },
        { name: "Get in Touch", path: "/contact" },
        { name: "Work With Us", path: "/careers" },
      ];

  // If settings are not yet loaded, render a minimal header
  if (!settings) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="hidden md:flex space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
            <div className="md:hidden">
              <div className="h-6 w-6 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Get header settings with fallbacks
  const showLogo = settings?.header?.showLogo !== false;
  const showNav = settings?.header?.showNav !== false;
  const showCTA = settings?.header?.showCTA !== false;
  const ctaText = settings?.header?.ctaText || 'Contact Us';
  const ctaLink = settings?.header?.ctaLink || '/contact';
  const logoUrl = settings?.general?.logoUrl;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-white shadow-md py-2" : "bg-white py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {showLogo && (
            <Link href="/" className="flex items-center space-x-2">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={settings?.general?.siteName || "Global Services"} 
                  className="h-10 w-auto" 
                />
              ) : (
                <Logo />
              )}
            </Link>
          )}

          {/* Desktop Navigation */}
          {showNav && navLinks.length > 0 && (
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link: NavLink) => (
                <Link 
                  key={link.path} 
                  href={link.path}
                  className={cn(
                    "font-montserrat font-medium transition-colors hover:text-primary",
                    location === link.path ? "text-primary" : "text-dark"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* CTA Button - Desktop */}
              {showCTA && (
                <Link 
                  href={ctaLink} 
                  className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  {ctaText}
                </Link>
              )}
            </nav>
          )}

          {/* Mobile Menu Button */}
          {showNav && navLinks.length > 0 && (
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {showNav && isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden pt-4 pb-4"
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    href={link.path}
                    className={cn(
                      "font-montserrat font-medium py-2 px-4 rounded-md transition-colors",
                      location === link.path
                        ? "bg-primary/10 text-primary"
                        : "text-dark hover:bg-gray-100"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                
                {/* CTA Button - Mobile */}
                {showCTA && (
                  <Link 
                    href={ctaLink}
                    className="bg-primary text-white hover:bg-primary/90 py-2 px-4 rounded-md font-medium transition-colors text-center mx-4 mt-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {ctaText}
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;

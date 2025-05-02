import React from "react";
import { Link } from "wouter";
import Logo from "@/components/ui/logo";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

// Define the Settings interface to match the admin settings structure
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

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  // Fetch website settings from public API endpoint
  const { data: settings } = useQuery<Settings>({
    queryKey: ['/api/settings'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching settings:', error);
        // Return default footer settings if fetching fails
        return {
          general: { 
            siteName: 'Global Services',
            siteTagline: '',
            siteDescription: 'We create super-rich experiences online! Strategy, creativity, and results-driven digital marketing solutions.',
            logoUrl: '',
            faviconUrl: '',
            primaryColor: '',
            secondaryColor: '',
            accentColor: ''
          },
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
          },
          footer: {
            showFooter: true,
            copyrightText: `© ${currentYear} Global Services. All Rights Reserved.`,
            footerText: 'We create super-rich experiences online! Strategy, creativity, and results-driven digital marketing solutions.',
            showSocialIcons: true,
            showContactInfo: true,
            showQuickLinks: true,
            columns: []
          },
          contact: {
            email: 'info@globalservices.com',
            phone: '+91 98765 43210',
            address: '123 Business Avenue, Suite 500\nNew Delhi, India 110001',
            mapEmbedUrl: '',
            contactFormEmail: 'info@globalservices.com'
          },
          social: {
            facebook: '#',
            twitter: '#',
            instagram: '#',
            linkedin: '#',
            youtube: '#',
            pinterest: '#'
          }
        };
      }
    },
    staleTime: 300000, // Cache settings for 5 minutes
  });

  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            {settings?.general?.logoUrl ? (
              <img 
                src={settings.general.logoUrl} 
                alt={settings.general.siteName || "Global Services"} 
                className="h-12 w-auto mb-6" 
              />
            ) : (
              <Logo className="mb-6" />
            )}
            <p className="text-gray-300 mb-6">
              {settings?.footer?.footerText || "We create super-rich experiences online! Strategy, creativity, and results-driven digital marketing solutions."}
            </p>
            {settings?.footer?.showSocialIcons !== false && (
              <div className="flex space-x-4">
                {settings?.social?.facebook && (
                  <a
                    href={settings.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                )}
                {settings?.social?.twitter && (
                  <a
                    href={settings.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter size={18} />
                  </a>
                )}
                {settings?.social?.instagram && (
                  <a
                    href={settings.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                )}
                {settings?.social?.linkedin && (
                  <a
                    href={settings.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                {/* Fallback social icons if none are configured */}
                {!settings?.social?.facebook && !settings?.social?.twitter && 
                 !settings?.social?.instagram && !settings?.social?.linkedin && (
                  <>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook size={18} />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter size={18} />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram size={18} />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={18} />
                    </a>
                  </>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <a className="text-gray-300 hover:text-primary transition-colors">
                    Home
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-300 hover:text-primary transition-colors">
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-gray-300 hover:text-primary transition-colors">
                    Our Services
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/work">
                  <a className="text-gray-300 hover:text-primary transition-colors">
                    Our Work
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-gray-300 hover:text-primary transition-colors">
                    Blog
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-300 hover:text-primary transition-colors">
                    Contact
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <a className="text-gray-300 hover:text-primary transition-colors">
                    Careers
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services#social-media">
                  <a className="text-gray-300 hover:text-primary transition-colors">
                    Social Media Marketing
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/services#seo">
                  <a className="text-gray-300 hover:text-primary transition-colors">
                    Search Engine Optimization
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/services#ppc">
                  <a className="text-gray-300 hover:text-primary transition-colors">
                    Pay-Per-Click Advertising
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/services#content">
                  <a className="text-gray-300 hover:text-primary transition-colors">
                    Content Marketing
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/services#email">
                  <a className="text-gray-300 hover:text-primary transition-colors">
                    Email Marketing
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/services#web">
                  <a className="text-gray-300 hover:text-primary transition-colors">
                    Web Design & Development
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {settings?.footer?.showContactInfo !== false && (
            <div>
              <h3 className="text-xl font-bold mb-6">Contact Us</h3>
              <ul className="space-y-4">
                {settings?.contact?.address && (
                  <li className="flex items-start">
                    <MapPin className="text-primary mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">
                      {settings.contact.address.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < settings.contact.address.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </span>
                  </li>
                )}
                {settings?.contact?.phone && (
                  <li className="flex items-center">
                    <Phone className="text-primary mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{settings.contact.phone}</span>
                  </li>
                )}
                {settings?.contact?.email && (
                  <li className="flex items-center">
                    <Mail className="text-primary mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{settings.contact.email}</span>
                  </li>
                )}
                {!settings?.contact?.address && !settings?.contact?.phone && !settings?.contact?.email && (
                  <>
                    <li className="flex items-start">
                      <MapPin className="text-primary mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">
                        123 Business Avenue, Suite 500
                        <br />
                        New Delhi, India 110001
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Phone className="text-primary mr-3 flex-shrink-0" />
                      <span className="text-gray-300">+91 98765 43210</span>
                    </li>
                    <li className="flex items-center">
                      <Mail className="text-primary mr-3 flex-shrink-0" />
                      <span className="text-gray-300">info@globalservices.com</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              {settings?.footer?.copyrightText || `© ${currentYear} ${settings?.general?.siteName || 'Global Services'}. All Rights Reserved.`}
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy-policy">
                <a className="text-gray-400 text-sm hover:text-gray-300 transition-colors">
                  Privacy Policy
                </a>
              </Link>
              <Link href="/terms-of-service">
                <a className="text-gray-400 text-sm hover:text-gray-300 transition-colors">
                  Terms of Service
                </a>
              </Link>
              <Link href="/cookie-policy">
                <a className="text-gray-400 text-sm hover:text-gray-300 transition-colors">
                  Cookie Policy
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

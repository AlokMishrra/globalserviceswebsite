import React from "react";
import { Link } from "wouter";
import Logo from "@/components/ui/logo";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Logo className="mb-6" />
            <p className="text-gray-300 mb-6">
              We create super-rich experiences online! Strategy, creativity, and
              results-driven digital marketing solutions.
            </p>
            <div className="flex space-x-4">
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
            </div>
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

          <div>
            <h3 className="text-xl font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
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
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Global Services. All Rights Reserved.
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

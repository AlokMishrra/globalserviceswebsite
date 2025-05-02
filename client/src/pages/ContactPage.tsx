import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

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

const ContactPage: React.FC = () => {
  const { toast } = useToast();
  
  // Fetch website settings including contact information
  const { data: settings, isLoading: settingsLoading } = useQuery<Settings>({
    queryKey: ['/api/settings'],
    queryFn: async () => {
      const response = await apiRequest('/api/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      return response.json();
    },
  });
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      service: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: ContactFormValues) {
    mutation.mutate(data);
  }

  return (
    <>
      <Helmet>
        <title>Contact Us - Global Services</title>
        <meta name="description" content="Get in touch with Global Services for all your digital marketing needs. We're here to help your business grow online." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold font-montserrat mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Get In <span className="text-primary">Touch</span>
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-dark/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Have a question or ready to start your project? We'd love to hear from you. Fill out the form below and we'll get back to you shortly.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            <motion.div 
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold font-montserrat mb-6">Send Us a Message</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Company" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service You're Interested In</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="seo">Search Engine Optimization</SelectItem>
                            <SelectItem value="social">Social Media Marketing</SelectItem>
                            <SelectItem value="ppc">Pay-Per-Click Advertising</SelectItem>
                            <SelectItem value="content">Content Marketing</SelectItem>
                            <SelectItem value="email">Email Marketing</SelectItem>
                            <SelectItem value="web">Web Design & Development</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your project or requirements" 
                            rows={5}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-md transition-all transform hover:scale-105"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </motion.div>
            
            <motion.div 
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold font-montserrat mb-6">Contact Information</h2>
              
              <div className="bg-light rounded-lg p-8 mb-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Office Location</h4>
                      <p className="text-gray-700">{settings?.contact?.address || "123 Business Avenue, Suite 500\nNew Delhi, India 110001"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Phone Number</h4>
                      <p className="text-gray-700">{settings?.contact?.phone || "+91 98765 43210"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Email Address</h4>
                      <p className="text-gray-700">{settings?.contact?.email || "info@globalservices.com"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Business Hours</h4>
                      <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold font-montserrat mb-4">Connect With Us</h3>
                <div className="flex space-x-4 mb-8">
                  {settings?.social?.facebook && (
                    <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary transition-colors">
                      <Facebook className="text-primary hover:text-white h-5 w-5" />
                    </a>
                  )}
                  {settings?.social?.twitter && (
                    <a href={settings.social.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary transition-colors">
                      <Twitter className="text-primary hover:text-white h-5 w-5" />
                    </a>
                  )}
                  {settings?.social?.instagram && (
                    <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary transition-colors">
                      <Instagram className="text-primary hover:text-white h-5 w-5" />
                    </a>
                  )}
                  {settings?.social?.linkedin && (
                    <a href={settings.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary transition-colors">
                      <Linkedin className="text-primary hover:text-white h-5 w-5" />
                    </a>
                  )}
                  {/* Fallback icons if no social links are configured */}
                  {!settings?.social?.facebook && !settings?.social?.twitter && 
                   !settings?.social?.instagram && !settings?.social?.linkedin && (
                    <>
                      <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary transition-colors">
                        <Facebook className="text-primary hover:text-white h-5 w-5" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary transition-colors">
                        <Twitter className="text-primary hover:text-white h-5 w-5" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary transition-colors">
                        <Instagram className="text-primary hover:text-white h-5 w-5" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary transition-colors">
                        <Linkedin className="text-primary hover:text-white h-5 w-5" />
                      </a>
                    </>
                  )}
                </div>
                
                <div className="relative h-60 md:h-80 rounded-lg overflow-hidden">
                  <iframe 
                    src={settings?.contact?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d448196.0539680236!2d76.76357827622207!3d28.64368446246649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1658840301691!5m2!1sen!2sin"}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location Map"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-light">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mt-3 mb-6">
              Have Questions? We Have Answers
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "What services does Global Services offer?",
                answer: "We offer a comprehensive range of digital marketing services including SEO, social media marketing, content marketing, PPC advertising, email marketing, and web design & development."
              },
              {
                question: "How long does it take to see results from digital marketing?",
                answer: "The timeline varies depending on the service and your goals. SEO typically takes 3-6 months to show significant results, while PPC can generate immediate traffic. We'll provide you with realistic timelines based on your specific situation."
              },
              {
                question: "Do you work with businesses of all sizes?",
                answer: "Yes, we work with businesses of all sizes, from startups to large enterprises. We tailor our strategies and solutions to meet the specific needs and budget of each client."
              },
              {
                question: "How do you measure the success of digital marketing campaigns?",
                answer: "We use various metrics depending on your goals, including website traffic, conversion rates, engagement rates, click-through rates, and ROI. We provide detailed reports that help you understand the performance of your campaigns."
              },
              {
                question: "What is your pricing structure?",
                answer: "Our pricing varies based on the services you need and the scope of your project. We offer customized packages tailored to your specific requirements and budget. Contact us for a detailed quote."
              },
              {
                question: "How often will I receive updates about my project?",
                answer: "We provide regular updates and reports based on the agreed schedule, typically monthly. However, we're always available to discuss your project and answer any questions you may have at any time."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-bold font-montserrat mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold font-montserrat mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Grow Your Business?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Partner with us to take your digital presence to the next level and achieve your business goals.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button className="bg-secondary text-dark hover:bg-secondary/90 px-8 py-6 rounded-md font-bold text-lg">
              Start Your Project Now
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;

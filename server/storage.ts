import { 
  users, type User, type InsertUser,
  services, type Service, type InsertService,
  portfolioItems, type PortfolioItem, type InsertPortfolioItem,
  blogPosts, type BlogPost, type InsertBlogPost,
  contactSubmissions, type ContactSubmission, type InsertContactSubmission,
  jobOpenings, type JobOpening, type InsertJobOpening,
  teamMembers, type TeamMember, type InsertTeamMember,
  companyInfo, type CompanyInfo, type InsertCompanyInfo
} from "@shared/schema";
import { services as mockServices } from "../client/src/lib/data";
import { portfolioItems as mockPortfolioItems } from "../client/src/lib/data";
import { blogPosts as mockBlogPosts } from "../client/src/lib/data";
import { jobOpenings as mockJobOpenings } from "../client/src/lib/data";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  
  // Service methods
  getService(id: number): Promise<Service | undefined>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  getAllServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<boolean>;
  
  // Portfolio methods
  getPortfolioItem(id: number): Promise<PortfolioItem | undefined>;
  getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | undefined>;
  getAllPortfolioItems(): Promise<PortfolioItem[]>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  updatePortfolioItem(id: number, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem>;
  deletePortfolioItem(id: number): Promise<boolean>;
  
  // Blog methods
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Contact methods
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  deleteContactSubmission(id: number): Promise<boolean>;
  
  // Job methods
  getJobOpening(id: number): Promise<JobOpening | undefined>;
  getJobOpeningBySlug(slug: string): Promise<JobOpening | undefined>;
  getAllJobOpenings(): Promise<JobOpening[]>;
  createJobOpening(job: InsertJobOpening): Promise<JobOpening>;
  updateJobOpening(id: number, job: Partial<InsertJobOpening>): Promise<JobOpening>;
  deleteJobOpening(id: number): Promise<boolean>;
  
  // Settings methods
  getSettings(): Promise<any>;
  updateSettings(settings: any): Promise<any>;
  
  // Team Member methods
  getTeamMember(id: number): Promise<TeamMember | undefined>;
  getAllTeamMembers(): Promise<TeamMember[]>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember>;
  deleteTeamMember(id: number): Promise<boolean>;
  
  // Company Info methods
  getCompanyInfo(id: number): Promise<CompanyInfo | undefined>;
  getCompanyInfoBySection(section: string): Promise<CompanyInfo[]>;
  getAllCompanyInfo(): Promise<CompanyInfo[]>;
  createCompanyInfo(info: InsertCompanyInfo): Promise<CompanyInfo>;
  updateCompanyInfo(id: number, info: Partial<InsertCompanyInfo>): Promise<CompanyInfo>;
  deleteCompanyInfo(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private servicesMap: Map<number, Service>;
  private portfolioItemsMap: Map<number, PortfolioItem>;
  private blogPostsMap: Map<number, BlogPost>;
  private contactSubmissionsMap: Map<number, ContactSubmission>;
  private jobOpeningsMap: Map<number, JobOpening>;
  private settings: any;
  
  private currentUserId: number;
  private currentContactSubmissionId: number;

  constructor() {
    this.users = new Map();
    this.servicesMap = new Map();
    this.portfolioItemsMap = new Map();
    this.blogPostsMap = new Map();
    this.contactSubmissionsMap = new Map();
    this.jobOpeningsMap = new Map();
    
    this.currentUserId = 1;
    this.currentContactSubmissionId = 1;
    
    // Initialize with mock data
    this.initializeData();
  }

  private initializeData() {
    // Initialize services
    mockServices.forEach(service => {
      this.servicesMap.set(service.id, {
        id: service.id,
        title: service.title,
        description: service.description,
        icon: service.icon,
        imageUrl: service.image,
        slug: service.slug
      });
    });
    
    // Initialize portfolio items
    mockPortfolioItems.forEach(item => {
      this.portfolioItemsMap.set(item.id, {
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.image,
        category: item.category,
        slug: item.slug
      });
    });
    
    // Initialize blog posts
    mockBlogPosts.forEach(post => {
      this.blogPostsMap.set(post.id, {
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        imageUrl: post.image,
        category: post.category,
        publishDate: new Date(post.publishDate),
        author: post.author,
        slug: post.slug,
        readTime: post.readTime
      });
    });
    
    // Initialize job openings
    mockJobOpenings.forEach(job => {
      this.jobOpeningsMap.set(job.id, {
        id: job.id,
        title: job.title,
        description: job.description,
        jobType: job.jobType,
        slug: job.slug,
        isActive: job.isActive
      });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "user",
      permissions: insertUser.permissions || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error(`User with id ${id} not found`);
    }
    const updatedUser: User = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Service methods
  async getService(id: number): Promise<Service | undefined> {
    return this.servicesMap.get(id);
  }
  
  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    return Array.from(this.servicesMap.values()).find(
      (service) => service.slug === slug,
    );
  }
  
  async getAllServices(): Promise<Service[]> {
    return Array.from(this.servicesMap.values());
  }

  async createService(service: InsertService): Promise<Service> {
    const id = Math.max(0, ...Array.from(this.servicesMap.keys())) + 1;
    const newService: Service = { 
      ...service, 
      id,
      imageUrl: service.imageUrl || null 
    };
    this.servicesMap.set(id, newService);
    return newService;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const existingService = this.servicesMap.get(id);
    if (!existingService) {
      throw new Error(`Service with id ${id} not found`);
    }
    const updatedService: Service = { ...existingService, ...service };
    this.servicesMap.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: number): Promise<boolean> {
    return this.servicesMap.delete(id);
  }
  
  // Portfolio methods
  async getPortfolioItem(id: number): Promise<PortfolioItem | undefined> {
    return this.portfolioItemsMap.get(id);
  }
  
  async getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | undefined> {
    return Array.from(this.portfolioItemsMap.values()).find(
      (item) => item.slug === slug,
    );
  }
  
  async getAllPortfolioItems(): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItemsMap.values());
  }

  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const id = Math.max(0, ...Array.from(this.portfolioItemsMap.keys())) + 1;
    const newItem: PortfolioItem = { 
      ...item, 
      id,
      imageUrl: item.imageUrl || null
    };
    this.portfolioItemsMap.set(id, newItem);
    return newItem;
  }

  async updatePortfolioItem(id: number, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem> {
    const existingItem = this.portfolioItemsMap.get(id);
    if (!existingItem) {
      throw new Error(`Portfolio item with id ${id} not found`);
    }
    const updatedItem: PortfolioItem = { ...existingItem, ...item };
    this.portfolioItemsMap.set(id, updatedItem);
    return updatedItem;
  }

  async deletePortfolioItem(id: number): Promise<boolean> {
    return this.portfolioItemsMap.delete(id);
  }
  
  // Blog methods
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPostsMap.get(id);
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPostsMap.values()).find(
      (post) => post.slug === slug,
    );
  }
  
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPostsMap.values());
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = Math.max(0, ...Array.from(this.blogPostsMap.keys())) + 1;
    const newPost: BlogPost = { 
      ...post, 
      id,
      imageUrl: post.imageUrl || null
    };
    this.blogPostsMap.set(id, newPost);
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const existingPost = this.blogPostsMap.get(id);
    if (!existingPost) {
      throw new Error(`Blog post with id ${id} not found`);
    }
    const updatedPost: BlogPost = { ...existingPost, ...post };
    this.blogPostsMap.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPostsMap.delete(id);
  }
  
  // Contact methods
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.currentContactSubmissionId++;
    const contactSubmission: ContactSubmission = { 
      ...submission, 
      id,
      submittedAt: new Date(),
      company: submission.company || null,
      service: submission.service || null
    };
    this.contactSubmissionsMap.set(id, contactSubmission);
    return contactSubmission;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissionsMap.values());
  }

  async deleteContactSubmission(id: number): Promise<boolean> {
    return this.contactSubmissionsMap.delete(id);
  }
  
  // Job methods
  async getJobOpening(id: number): Promise<JobOpening | undefined> {
    return this.jobOpeningsMap.get(id);
  }
  
  async getJobOpeningBySlug(slug: string): Promise<JobOpening | undefined> {
    return Array.from(this.jobOpeningsMap.values()).find(
      (job) => job.slug === slug,
    );
  }
  
  async getAllJobOpenings(): Promise<JobOpening[]> {
    return Array.from(this.jobOpeningsMap.values());
  }

  async createJobOpening(job: InsertJobOpening): Promise<JobOpening> {
    const id = Math.max(0, ...Array.from(this.jobOpeningsMap.keys())) + 1;
    const newJob: JobOpening = { 
      ...job, 
      id,
      isActive: job.isActive !== undefined ? job.isActive : true
    };
    this.jobOpeningsMap.set(id, newJob);
    return newJob;
  }

  async updateJobOpening(id: number, job: Partial<InsertJobOpening>): Promise<JobOpening> {
    const existingJob = this.jobOpeningsMap.get(id);
    if (!existingJob) {
      throw new Error(`Job opening with id ${id} not found`);
    }
    const updatedJob: JobOpening = { ...existingJob, ...job };
    this.jobOpeningsMap.set(id, updatedJob);
    return updatedJob;
  }

  async deleteJobOpening(id: number): Promise<boolean> {
    return this.jobOpeningsMap.delete(id);
  }
  
  // Settings methods
  async getSettings(): Promise<any> {
    // Return default settings if none are set
    if (!this.settings) {
      this.settings = {
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
    return this.settings;
  }

  async updateSettings(settings: any): Promise<any> {
    this.settings = { ...this.settings, ...settings };
    return this.settings;
  }
}

import { DatabaseStorage } from "./database-storage";

// Use DatabaseStorage for production environment
// and MemStorage for development environment when needed
// Always use DatabaseStorage for this project
export const storage = new DatabaseStorage();

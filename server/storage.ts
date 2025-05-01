import { 
  users, type User, type InsertUser,
  services, type Service, type InsertService,
  portfolioItems, type PortfolioItem, type InsertPortfolioItem,
  blogPosts, type BlogPost, type InsertBlogPost,
  contactSubmissions, type ContactSubmission, type InsertContactSubmission,
  jobOpenings, type JobOpening, type InsertJobOpening
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
  
  // Service methods
  getService(id: number): Promise<Service | undefined>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  getAllServices(): Promise<Service[]>;
  
  // Portfolio methods
  getPortfolioItem(id: number): Promise<PortfolioItem | undefined>;
  getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | undefined>;
  getAllPortfolioItems(): Promise<PortfolioItem[]>;
  
  // Blog methods
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  
  // Contact methods
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  
  // Job methods
  getJobOpening(id: number): Promise<JobOpening | undefined>;
  getJobOpeningBySlug(slug: string): Promise<JobOpening | undefined>;
  getAllJobOpenings(): Promise<JobOpening[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private servicesMap: Map<number, Service>;
  private portfolioItemsMap: Map<number, PortfolioItem>;
  private blogPostsMap: Map<number, BlogPost>;
  private contactSubmissionsMap: Map<number, ContactSubmission>;
  private jobOpeningsMap: Map<number, JobOpening>;
  
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
  
  // Contact methods
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.currentContactSubmissionId++;
    const contactSubmission: ContactSubmission = { 
      ...submission, 
      id,
      submittedAt: new Date() 
    };
    this.contactSubmissionsMap.set(id, contactSubmission);
    return contactSubmission;
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
}

export const storage = new MemStorage();

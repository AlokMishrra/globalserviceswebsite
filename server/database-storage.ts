import { eq } from "drizzle-orm";
import { 
  users, type User, type InsertUser,
  services, type Service, type InsertService,
  portfolioItems, type PortfolioItem, type InsertPortfolioItem,
  blogPosts, type BlogPost, type InsertBlogPost,
  contactSubmissions, type ContactSubmission, type InsertContactSubmission,
  jobOpenings, type JobOpening, type InsertJobOpening
} from "@shared/schema";
import { IStorage } from "./storage";
import { db } from "./db";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Service methods
  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }
  
  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.slug, slug));
    return service || undefined;
  }
  
  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set(service)
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  async deleteService(id: number): Promise<boolean> {
    await db.delete(services).where(eq(services.id, id));
    return true;
  }
  
  // Portfolio methods
  async getPortfolioItem(id: number): Promise<PortfolioItem | undefined> {
    const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    return item || undefined;
  }
  
  async getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | undefined> {
    const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.slug, slug));
    return item || undefined;
  }
  
  async getAllPortfolioItems(): Promise<PortfolioItem[]> {
    return await db.select().from(portfolioItems);
  }

  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const [newItem] = await db.insert(portfolioItems).values(item).returning();
    return newItem;
  }

  async updatePortfolioItem(id: number, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem> {
    const [updatedItem] = await db
      .update(portfolioItems)
      .set(item)
      .where(eq(portfolioItems.id, id))
      .returning();
    return updatedItem;
  }

  async deletePortfolioItem(id: number): Promise<boolean> {
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
    return true;
  }
  
  // Blog methods
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }
  
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set(post)
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return true;
  }
  
  // Contact methods
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [contact] = await db.insert(contactSubmissions).values(submission).returning();
    return contact;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions);
  }

  async deleteContactSubmission(id: number): Promise<boolean> {
    await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
    return true;
  }
  
  // Job methods
  async getJobOpening(id: number): Promise<JobOpening | undefined> {
    const [job] = await db.select().from(jobOpenings).where(eq(jobOpenings.id, id));
    return job || undefined;
  }
  
  async getJobOpeningBySlug(slug: string): Promise<JobOpening | undefined> {
    const [job] = await db.select().from(jobOpenings).where(eq(jobOpenings.slug, slug));
    return job || undefined;
  }
  
  async getAllJobOpenings(): Promise<JobOpening[]> {
    return await db.select().from(jobOpenings);
  }

  async createJobOpening(job: InsertJobOpening): Promise<JobOpening> {
    const [newJob] = await db.insert(jobOpenings).values(job).returning();
    return newJob;
  }

  async updateJobOpening(id: number, job: Partial<InsertJobOpening>): Promise<JobOpening> {
    const [updatedJob] = await db
      .update(jobOpenings)
      .set(job)
      .where(eq(jobOpenings.id, id))
      .returning();
    return updatedJob;
  }

  async deleteJobOpening(id: number): Promise<boolean> {
    await db.delete(jobOpenings).where(eq(jobOpenings.id, id));
    return true;
  }
}
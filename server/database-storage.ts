import { eq, asc } from "drizzle-orm";
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
import { IStorage } from "./storage";
import { db, pool } from "./db";

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
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    await db.delete(users).where(eq(users.id, id));
    return true;
  }
  
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
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

  // Settings methods
  async getSettings(): Promise<any> {
    // In production, you would retrieve settings from a settings table in the database
    // For now, we'll use a simple approach
    try {
      // Try to read from a specific query
      const result = await pool.query(
        `SELECT value FROM settings WHERE key = 'global_settings'`
      );
      
      // Check if there are any results
      const rows = result.rows;
      if (rows && rows.length > 0 && rows[0].value) {
        return JSON.parse(rows[0].value as string);
      }
      
      // If no settings exist, return default settings
      return {
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
    } catch (error) {
      console.error("Error fetching settings:", error);
      
      // Return default settings in case of error
      return {
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
  }

  async updateSettings(settings: any): Promise<any> {
    try {
      // Check if settings table exists, if not create it
      await pool.query(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        )
      `);
      
      // Convert settings to JSON string
      const settingsJson = JSON.stringify(settings);
      
      // Try to update, if no rows affected then insert
      const updateResult = await pool.query(
        `UPDATE settings SET value = $1 WHERE key = 'global_settings' RETURNING *`,
        [settingsJson]
      );
      
      // Check if any rows were updated
      if (!updateResult.rows || updateResult.rows.length === 0) {
        // No rows were updated, so insert new record
        await pool.query(
          `INSERT INTO settings (key, value) VALUES ('global_settings', $1)`,
          [settingsJson]
        );
      }
      
      return settings;
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  }

  // Team Member methods
  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return member || undefined;
  }
  
  async getAllTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).orderBy(asc(teamMembers.order));
  }
  
  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [newMember] = await db.insert(teamMembers).values(member).returning();
    return newMember;
  }
  
  async updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember> {
    const [updatedMember] = await db
      .update(teamMembers)
      .set(member)
      .where(eq(teamMembers.id, id))
      .returning();
    return updatedMember;
  }
  
  async deleteTeamMember(id: number): Promise<boolean> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
    return true;
  }
  
  // Company Info methods
  async getCompanyInfo(id: number): Promise<CompanyInfo | undefined> {
    const [info] = await db.select().from(companyInfo).where(eq(companyInfo.id, id));
    return info || undefined;
  }
  
  async getCompanyInfoBySection(section: string): Promise<CompanyInfo[]> {
    return await db
      .select()
      .from(companyInfo)
      .where(eq(companyInfo.section, section))
      .orderBy(asc(companyInfo.order));
  }
  
  async getAllCompanyInfo(): Promise<CompanyInfo[]> {
    return await db.select().from(companyInfo).orderBy(asc(companyInfo.section), asc(companyInfo.order));
  }
  
  async createCompanyInfo(info: InsertCompanyInfo): Promise<CompanyInfo> {
    const [newInfo] = await db.insert(companyInfo).values(info).returning();
    return newInfo;
  }
  
  async updateCompanyInfo(id: number, info: Partial<InsertCompanyInfo>): Promise<CompanyInfo> {
    const [updatedInfo] = await db
      .update(companyInfo)
      .set(info)
      .where(eq(companyInfo.id, id))
      .returning();
    return updatedInfo;
  }
  
  async deleteCompanyInfo(id: number): Promise<boolean> {
    await db.delete(companyInfo).where(eq(companyInfo.id, id));
    return true;
  }
}
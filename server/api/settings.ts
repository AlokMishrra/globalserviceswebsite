import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { isAdmin } from '../auth';
import { z } from 'zod';

const router = Router();

// Schemas to validate the settings
const generalSettingsSchema = z.object({
  siteName: z.string().min(2),
  siteTagline: z.string().optional(),
  siteDescription: z.string().optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
});

const contactSettingsSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
  contactFormEmail: z.string().email(),
});

const socialSettingsSchema = z.object({
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  youtube: z.string().optional(),
  pinterest: z.string().optional(),
});

const footerSettingsSchema = z.object({
  copyrightText: z.string().optional(),
  footerText: z.string().optional(),
  showSocialIcons: z.boolean().default(true),
  showContactInfo: z.boolean().default(true),
  showQuickLinks: z.boolean().default(true),
});

const settingsSchema = z.object({
  general: generalSettingsSchema,
  contact: contactSettingsSchema,
  social: socialSettingsSchema,
  footer: footerSettingsSchema,
});

// Get settings
router.get('/', async (req: Request, res: Response) => {
  try {
    const settings = await storage.getSettings();
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update settings (admin only)
router.post('/', isAdmin, async (req: Request, res: Response) => {
  try {
    // Validate settings data
    const validationResult = settingsSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid settings data', 
        details: validationResult.error.format() 
      });
    }
    
    const settings = validationResult.data;
    
    // Update settings in storage
    const updatedSettings = await storage.updateSettings(settings);
    
    res.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
import express, { Request, Response } from "express";
import { storage } from "../storage";
import { insertCompanyInfoSchema } from "@shared/schema";
import { isAdmin } from "../auth";

const router = express.Router();

// Get all company info
router.get('/', async (req: Request, res: Response) => {
  try {
    const companyInfo = await storage.getAllCompanyInfo();
    res.json(companyInfo);
  } catch (error) {
    console.error("Error fetching company info:", error);
    res.status(500).json({ error: "Failed to fetch company info" });
  }
});

// Get company info by section
router.get('/section/:section', async (req: Request, res: Response) => {
  try {
    const section = req.params.section;
    const companyInfo = await storage.getCompanyInfoBySection(section);
    res.json(companyInfo);
  } catch (error) {
    console.error("Error fetching company info by section:", error);
    res.status(500).json({ error: "Failed to fetch company info" });
  }
});

// Get a specific company info
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    
    const companyInfo = await storage.getCompanyInfo(id);
    if (!companyInfo) {
      return res.status(404).json({ error: "Company info not found" });
    }
    
    res.json(companyInfo);
  } catch (error) {
    console.error("Error fetching company info:", error);
    res.status(500).json({ error: "Failed to fetch company info" });
  }
});

// Create a new company info (admin only)
router.post('/', isAdmin, async (req: Request, res: Response) => {
  try {
    const validatedData = insertCompanyInfoSchema.parse(req.body);
    const newCompanyInfo = await storage.createCompanyInfo(validatedData);
    res.status(201).json(newCompanyInfo);
  } catch (error) {
    console.error("Error creating company info:", error);
    res.status(400).json({ error: "Invalid company info data" });
  }
});

// Update a company info (admin only)
router.put('/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    
    const companyInfo = await storage.getCompanyInfo(id);
    if (!companyInfo) {
      return res.status(404).json({ error: "Company info not found" });
    }
    
    const validatedData = insertCompanyInfoSchema.partial().parse(req.body);
    const updatedCompanyInfo = await storage.updateCompanyInfo(id, validatedData);
    res.json(updatedCompanyInfo);
  } catch (error) {
    console.error("Error updating company info:", error);
    res.status(400).json({ error: "Invalid company info data" });
  }
});

// Delete a company info (admin only)
router.delete('/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    
    const companyInfo = await storage.getCompanyInfo(id);
    if (!companyInfo) {
      return res.status(404).json({ error: "Company info not found" });
    }
    
    await storage.deleteCompanyInfo(id);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting company info:", error);
    res.status(500).json({ error: "Failed to delete company info" });
  }
});

export default router;
import express, { Request, Response } from "express";
import { storage } from "../storage";
import { insertTeamMemberSchema } from "@shared/schema";
import { isAdmin } from "../auth";

const router = express.Router();

// Get all team members
router.get('/', async (req: Request, res: Response) => {
  try {
    const teamMembers = await storage.getAllTeamMembers();
    res.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ error: "Failed to fetch team members" });
  }
});

// Get a specific team member
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    
    const teamMember = await storage.getTeamMember(id);
    if (!teamMember) {
      return res.status(404).json({ error: "Team member not found" });
    }
    
    res.json(teamMember);
  } catch (error) {
    console.error("Error fetching team member:", error);
    res.status(500).json({ error: "Failed to fetch team member" });
  }
});

// Create a new team member (admin only)
router.post('/', isAdmin, async (req: Request, res: Response) => {
  try {
    const validatedData = insertTeamMemberSchema.parse(req.body);
    const newTeamMember = await storage.createTeamMember(validatedData);
    res.status(201).json(newTeamMember);
  } catch (error) {
    console.error("Error creating team member:", error);
    res.status(400).json({ error: "Invalid team member data" });
  }
});

// Update a team member (admin only)
router.put('/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    
    const teamMember = await storage.getTeamMember(id);
    if (!teamMember) {
      return res.status(404).json({ error: "Team member not found" });
    }
    
    const validatedData = insertTeamMemberSchema.partial().parse(req.body);
    const updatedTeamMember = await storage.updateTeamMember(id, validatedData);
    res.json(updatedTeamMember);
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(400).json({ error: "Invalid team member data" });
  }
});

// Delete a team member (admin only)
router.delete('/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    
    const teamMember = await storage.getTeamMember(id);
    if (!teamMember) {
      return res.status(404).json({ error: "Team member not found" });
    }
    
    await storage.deleteTeamMember(id);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({ error: "Failed to delete team member" });
  }
});

export default router;
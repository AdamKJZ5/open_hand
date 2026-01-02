import { Request, Response } from 'express';
import { Lead } from '../models/Lead';

export const createLead = async (req: Request, res: Response) => {
  try {
    const { clientName, contactEmail, phoneNumber, serviceNeeded, message } = req.body;

    const newLead = await Lead.create({
      clientName,
      contactEmail,
      phoneNumber,
      serviceNeeded,
      message
    });

    res.status(201).json({ 
      success: true,
      message: "Inquiry received! Our team will contact you soon." 
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Admin only: See all potential clients
export const getLeads = async (req: Request, res: Response) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

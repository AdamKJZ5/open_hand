import { Request, Response } from 'express';
import { Opportunity } from '../models/Opportunity';

export const getOpportunities = async (req: Request, res: Response) => {
  try {
    const opps = await Opportunity.find().populate('organizer', 'name');
    res.json(opps);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createOpportunity = async (req: Request, res: Response) => {
  try {
    const { title, description, location, date, organizerId } = req.body;
    const newOpp = await Opportunity.create({
      title,
      description,
      location,
      date,
      organizer: organizerId // We will automate this later with Auth Middleware
    });
    res.status(201).json(newOpp);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

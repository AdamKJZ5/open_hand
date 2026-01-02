import { Request, Response } from 'express';
import { Opportunity } from '../models/Opportunity';





export const createOpportunity = async (req: any, res: Response) => {
  try {
    const { title, description, location, date, category } = req.body;
    const newOpp = await Opportunity.create({
      title,
      description,
      location,
      date,
      category: category || 'Other',
      organizer: req.user.id 
    });
    res.status(201).json(newOpp);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};





export const getOpportunities = async (req: Request, res: Response) => {
  try {
    const opps = await Opportunity.find().populate('organizer', 'name');
    res.json(opps);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};





export const updateOpportunity = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    
    const updatedOpp = await Opportunity.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, 
    });

    if (!updatedOpp) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.status(200).json(updatedOpp);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};





export const deleteOpportunity = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const deletedOpp = await Opportunity.findByIdAndDelete(id);

    if (!deletedOpp) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.status(200).json({ message: 'Opportunity deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};





export const joinOpportunity = async (req: any, res: Response) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    const alreadyApplied = opportunity.applicants.find(
      (userId) => userId.toString() === req.user.id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already joined this opportunity' });
    }

    opportunity.applicants.push(req.user.id);
    await opportunity.save();

    res.status(200).json({ message: 'Successfully joined the opportunity!' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

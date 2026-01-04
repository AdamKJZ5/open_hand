import { Request, Response } from 'express';
import { JobPosting } from '../models/JobPosting';

// Get all active job postings (public)
export const getActiveJobPostings = async (req: Request, res: Response) => {
  try {
    const jobs = await JobPosting.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching active job postings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all job postings (admin only)
export const getAllJobPostings = async (req: Request, res: Response) => {
  try {
    const jobs = await JobPosting.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching all job postings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single job posting by ID
export const getJobPostingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const job = await JobPosting.findById(id);

    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error fetching job posting:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new job posting (admin only)
export const createJobPosting = async (req: Request, res: Response) => {
  try {
    const { title, department, location, type, description, requirements, responsibilities, salary } = req.body;

    const job = await JobPosting.create({
      title,
      department,
      location,
      type,
      description,
      requirements,
      responsibilities,
      salary,
      status: 'active'
    });

    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job posting:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update job posting (admin only)
export const updateJobPosting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const job = await JobPosting.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error updating job posting:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete job posting (admin only)
export const deleteJobPosting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const job = await JobPosting.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    res.json({ message: 'Job posting deleted successfully' });
  } catch (error) {
    console.error('Error deleting job posting:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

import { Request, Response } from 'express';
import { JobApplication } from '../models/JobApplication';
import { JobPosting } from '../models/JobPosting';
import { User } from '../models/Users';

// Submit job application
export const submitJobApplication = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const { fullName, email, phoneNumber, coverLetter, experience, availability } = req.body;
    const applicantId = (req as any).user.id;

    // Check if job posting exists and is active
    const jobPosting = await JobPosting.findById(jobId);
    if (!jobPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    if (jobPosting.status !== 'active') {
      return res.status(400).json({ message: 'This job posting is no longer accepting applications' });
    }

    // Check if user already applied
    const existingApplication = await JobApplication.findOne({
      jobPosting: jobId,
      applicant: applicantId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    // Create application
    const application = await JobApplication.create({
      jobPosting: jobId,
      applicant: applicantId,
      fullName,
      email,
      phoneNumber,
      coverLetter,
      experience,
      availability,
      status: 'pending'
    });

    // Update user's phone number if they're applying and becoming caretaker candidate
    const user = await User.findById(applicantId);
    if (user && !user.phoneNumber) {
      user.phoneNumber = phoneNumber;
      await user.save();
    }

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }
    console.error('Error submitting job application:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's job applications
export const getMyJobApplications = async (req: Request, res: Response) => {
  try {
    const applicantId = (req as any).user.id;

    const applications = await JobApplication.find({ applicant: applicantId })
      .populate('jobPosting')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all job applications (admin only)
export const getAllJobApplications = async (req: Request, res: Response) => {
  try {
    const { status, jobId } = req.query;

    let filter: any = {};
    if (status) filter.status = status;
    if (jobId) filter.jobPosting = jobId;

    const applications = await JobApplication.find(filter)
      .populate('jobPosting')
      .populate('applicant', 'name email')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching all job applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update job application status (admin only)
export const updateJobApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const application = await JobApplication.findByIdAndUpdate(
      id,
      { status, adminNotes },
      { new: true }
    ).populate('jobPosting').populate('applicant', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // If accepted, consider promoting user to caretaker role
    if (status === 'accepted') {
      const user = await User.findById(application.applicant);
      if (user && user.role === 'default') {
        // Optionally auto-promote to caretaker, or leave for manual promotion
        // user.role = 'caretaker';
        // await user.save();
      }
    }

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete job application (admin only)
export const deleteJobApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

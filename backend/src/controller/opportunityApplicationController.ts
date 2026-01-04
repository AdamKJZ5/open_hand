import { Request, Response } from 'express';
import OpportunityApplication from '../../models/OpportunityApplication';
import Opportunity from '../models/Opportunity';

// @desc    Apply to an opportunity
// @route   POST /api/opportunities/:id/apply
// @access  Protected
export const applyToOpportunity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, availability, experience } = req.body;
    const user = (req as any).user;
    const opportunityId = req.params.id;

    // Check if opportunity exists
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
      return;
    }

    // Check if already applied
    const existingApplication = await OpportunityApplication.findOne({
      opportunity: opportunityId,
      applicant: user.id
    });

    if (existingApplication) {
      res.status(400).json({
        success: false,
        message: 'You have already applied to this opportunity'
      });
      return;
    }

    // Create application
    const application = await OpportunityApplication.create({
      opportunity: opportunityId,
      applicant: user.id,
      message,
      availability,
      experience
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};

// @desc    Get user's own applications
// @route   GET /api/opportunity-applications/my-applications
// @access  Protected
export const getMyApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;

    const applications = await OpportunityApplication.find({ applicant: user.id })
      .populate('opportunity', 'title description location date category status')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve applications',
      error: error.message
    });
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/opportunity-applications
// @access  Admin
export const getAllApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, opportunityId, page = 1, limit = 20 } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (opportunityId) query.opportunity = opportunityId;

    const skip = (Number(page) - 1) * Number(limit);

    const applications = await OpportunityApplication.find(query)
      .populate('applicant', 'name email role')
      .populate('opportunity', 'title description location date category')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await OpportunityApplication.countDocuments(query);

    res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve applications',
      error: error.message
    });
  }
};

// @desc    Get applications for a specific opportunity
// @route   GET /api/opportunities/:id/applications
// @access  Admin
export const getOpportunityApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const opportunityId = req.params.id;

    const applications = await OpportunityApplication.find({ opportunity: opportunityId })
      .populate('applicant', 'name email role')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve applications',
      error: error.message
    });
  }
};

// @desc    Update application status (Admin)
// @route   PUT /api/opportunity-applications/:id/status
// @access  Admin
export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, adminNotes } = req.body;
    const user = (req as any).user;

    const application = await OpportunityApplication.findById(req.params.id);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found'
      });
      return;
    }

    application.status = status;
    if (adminNotes) application.adminNotes = adminNotes;
    application.reviewedBy = user.id;
    application.reviewedAt = new Date();

    await application.save();

    const populatedApplication = await OpportunityApplication.findById(application._id)
      .populate('applicant', 'name email')
      .populate('opportunity', 'title')
      .populate('reviewedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: populatedApplication
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to update application status',
      error: error.message
    });
  }
};

// @desc    Delete application (Admin)
// @route   DELETE /api/opportunity-applications/:id
// @access  Admin
export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await OpportunityApplication.findById(req.params.id);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found'
      });
      return;
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete application',
      error: error.message
    });
  }
};

// @desc    Get application statistics (Admin)
// @route   GET /api/opportunity-applications/stats
// @access  Admin
export const getApplicationStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await OpportunityApplication.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await OpportunityApplication.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: stats
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics',
      error: error.message
    });
  }
};

import { Request, Response } from 'express';
import ResidentApplication from '../../models/ResidentApplication';

// @desc    Submit a new resident application
// @route   POST /api/resident-applications
// @access  Public (or Protected if user is logged in)
export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const applicationData = {
      ...req.body,
      submittedBy: (req as any).user?.id || undefined // Attach user if logged in
    };

    const application = await ResidentApplication.create(applicationData);

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

// @desc    Get all resident applications (with filters)
// @route   GET /api/resident-applications
// @access  Admin only
export const getAllApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, careLevel, page = 1, limit = 10 } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (careLevel) query.careLevel = careLevel;

    const skip = (Number(page) - 1) * Number(limit);

    const applications = await ResidentApplication.find(query)
      .populate('submittedBy', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ResidentApplication.countDocuments(query);

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

// @desc    Get a single resident application by ID
// @route   GET /api/resident-applications/:id
// @access  Admin or Owner
export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await ResidentApplication.findById(req.params.id)
      .populate('submittedBy', 'name email role')
      .populate('reviewedBy', 'name email');

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found'
      });
      return;
    }

    // Check if user is admin or the one who submitted
    const user = (req as any).user;
    const isOwner = application.submittedBy?.toString() === user?.id;
    const isAdmin = user?.role === 'admin';

    if (!isAdmin && !isOwner) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve application',
      error: error.message
    });
  }
};

// @desc    Update application status (Admin only)
// @route   PUT /api/resident-applications/:id/status
// @access  Admin only
export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, adminNotes } = req.body;
    const user = (req as any).user;

    const application = await ResidentApplication.findById(req.params.id);

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

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to update application status',
      error: error.message
    });
  }
};

// @desc    Update application details (before review)
// @route   PUT /api/resident-applications/:id
// @access  Admin or Owner (only if status is pending)
export const updateApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await ResidentApplication.findById(req.params.id);

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found'
      });
      return;
    }

    const user = (req as any).user;
    const isOwner = application.submittedBy?.toString() === user?.id;
    const isAdmin = user?.role === 'admin';

    // Only allow updates if pending or by admin
    if (!isAdmin && (application.status !== 'pending' || !isOwner)) {
      res.status(403).json({
        success: false,
        message: 'Cannot update application at this stage'
      });
      return;
    }

    // Don't allow changing status through this endpoint
    const { status, reviewedBy, reviewedAt, adminNotes, ...updateData } = req.body;

    Object.assign(application, updateData);
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to update application',
      error: error.message
    });
  }
};

// @desc    Delete application
// @route   DELETE /api/resident-applications/:id
// @access  Admin only
export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await ResidentApplication.findById(req.params.id);

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

// @desc    Get applications submitted by current user
// @route   GET /api/resident-applications/my-applications
// @access  Protected
export const getMyApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;

    const applications = await ResidentApplication.find({ submittedBy: user.id })
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

// @desc    Get application statistics (for admin dashboard)
// @route   GET /api/resident-applications/stats
// @access  Admin only
export const getApplicationStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await ResidentApplication.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const careLevelStats = await ResidentApplication.aggregate([
      {
        $group: {
          _id: '$careLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await ResidentApplication.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: stats,
        byCareLevel: careLevelStats
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

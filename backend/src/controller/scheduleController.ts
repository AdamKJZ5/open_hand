import { Request, Response } from 'express';
import { CaretakerSchedule } from '../models/CaretakerSchedule';
import { ResidentSchedule } from '../models/ResidentSchedule';
import { User } from '../models/Users';
import { generateCaretakerScheduleICS, generateResidentScheduleICS } from '../utils/icsGenerator';
import { notificationService } from '../services/notificationService';

// ============= CARETAKER SCHEDULE CONTROLLERS =============

// @desc    Get caretaker schedule
// @route   GET /api/schedules/caretaker/:userId
// @access  Protected (caretakers can view own, admins can view all)
export const getCaretakerSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { userId } = req.params;

    // Check authorization
    const isOwn = user.id === userId;
    const isAdmin = user.role === 'admin';

    if (!isOwn && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view this schedule'
      });
      return;
    }

    // Get current active schedule
    const now = new Date();
    const schedule = await CaretakerSchedule.findOne({
      caretakerId: userId,
      effectiveFrom: { $lte: now },
      $or: [
        { effectiveTo: { $exists: false } },
        { effectiveTo: { $gte: now } }
      ]
    })
      .populate('caretakerId', 'name email role')
      .populate('createdBy', 'name')
      .populate('lastModifiedBy', 'name');

    if (!schedule) {
      res.status(404).json({
        success: false,
        message: 'No active schedule found for this caretaker'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: schedule
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve schedule',
      error: error.message
    });
  }
};

// @desc    Get current shift for caretaker
// @route   GET /api/schedules/caretaker/:userId/current-shift
// @access  Protected
export const getCurrentShift = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { userId } = req.params;

    // Check authorization
    const isOwn = user.id === userId;
    const isAdmin = user.role === 'admin';

    if (!isOwn && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view this schedule'
      });
      return;
    }

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const schedule = await CaretakerSchedule.findOne({
      caretakerId: userId,
      effectiveFrom: { $lte: now },
      $or: [
        { effectiveTo: { $exists: false } },
        { effectiveTo: { $gte: now } }
      ]
    });

    if (!schedule) {
      res.status(404).json({
        success: false,
        message: 'No active schedule found'
      });
      return;
    }

    // Find current shift
    const currentShift = schedule.shifts.find(shift => {
      if (shift.specificDate) {
        const shiftDate = new Date(shift.specificDate);
        const isToday = shiftDate.toDateString() === now.toDateString();
        if (!isToday) return false;
      } else if (shift.dayOfWeek !== currentDay) {
        return false;
      }

      return currentTime >= shift.startTime && currentTime <= shift.endTime;
    });

    if (!currentShift) {
      res.status(200).json({
        success: true,
        message: 'Not currently on shift',
        data: { onDuty: false }
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        onDuty: true,
        shift: currentShift
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to get current shift',
      error: error.message
    });
  }
};

// @desc    Create caretaker schedule
// @route   POST /api/schedules/caretaker
// @access  Admin only
export const createCaretakerSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { caretakerId, shifts, effectiveFrom, effectiveTo, notes } = req.body;

    // Validate caretaker exists and has caretaker role
    const caretaker = await User.findById(caretakerId);
    if (!caretaker) {
      res.status(404).json({
        success: false,
        message: 'Caretaker not found'
      });
      return;
    }

    if (caretaker.role !== 'caretaker') {
      res.status(400).json({
        success: false,
        message: 'User is not a caretaker'
      });
      return;
    }

    // Create schedule
    const schedule = await CaretakerSchedule.create({
      caretakerId,
      shifts,
      effectiveFrom: effectiveFrom || new Date(),
      effectiveTo,
      notes,
      createdBy: user.id,
      lastModifiedBy: user.id
    });

    // Update user's hasSchedule flag
    caretaker.hasSchedule = true;
    await caretaker.save();

    const populatedSchedule = await CaretakerSchedule.findById(schedule._id)
      .populate('caretakerId', 'name email')
      .populate('createdBy', 'name');

    // Trigger notification service (non-blocking)
    notificationService.sendScheduleChangeNotification(populatedSchedule, 'created').catch(error => {
      console.error('Failed to send schedule notification:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: populatedSchedule
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to create schedule',
      error: error.message
    });
  }
};

// @desc    Update caretaker schedule
// @route   PUT /api/schedules/caretaker/:scheduleId
// @access  Admin only
export const updateCaretakerSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { scheduleId } = req.params;
    const { shifts, effectiveFrom, effectiveTo, notes } = req.body;

    const schedule = await CaretakerSchedule.findById(scheduleId);

    if (!schedule) {
      res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
      return;
    }

    // Update fields
    if (shifts) schedule.shifts = shifts;
    if (effectiveFrom) schedule.effectiveFrom = effectiveFrom;
    if (effectiveTo !== undefined) schedule.effectiveTo = effectiveTo;
    if (notes !== undefined) schedule.notes = notes;
    schedule.lastModifiedBy = user.id;

    await schedule.save();

    const populatedSchedule = await CaretakerSchedule.findById(schedule._id)
      .populate('caretakerId', 'name email')
      .populate('lastModifiedBy', 'name');

    // Trigger notification service (non-blocking)
    notificationService.sendScheduleChangeNotification(populatedSchedule, 'updated').catch(error => {
      console.error('Failed to send schedule notification:', error);
    });

    res.status(200).json({
      success: true,
      message: 'Schedule updated successfully',
      data: populatedSchedule
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to update schedule',
      error: error.message
    });
  }
};

// @desc    Delete caretaker schedule
// @route   DELETE /api/schedules/caretaker/:scheduleId
// @access  Admin only
export const deleteCaretakerSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { scheduleId } = req.params;

    const schedule = await CaretakerSchedule.findById(scheduleId);

    if (!schedule) {
      res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
      return;
    }

    const caretakerId = schedule.caretakerId;
    await schedule.deleteOne();

    // Update user's hasSchedule flag if no other schedules exist
    const remainingSchedules = await CaretakerSchedule.countDocuments({
      caretakerId
    });

    if (remainingSchedules === 0) {
      await User.findByIdAndUpdate(caretakerId, { hasSchedule: false });
    }

    res.status(200).json({
      success: true,
      message: 'Schedule deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete schedule',
      error: error.message
    });
  }
};

// @desc    Export caretaker schedule as ICS
// @route   GET /api/schedules/caretaker/:userId/export
// @access  Protected
export const exportCaretakerSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { userId } = req.params;

    // Check authorization
    const isOwn = user.id === userId;
    const isAdmin = user.role === 'admin';

    if (!isOwn && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to export this schedule'
      });
      return;
    }

    const now = new Date();
    const schedule = await CaretakerSchedule.findOne({
      caretakerId: userId,
      effectiveFrom: { $lte: now },
      $or: [
        { effectiveTo: { $exists: false } },
        { effectiveTo: { $gte: now } }
      ]
    }).populate('caretakerId', 'name');

    if (!schedule) {
      res.status(404).json({
        success: false,
        message: 'No active schedule found'
      });
      return;
    }

    // Generate ICS file
    const caretaker = schedule.caretakerId as any;
    const icsContent = generateCaretakerScheduleICS(
      caretaker.name,
      schedule.shifts,
      schedule.effectiveFrom
    );

    // Set response headers for file download
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${caretaker.name.replace(/\s+/g, '-')}-schedule.ics"`);
    res.send(icsContent);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to export schedule',
      error: error.message
    });
  }
};

// ============= RESIDENT SCHEDULE CONTROLLERS =============

// @desc    Get resident schedule
// @route   GET /api/schedules/resident/:userId
// @access  Protected (residents/families can view own, admins can view all)
export const getResidentSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { userId } = req.params;

    // Check authorization
    const isOwn = user.id === userId;
    const isAdmin = user.role === 'admin';

    if (!isOwn && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view this schedule'
      });
      return;
    }

    const now = new Date();
    const schedule = await ResidentSchedule.findOne({
      residentId: userId,
      effectiveFrom: { $lte: now },
      $or: [
        { effectiveTo: { $exists: false } },
        { effectiveTo: { $gte: now } }
      ]
    })
      .populate('residentId', 'name email role')
      .populate('assignedCaretaker', 'name email phone')
      .populate('createdBy', 'name')
      .populate('lastModifiedBy', 'name');

    if (!schedule) {
      res.status(404).json({
        success: false,
        message: 'No active schedule found for this resident'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: schedule
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve schedule',
      error: error.message
    });
  }
};

// @desc    Get today's schedule for resident
// @route   GET /api/schedules/resident/:userId/today
// @access  Protected
export const getTodaySchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { userId } = req.params;

    // Check authorization
    const isOwn = user.id === userId;
    const isAdmin = user.role === 'admin';

    if (!isOwn && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view this schedule'
      });
      return;
    }

    const now = new Date();
    const currentDay = now.getDay();
    const today = now.toDateString();

    const schedule = await ResidentSchedule.findOne({
      residentId: userId,
      effectiveFrom: { $lte: now },
      $or: [
        { effectiveTo: { $exists: false } },
        { effectiveTo: { $gte: now } }
      ]
    }).populate('assignedCaretaker', 'name phone');

    if (!schedule) {
      res.status(404).json({
        success: false,
        message: 'No active schedule found'
      });
      return;
    }

    // Filter schedule items for today
    const todayItems = schedule.scheduleItems.filter(item => {
      if (item.specificDate) {
        const itemDate = new Date(item.specificDate);
        return itemDate.toDateString() === today;
      }
      return item.isRecurring && item.dayOfWeek === currentDay;
    });

    // Sort by start time
    todayItems.sort((a, b) => a.startTime.localeCompare(b.startTime));

    res.status(200).json({
      success: true,
      data: {
        scheduleItems: todayItems,
        assignedCaretaker: schedule.assignedCaretaker
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to get today\'s schedule',
      error: error.message
    });
  }
};

// @desc    Create resident schedule
// @route   POST /api/schedules/resident
// @access  Admin only
export const createResidentSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { residentId, scheduleItems, assignedCaretaker, effectiveFrom, effectiveTo, notes } = req.body;

    // Validate resident exists
    const resident = await User.findById(residentId);
    if (!resident) {
      res.status(404).json({
        success: false,
        message: 'Resident not found'
      });
      return;
    }

    // Validate assigned caretaker if provided
    if (assignedCaretaker) {
      const caretaker = await User.findById(assignedCaretaker);
      if (!caretaker || caretaker.role !== 'caretaker') {
        res.status(400).json({
          success: false,
          message: 'Invalid caretaker assignment'
        });
        return;
      }
    }

    // Create schedule
    const schedule = await ResidentSchedule.create({
      residentId,
      scheduleItems,
      assignedCaretaker,
      effectiveFrom: effectiveFrom || new Date(),
      effectiveTo,
      notes,
      createdBy: user.id,
      lastModifiedBy: user.id
    });

    // Update resident's hasSchedule flag
    resident.hasSchedule = true;
    await resident.save();

    const populatedSchedule = await ResidentSchedule.findById(schedule._id)
      .populate('residentId', 'name email')
      .populate('assignedCaretaker', 'name email')
      .populate('createdBy', 'name');

    // Trigger notification service (non-blocking)
    notificationService.sendScheduleChangeNotification(populatedSchedule, 'created').catch(error => {
      console.error('Failed to send schedule notification:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: populatedSchedule
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to create schedule',
      error: error.message
    });
  }
};

// @desc    Update resident schedule
// @route   PUT /api/schedules/resident/:scheduleId
// @access  Admin only
export const updateResidentSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { scheduleId } = req.params;
    const { scheduleItems, assignedCaretaker, effectiveFrom, effectiveTo, notes } = req.body;

    const schedule = await ResidentSchedule.findById(scheduleId);

    if (!schedule) {
      res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
      return;
    }

    // Update fields
    if (scheduleItems) schedule.scheduleItems = scheduleItems;
    if (assignedCaretaker !== undefined) schedule.assignedCaretaker = assignedCaretaker;
    if (effectiveFrom) schedule.effectiveFrom = effectiveFrom;
    if (effectiveTo !== undefined) schedule.effectiveTo = effectiveTo;
    if (notes !== undefined) schedule.notes = notes;
    schedule.lastModifiedBy = user.id;

    await schedule.save();

    const populatedSchedule = await ResidentSchedule.findById(schedule._id)
      .populate('residentId', 'name email')
      .populate('assignedCaretaker', 'name email')
      .populate('lastModifiedBy', 'name');

    // Trigger notification service (non-blocking)
    notificationService.sendScheduleChangeNotification(populatedSchedule, 'updated').catch(error => {
      console.error('Failed to send schedule notification:', error);
    });

    res.status(200).json({
      success: true,
      message: 'Schedule updated successfully',
      data: populatedSchedule
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to update schedule',
      error: error.message
    });
  }
};

// @desc    Delete resident schedule
// @route   DELETE /api/schedules/resident/:scheduleId
// @access  Admin only
export const deleteResidentSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { scheduleId } = req.params;

    const schedule = await ResidentSchedule.findById(scheduleId);

    if (!schedule) {
      res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
      return;
    }

    const residentId = schedule.residentId;
    await schedule.deleteOne();

    // Update resident's hasSchedule flag if no other schedules exist
    const remainingSchedules = await ResidentSchedule.countDocuments({
      residentId
    });

    if (remainingSchedules === 0) {
      await User.findByIdAndUpdate(residentId, { hasSchedule: false });
    }

    res.status(200).json({
      success: true,
      message: 'Schedule deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete schedule',
      error: error.message
    });
  }
};

// @desc    Export resident schedule as ICS
// @route   GET /api/schedules/resident/:userId/export
// @access  Protected
export const exportResidentSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { userId } = req.params;

    // Check authorization
    const isOwn = user.id === userId;
    const isAdmin = user.role === 'admin';

    if (!isOwn && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to export this schedule'
      });
      return;
    }

    const now = new Date();
    const schedule = await ResidentSchedule.findOne({
      residentId: userId,
      effectiveFrom: { $lte: now },
      $or: [
        { effectiveTo: { $exists: false } },
        { effectiveTo: { $gte: now } }
      ]
    }).populate('residentId', 'name');

    if (!schedule) {
      res.status(404).json({
        success: false,
        message: 'No active schedule found'
      });
      return;
    }

    // Generate ICS file
    const resident = schedule.residentId as any;
    const icsContent = generateResidentScheduleICS(
      resident.name,
      schedule.scheduleItems,
      schedule.effectiveFrom
    );

    // Set response headers for file download
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${resident.name.replace(/\s+/g, '-')}-schedule.ics"`);
    res.send(icsContent);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to export schedule',
      error: error.message
    });
  }
};

import { Request, Response } from 'express';
import { User } from '../models/Users';
import { logError } from '../config/logger';

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Fetch all users, exclude password field
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    logError('Error fetching users', error as Error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user role (admin only)
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ['admin', 'caretaker', 'family', 'default'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(userId).select('-password');
    res.json({ message: 'User role updated successfully', user: updatedUser });
  } catch (error) {
    logError('Error updating user role', error as Error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle user schedule status (admin only)
export const toggleUserSchedule = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { hasSchedule } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.hasSchedule = hasSchedule;
    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(userId).select('-password');
    res.json({ message: 'User schedule status updated successfully', user: updatedUser });
  } catch (error) {
    logError('Error updating user schedule', error as Error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin user' });
      }
    }

    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logError('Error deleting user', error as Error);
    res.status(500).json({ message: 'Server error' });
  }
};

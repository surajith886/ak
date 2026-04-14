import { Response } from 'express';
import Notification from '../models/notificationModel';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private (usually for admins)
export const getNotifications = async (req: AuthRequest, res: Response) => {
  // Can filter based on role if needed, currently fetching all for simple admin panel
  const notifications = await Notification.find({}).sort({ createdAt: -1 });
  res.json(notifications);
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req: AuthRequest, res: Response) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    notification.read = true;
    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } else {
    res.status(404).json({ message: 'Notification not found' });
  }
};

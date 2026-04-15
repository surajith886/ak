import { Response } from 'express';
import Notification from '../models/notificationModel';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private (usually for admins)
export const getNotifications = async (req: AuthRequest, res: Response) => {
  const notifications = await Notification.findAll({ order: [['createdAt', 'DESC']] });
  res.json(notifications);
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req: AuthRequest, res: Response) => {
  const notification = await Notification.findByPk(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

  if (notification) {
    await notification.update({ read: true });
    res.json(notification);
  } else {
    res.status(404).json({ message: 'Notification not found' });
  }
};

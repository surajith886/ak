import { Response } from 'express';
import Order from '../models/orderModel';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req: AuthRequest, res: Response) => {
  const { items, total, prescriptionUrl, prescriptionRequired } = req.body;

  if (items && items.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    const order = new Order({
      customerId: req.user?._id,
      customerName: req.user?.name,
      items,
      total,
      prescriptionUrl,
      prescriptionRequired,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
};

// @desc    Get all orders (admin sees all, customer sees theirs)
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req: AuthRequest, res: Response) => {
  if (req.user?.role === 'admin') {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } else {
    const orders = await Order.find({ customerId: req.user?._id }).sort({ createdAt: -1 });
    res.json(orders);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin Validate Status Change
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  // Simple admin check
  if (req.user?.role !== 'admin') {
    res.status(401).json({ message: 'Not authorized as an admin' });
    return;
  }

  if (order) {
    order.status = status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

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
    const order = await Order.create({
      customerId: req.user?.id,
      customerName: req.user?.name,
      items,
      total,
      prescriptionUrl,
      prescriptionRequired,
    });

    res.status(201).json(order);
  }
};

// @desc    Get all orders (admin sees all, customer sees theirs)
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req: AuthRequest, res: Response) => {
  if (req.user?.role === 'admin') {
    const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
    res.json(orders);
  } else {
    const orders = await Order.findAll({
      where: { customerId: req.user?.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  const { status } = req.body;

  // Simple admin check
  if (req.user?.role !== 'admin') {
    res.status(401).json({ message: 'Not authorized as an admin' });
    return;
  }

  const order = await Order.findByPk(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

  if (order) {
    await order.update({ status: status || order.status });
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

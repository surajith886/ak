import express from 'express';
import { addOrderItems, getOrders, updateOrderStatus } from '../controllers/orderController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, getOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;

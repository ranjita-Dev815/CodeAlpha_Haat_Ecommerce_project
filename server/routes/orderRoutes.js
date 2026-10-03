import { Router } from 'express';
import {
  createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();
router.post('/', protect, createOrder);
router.get('/', protect, admin, getAllOrders);
router.get('/mine', protect, getMyOrders); // must stay above /:id
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;

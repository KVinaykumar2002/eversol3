import express from 'express';
import { authenticate, isAdmin } from '../../middleware/auth';
import analyticsRouter from './analytics';
import ordersRouter from './orders';
import productsRouter from './products';
import customersRouter from './customers';
import categoriesRouter from './categories';
import couponsRouter from './coupons';
import bannersRouter from './banners';
import reviewsRouter from './reviews';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

router.use('/analytics', analyticsRouter);
router.use('/orders', ordersRouter);
router.use('/products', productsRouter);
router.use('/customers', customersRouter);
router.use('/categories', categoriesRouter);
router.use('/coupons', couponsRouter);
router.use('/banners', bannersRouter);
router.use('/reviews', reviewsRouter);

export default router;



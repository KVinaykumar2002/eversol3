import express, { Response } from 'express';
import Coupon from '../../models/Coupon';
import { AuthRequest } from '../../middleware/auth';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @route   GET /api/admin/coupons
// @desc    Get all coupons
// @access  Private/Admin
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: coupons,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/coupons/:id
// @desc    Get single coupon
// @access  Private/Admin
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.json({
      success: true,
      data: coupon,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/admin/coupons
// @desc    Create coupon
// @access  Private/Admin
router.post(
  '/',
  [
    body('code').trim().notEmpty().withMessage('Coupon code is required'),
    body('discountType').isIn(['percentage', 'fixed']).withMessage('Invalid discount type'),
    body('discountValue').isFloat({ min: 0 }).withMessage('Discount value must be positive'),
    body('validUntil').isISO8601().withMessage('Valid until date is required'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const {
        code,
        description,
        discountType,
        discountValue,
        minPurchase,
        maxDiscount,
        validFrom,
        validUntil,
        usageLimit,
        isActive,
      } = req.body;

      const coupon = await Coupon.create({
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue,
        minPurchase,
        maxDiscount,
        validFrom: validFrom || new Date(),
        validUntil,
        usageLimit,
        isActive: isActive !== undefined ? isActive : true,
      });

      res.status(201).json({
        success: true,
        data: coupon,
        message: 'Coupon created successfully',
      });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ success: false, message: 'Coupon code already exists' });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// @route   PUT /api/admin/coupons/:id
// @desc    Update coupon
// @access  Private/Admin
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    // Uppercase code if being updated
    if (req.body.code) {
      req.body.code = req.body.code.toUpperCase();
    }

    Object.assign(coupon, req.body);
    await coupon.save();

    res.json({
      success: true,
      data: coupon,
      message: 'Coupon updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/coupons/:id
// @desc    Delete coupon
// @access  Private/Admin
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    await Coupon.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;



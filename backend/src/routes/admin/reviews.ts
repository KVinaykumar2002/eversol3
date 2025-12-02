import express, { Response } from 'express';
import Review from '../../models/Review';
import { AuthRequest } from '../../middleware/auth';

const router = express.Router();

// @route   GET /api/admin/reviews
// @desc    Get all reviews with filters
// @access  Private/Admin
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { isApproved, isVisible, product, page = 1, limit = 10 } = req.query;

    const query: any = {};

    if (isApproved !== undefined) {
      query.isApproved = isApproved === 'true';
    }

    if (isVisible !== undefined) {
      query.isVisible = isVisible === 'true';
    }

    if (product) {
      query.product = product;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .populate('product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/reviews/:id/approve
// @desc    Approve review
// @access  Private/Admin
router.put('/:id/approve', async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.isApproved = true;
    review.isVisible = true;
    await review.save();

    res.json({
      success: true,
      data: review,
      message: 'Review approved successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/reviews/:id/hide
// @desc    Hide review
// @access  Private/Admin
router.put('/:id/hide', async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.isVisible = false;
    await review.save();

    res.json({
      success: true,
      data: review,
      message: 'Review hidden successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/reviews/:id
// @desc    Delete review
// @access  Private/Admin
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;



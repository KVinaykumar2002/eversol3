import express, { Response } from 'express';
import Banner from '../../models/Banner';
import { AuthRequest } from '../../middleware/auth';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @route   GET /api/admin/banners
// @desc    Get all banners
// @access  Private/Admin
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { position } = req.query;
    const query: any = {};
    if (position) {
      query.position = position;
    }

    const banners = await Banner.find(query).sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      data: banners,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/banners/:id
// @desc    Get single banner
// @access  Private/Admin
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    res.json({
      success: true,
      data: banner,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/admin/banners
// @desc    Create banner
// @access  Private/Admin
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Banner title is required'),
    body('image').trim().notEmpty().withMessage('Banner image is required'),
    body('position').isIn(['hero', 'top', 'middle', 'bottom']).withMessage('Invalid position'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { title, subtitle, image, link, position, isActive, order } = req.body;

      const banner = await Banner.create({
        title,
        subtitle,
        image,
        link,
        position,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0,
      });

      res.status(201).json({
        success: true,
        data: banner,
        message: 'Banner created successfully',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// @route   PUT /api/admin/banners/:id
// @desc    Update banner
// @access  Private/Admin
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    Object.assign(banner, req.body);
    await banner.save();

    res.json({
      success: true,
      data: banner,
      message: 'Banner updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/banners/:id
// @desc    Delete banner
// @access  Private/Admin
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    await Banner.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;



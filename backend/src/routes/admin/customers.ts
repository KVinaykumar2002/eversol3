import express, { Response } from 'express';
import User from '../../models/User';
import Order from '../../models/Order';
import { AuthRequest } from '../../middleware/auth';

const router = express.Router();

// @route   GET /api/admin/customers
// @desc    Get all customers
// @access  Private/Admin
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const query: any = { role: 'user' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const customers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    // Get order counts for each customer
    const customersWithOrders = await Promise.all(
      customers.map(async (customer) => {
        const orderCount = await Order.countDocuments({ user: customer._id });
        const totalSpent = await Order.aggregate([
          { $match: { user: customer._id } },
          { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);

        return {
          ...customer.toObject(),
          orderCount,
          totalSpent: totalSpent[0]?.total || 0,
        };
      })
    );

    res.json({
      success: true,
      data: {
        customers: customersWithOrders,
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

// @route   GET /api/admin/customers/:id
// @desc    Get single customer with orders
// @access  Private/Admin
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    if (!customer || customer.role !== 'user') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const orders = await Order.find({ user: customer._id })
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 });

    const totalSpent = await Order.aggregate([
      { $match: { user: customer._id } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    res.json({
      success: true,
      data: {
        customer,
        orders,
        totalSpent: totalSpent[0]?.total || 0,
        orderCount: orders.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/customers/:id
// @desc    Update customer
// @access  Private/Admin
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== 'user') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Don't allow role or password updates through this route
    const { role, password, ...updateData } = req.body;
    Object.assign(customer, updateData);
    await customer.save();

    res.json({
      success: true,
      data: customer,
      message: 'Customer updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/customers/:id
// @desc    Delete customer
// @access  Private/Admin
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== 'user') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;



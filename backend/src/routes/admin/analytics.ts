import express, { Response } from 'express';
import Order from '../../models/Order';
import Product from '../../models/Product';
import User from '../../models/User';
import Category from '../../models/Category';
import { AuthRequest } from '../../middleware/auth';

const router = express.Router();

// @route   GET /api/admin/analytics/overview
// @desc    Get overview analytics
// @access  Private/Admin
router.get('/overview', async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Total sales
    const totalSales = await Order.countDocuments();

    // Total revenue
    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' },
        },
      },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    // Total customers
    const totalCustomers = await User.countDocuments({ role: 'user' });

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Today's stats
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: startOfToday } });
    const todayRevenue = await Order.aggregate([
      {
        $match: { createdAt: { $gte: startOfToday } },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' },
        },
      },
    ]);
    const todayRevenueAmount = todayRevenue[0]?.total || 0;

    // Sales by category
    const salesByCategory = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.category',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category._id',
          name: { $first: '$category.name' },
          totalSales: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
    ]);

    // Low stock products
    const lowStockProducts = await Product.find({
      stock: { $lte: 10 },
      isActive: true,
    })
      .select('name stock images price')
      .limit(10);

    // Sales trends (last 7 days)
    const salesTrends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));

      const orders = await Order.countDocuments({
        createdAt: { $gte: start, $lte: end },
      });

      const revenue = await Order.aggregate([
        {
          $match: { createdAt: { $gte: start, $lte: end } },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalPrice' },
          },
        },
      ]);

      salesTrends.push({
        date: start.toISOString().split('T')[0],
        orders,
        revenue: revenue[0]?.total || 0,
      });
    }

    // Monthly sales (last 12 months)
    const monthlySales = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

      const orders = await Order.countDocuments({
        createdAt: { $gte: start, $lte: end },
      });

      const revenue = await Order.aggregate([
        {
          $match: { createdAt: { $gte: start, $lte: end } },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalPrice' },
          },
        },
      ]);

      monthlySales.push({
        month: start.toISOString().slice(0, 7),
        orders,
        revenue: revenue[0]?.total || 0,
      });
    }

    res.json({
      success: true,
      data: {
        overview: {
          totalSales,
          totalRevenue,
          totalCustomers,
          totalOrders,
          todayOrders,
          todayRevenue: todayRevenueAmount,
        },
        salesByCategory,
        lowStockProducts,
        salesTrends,
        monthlySales,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;



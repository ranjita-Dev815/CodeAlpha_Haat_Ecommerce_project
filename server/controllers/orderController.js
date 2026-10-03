import Order from '../models/Order.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import calcPrices from '../utils/calcPrices.js';

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;
const ADDRESS_FIELDS = ['fullName', 'phone', 'address', 'city', 'state', 'postalCode'];
const STATUSES = ['processing', 'shipped', 'delivered', 'cancelled'];

// POST /api/orders
// Body: { orderItems: [{ product: "<id>", qty: 2 }], shippingAddress: {...}, paymentMethod: "cod" | "razorpay" }
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body || {};

  if (!Array.isArray(orderItems) || orderItems.length === 0 || orderItems.length > 50) {
    throw new ApiError(400, 'Order must contain between 1 and 50 items');
  }
  if (!['cod', 'razorpay'].includes(paymentMethod)) {
    throw new ApiError(400, 'Invalid payment method');
  }
  if (!shippingAddress || ADDRESS_FIELDS.some((f) => typeof shippingAddress[f] !== 'string' || !shippingAddress[f].trim())) {
    throw new ApiError(400, `Shipping address requires: ${ADDRESS_FIELDS.join(', ')}`);
  }

  // Merge duplicate lines and validate input shape
  const wanted = new Map();
  for (const line of orderItems) {
    if (typeof line?.product !== 'string' || !OBJECT_ID_RE.test(line.product)) {
      throw new ApiError(400, 'Invalid product id in order');
    }
    if (!Number.isInteger(line.qty) || line.qty < 1 || line.qty > 20) {
      throw new ApiError(400, 'Quantity must be a whole number between 1 and 20');
    }
    const id = line.product.toLowerCase();
    wanted.set(id, (wanted.get(id) || 0) + line.qty);
  }

  // Name, image and price always come from the database, never from the client
  const products = await Product.find({ _id: { $in: [...wanted.keys()] } });
  if (products.length !== wanted.size) throw new ApiError(404, 'One or more products not found');

  const items = products.map((p) => ({
    product: p._id,
    name: p.name,
    image: p.image,
    price: p.price,
    qty: wanted.get(p._id.toString()),
  }));

  // Atomic stock decrement: the { stock: { $gte: qty } } condition prevents overselling
  // even when two customers buy the last unit at the same time.
  const reserved = [];
  try {
    for (const item of items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.qty } },
        { $inc: { stock: -item.qty } }
      );
      if (!updated) throw new ApiError(400, `Insufficient stock for "${item.name}"`);
      reserved.push(item);
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems: items,
      shippingAddress: Object.fromEntries(ADDRESS_FIELDS.map((f) => [f, shippingAddress[f].trim()])),
      paymentMethod,
      ...calcPrices(items),
    });
    res.status(201).json(order);
  } catch (err) {
    // Roll back any stock we already reserved
    await Promise.all(
      reserved.map((i) => Product.updateOne({ _id: i.product }, { $inc: { stock: i.qty } }))
    );
    throw err;
  }
});

// GET /api/orders/mine
export const getMyOrders = asyncHandler(async (req, res) => {
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
});

// GET /api/orders/:id  (owner or admin)
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) throw new ApiError(404, 'Order not found');
  const isOwner = order.user._id.equals(req.user._id);
  if (!isOwner && req.user.role !== 'admin') throw new ApiError(403, 'Not allowed to view this order');
  res.json(order);
});

// GET /api/orders?page=  (admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = 20;
  const total = await Order.countDocuments();
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ orders, page, pages: Math.ceil(total / limit), total });
});

// PUT /api/orders/:id/status  (admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body || {};
  if (!STATUSES.includes(status)) throw new ApiError(400, `Status must be one of: ${STATUSES.join(', ')}`);

  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  if (['delivered', 'cancelled'].includes(order.status)) {
    throw new ApiError(400, `Order is already ${order.status}`);
  }

  if (status === 'cancelled') {
    // Put the stock back
    await Promise.all(
      order.orderItems.map((i) => Product.updateOne({ _id: i.product }, { $inc: { stock: i.qty } }))
    );
  }
  if (status === 'delivered') {
    order.deliveredAt = new Date();
    if (order.paymentMethod === 'cod' && !order.isPaid) {
      order.isPaid = true; // cash collected on delivery
      order.paidAt = new Date();
    }
  }
  order.status = status;
  await order.save();
  res.json(order);
});

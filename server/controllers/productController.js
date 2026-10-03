import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// NOTE: added 'images' so admin create/update can also set the gallery array
const FIELDS = ['name', 'description', 'price', 'category', 'brand', 'image', 'images', 'stock'];
const pick = (obj = {}) =>
  Object.fromEntries(FIELDS.filter((f) => obj[f] !== undefined).map((f) => [f, obj[f]]));

const SORTS = {
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
};

// GET /api/products?keyword=&category=&minPrice=&maxPrice=&sort=&page=&limit=
export const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, minPrice, maxPrice, sort } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 50);

  const filter = {};
  if (typeof keyword === 'string' && keyword.trim()) {
    filter.name = { $regex: escapeRegex(keyword.trim()), $options: 'i' };
  }
  if (typeof category === 'string' && category && category !== 'all') {
    filter.category = category;
  }
  const min = Number(minPrice);
  const max = Number(maxPrice);
  if (minPrice !== undefined && !Number.isNaN(min)) filter.price = { ...filter.price, $gte: min };
  if (maxPrice !== undefined && !Number.isNaN(max)) filter.price = { ...filter.price, $lte: max };

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(SORTS[sort] || SORTS.newest)
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ products, page, pages: Math.ceil(total / limit), total });
});

// GET /api/products/categories
export const getCategories = asyncHandler(async (req, res) => {
  res.json(await Product.distinct('category'));
});

// GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.json(product);
});

// POST /api/products  (admin)
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(pick(req.body));
  res.status(201).json(product);
});

// PUT /api/products/:id  (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  product.set(pick(req.body));
  await product.save(); // runs schema validators
  res.json(product);
});

// DELETE /api/products/:id  (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ message: 'Product removed' });
});

// NEW ------------------------------------------------------------------

// POST /api/products/:id/reviews  (any logged-in user, once per product)
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment?.trim()) {
    throw new ApiError(400, 'Rating and comment are required');
  }

  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  const alreadyReviewed = product.reviews.some(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) throw new ApiError(400, 'You have already reviewed this product');

  product.reviews.push({
    name: req.user.name,
    rating: Number(rating),
    comment: comment.trim(),
    user: req.user._id,
  });

  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json(product);
});

// GET /api/products/:id/related?limit=4
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  const limit = Math.min(Math.max(parseInt(req.query.limit) || 4, 1), 12);

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(limit);

  res.json(related);
});

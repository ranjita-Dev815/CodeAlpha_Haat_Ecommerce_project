import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/users/wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json(user.wishlist);
});

// POST /api/users/wishlist/:productId
export const addToWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;

  if (!user.wishlist.some((id) => id.toString() === productId)) {
    user.wishlist.push(productId);
    await user.save();
  }

  await user.populate('wishlist');
  res.status(201).json(user.wishlist);
});

// DELETE /api/users/wishlist/:productId
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;

  user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  await user.save();

  await user.populate('wishlist');
  res.json(user.wishlist);
});

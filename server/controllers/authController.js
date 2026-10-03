import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sendAuth = (res, user, status = 200) =>
  res.status(status).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};

  // typeof checks also block NoSQL-injection payloads like { "email": { "$gt": "" } }
  if ([name, email, password].some((v) => typeof v !== 'string') || !name.trim()) {
    throw new ApiError(400, 'Name, email and password are required');
  }
  if (!EMAIL_RE.test(email)) throw new ApiError(400, 'Please enter a valid email');
  if (password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters');

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new ApiError(409, 'Email already registered');

  // role is never taken from the request body -> nobody can self-register as admin
  const user = await User.create({ name, email, password });
  sendAuth(res, user, 201);
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password'); // same message for both cases
  }
  sendAuth(res, user);
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email, role } = req.user;
  res.json({ _id, name, email, role });
});

// PUT /api/auth/profile  (update own name)
export const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    throw new ApiError(400, 'Name is required');
  }

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  user.name = name.trim();
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: req.headers.authorization.split(' ')[1],
  });
});

import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

const img = (seed) => `https://picsum.photos/seed/${seed}/600/600`;

const products = [
  { name: 'Wireless Bluetooth Headphones', description: 'Over-ear headphones with 30-hour battery life and active noise cancellation.', price: 2499, category: 'Electronics', brand: 'SoundMax', image: img('headphones'), stock: 40 },
  { name: 'Smart Fitness Band', description: 'Heart-rate, SpO2 and sleep tracking with a 10-day battery.', price: 1799, category: 'Electronics', brand: 'FitPulse', image: img('band'), stock: 60 },
  { name: 'Mechanical Keyboard', description: 'Hot-swappable mechanical keyboard with RGB backlight.', price: 3499, category: 'Electronics', brand: 'KeyForge', image: img('keyboard'), stock: 25 },
  { name: '20000mAh Power Bank', description: 'Fast-charging power bank with dual USB-C output.', price: 1299, category: 'Electronics', brand: 'ChargeUp', image: img('powerbank'), stock: 80 },
  { name: 'Cotton Crew-Neck T-Shirt', description: 'Soft 100% cotton regular-fit t-shirt.', price: 499, category: 'Fashion', brand: 'UrbanWear', image: img('tshirt'), stock: 120 },
  { name: 'Slim Fit Denim Jeans', description: 'Stretch denim jeans with a modern slim fit.', price: 1499, category: 'Fashion', brand: 'DenimCo', image: img('jeans'), stock: 70 },
  { name: 'Running Shoes', description: 'Lightweight breathable running shoes with cushioned sole.', price: 2999, category: 'Fashion', brand: 'StrideX', image: img('shoes'), stock: 45 },
  { name: 'Stainless Steel Water Bottle', description: 'Double-wall insulated bottle, keeps drinks cold for 24 hours.', price: 699, category: 'Home', brand: 'HydroKeep', image: img('bottle'), stock: 100 },
  { name: 'LED Desk Lamp', description: 'Dimmable desk lamp with three colour modes and USB port.', price: 999, category: 'Home', brand: 'BrightNest', image: img('lamp'), stock: 55 },
  { name: 'Non-Stick Cookware Set', description: '3-piece non-stick cookware set, induction compatible.', price: 2199, category: 'Home', brand: 'ChefMate', image: img('cookware'), stock: 30 },
  { name: 'Atomic Habits', description: 'A practical guide to building good habits and breaking bad ones.', price: 399, category: 'Books', brand: 'Penguin', image: img('book1'), stock: 90 },
  { name: 'Clean Code', description: 'A handbook of agile software craftsmanship.', price: 549, category: 'Books', brand: 'Pearson', image: img('book2'), stock: 50 },
];

const run = async () => {
  await connectDB();
  await Promise.all([Order.deleteMany(), Product.deleteMany(), User.deleteMany()]);

  if (process.argv.includes('--destroy')) {
    console.log('All data destroyed');
  } else {
    // User.create (not insertMany) so the password-hashing hook runs
    await User.create([
      { name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin' },
      { name: 'Test User', email: 'user@example.com', password: 'user123' },
    ]);
    await Product.insertMany(products);
    console.log('Seeded: admin@example.com / admin123, user@example.com / user123, 12 products');
  }
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

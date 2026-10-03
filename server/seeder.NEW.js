// Standalone seed script for the new fields (images, reviews, rating).
// This is written from scratch since your existing seeder.js wasn't
// shared — merge the `sampleProducts` shape below into your current
// seeder rather than running this file blindly if you already seed
// admin users, orders, etc.
//
// Usage: node server/seeder.js            (import)
//        node server/seeder.js --destroy  (wipe products only)

import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import User from './models/User.js';

const sampleProducts = [
  {
    name: 'Handwoven Cotton Throw',
    description: 'A soft, breathable cotton throw woven on a traditional loom.',
    price: 1499,
    category: 'home',
    brand: 'Haat Home',
    image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800',
    images: [
      'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1616627561950-9f746e330187?w=800',
    ],
    stock: 24,
  },
  {
    name: 'Brass Table Lamp',
    description: 'Hand-finished brass lamp with a linen shade.',
    price: 2899,
    category: 'home',
    brand: 'Haat Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
      'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=800',
    ],
    stock: 8,
  },
  {
    name: 'Clay Dinner Set (6-piece)',
    description: 'Glazed stoneware plates and bowls, microwave and dishwasher safe.',
    price: 3499,
    category: 'kitchen',
    brand: 'Terra',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800',
    ],
    stock: 3,
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  if (process.argv.includes('--destroy')) {
    await Product.deleteMany();
    console.log('Products cleared');
    return mongoose.disconnect();
  }

  await Product.deleteMany();
  const created = await Product.insertMany(sampleProducts);

  // Attach one sample review per product from the first available user,
  // if any users exist, so the reviews UI has something to render.
  const reviewer = await User.findOne();
  if (reviewer) {
    for (const product of created) {
      product.reviews.push({
        name: reviewer.name,
        rating: 5,
        comment: 'Exactly as described, arrived well packaged.',
        user: reviewer._id,
      });
      product.numReviews = product.reviews.length;
      product.rating = 5;
      await product.save();
    }
    console.log(`Seeded ${created.length} products with a sample review each`);
  } else {
    console.log(`Seeded ${created.length} products (no users found, skipped reviews)`);
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

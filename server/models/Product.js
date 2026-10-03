import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: 120 },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
    category: { type: String, required: [true, 'Category is required'], trim: true, index: true },
    brand: { type: String, trim: true, default: '' },
    image: { type: String, default: '' },
    // NEW: gallery images (cover `image` stays as-is for cards/listings)
    images: { type: [String], default: [] },
    stock: { type: Number, required: true, min: [0, 'Stock cannot be negative'], default: 0 },

    // NEW: reviews & rating
    reviews: { type: [reviewSchema], default: [] },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 1 });
productSchema.index({ price: 1 });

export default mongoose.model('Product', productSchema);

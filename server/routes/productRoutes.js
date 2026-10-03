import { Router } from 'express';
import {
  getProducts, getCategories, getProductById,
  createProduct, updateProduct, deleteProduct,
  createProductReview, getRelatedProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();
router.get('/', getProducts);
router.get('/categories', getCategories); // must stay above /:id
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);
router.post('/:id/reviews', protect, createProductReview);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;

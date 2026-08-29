const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../Models/Product'); // Ensure the correct path
const UserModel = require('../Models/user');
const { verifyToken, isAdmin } = require('../Middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Multer storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname) || '.jpg';
        cb(null, 'product-' + uniqueSuffix + ext);
    },
});
const upload = multer({ storage });

// Turn a title into a URL-safe slug
const slugify = (text) =>
    String(text)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80) || 'product';

// Generate a slug from a title, appending -2, -3, ... on collision
const generateUniqueSlug = async(title, excludeId) => {
    const base = slugify(title);
    let slug = base;
    let suffix = 2;
    while (true) {
        const query = { slug };
        if (excludeId) query._id = { $ne: excludeId };
        const existing = await Product.findOne(query).select('_id').lean();
        if (!existing) return slug;
        slug = `${base}-${suffix}`;
        suffix += 1;
    }
};

// Look a product up by Mongo _id or by slug
const findProductByIdOrSlug = async(idOrSlug) => {
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
        const byId = await Product.findById(idOrSlug);
        if (byId) return byId;
    }
    return Product.findOne({ slug: idOrSlug });
};

// Generate a short, unique SKU when the admin doesn't supply one
const generateUniqueSku = async(brand, category) => {
    const prefix = `${(brand || 'GEN').slice(0, 3)}-${(category || 'PRD').slice(0, 3)}`
        .toUpperCase()
        .replace(/[^A-Z-]/g, '');
    while (true) {
        const suffix = Math.floor(1000 + Math.random() * 9000);
        const sku = `${prefix}-${suffix}`;
        const existing = await Product.findOne({ sku }).select('_id').lean();
        if (!existing) return sku;
    }
};

// Get all products (public catalog: active listings only)
router.get('/', async(req, res) => {
    try {
        const products = await Product.find({ status: 'active' });
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const toAbsolute = (url) => (url && url.startsWith('/uploads/') ? `${baseUrl}${url}` : url);
        const mapped = products.map(p => ({
            ...p.toObject(),
            image: toAbsolute(p.image),
            images: Array.isArray(p.images) ? p.images.map(toAbsolute) : [],
        }));
        res.json(mapped);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single product by id or slug
router.get('/:id', async(req, res) => {
    try {
        const product = await findProductByIdOrSlug(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const toAbsolute = (url) => (url && url.startsWith('/uploads/') ? `${baseUrl}${url}` : url);
        const mapped = {
            ...product.toObject(),
            image: toAbsolute(product.image),
            images: Array.isArray(product.images) ? product.images.map(toAbsolute) : [],
        };
        res.json(mapped);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new product
router.post('/', verifyToken, isAdmin, async(req, res) => {
    try {
        const slug = await generateUniqueSlug(req.body.title);
        const sku = req.body.sku || await generateUniqueSku(req.body.brand, req.body.category);
        const product = new Product({
            title: req.body.title,
            slug,
            sku,
            status: ['active', 'draft', 'archived'].includes(req.body.status) ? req.body.status : 'active',
            tags: Array.isArray(req.body.tags) ? req.body.tags : [],
            brand: req.body.brand || 'Generic',
            category: req.body.category,
            price: req.body.price,
            discountPercentage: req.body.discountPercentage || 0,
            stock: req.body.stock ?? 0,
            gender: req.body.gender || 'unisex',
            sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [],
            description: req.body.description,
            image: req.body.image,
            images: Array.isArray(req.body.images) ? req.body.images : [],
            features: Array.isArray(req.body.features) ? req.body.features : [],
            specifications: Array.isArray(req.body.specifications) ? req.body.specifications : [],
        });

        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a product
router.put('/:id', verifyToken, isAdmin, async(req, res) => {
    try {
        const product = await findProductByIdOrSlug(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (req.body.title && req.body.title !== product.title) {
            product.slug = await generateUniqueSlug(req.body.title, product._id);
        }

        product.title = req.body.title || product.title;
        if (req.body.sku) {
            product.sku = req.body.sku;
        }
        if (['active', 'draft', 'archived'].includes(req.body.status)) {
            product.status = req.body.status;
        }
        if (req.body.tags) {
            product.tags = Array.isArray(req.body.tags) ? req.body.tags : product.tags;
        }
        product.brand = req.body.brand || product.brand;
        product.category = req.body.category || product.category;
        product.price = req.body.price || product.price;
        if (req.body.discountPercentage !== undefined) {
            product.discountPercentage = req.body.discountPercentage;
        }
        if (req.body.stock !== undefined) {
            product.stock = req.body.stock;
        }
        product.gender = req.body.gender || product.gender;
        if (req.body.sizes) {
            product.sizes = Array.isArray(req.body.sizes) ? req.body.sizes : product.sizes;
        }
        product.description = req.body.description || product.description;
        product.image = req.body.image || product.image;
        if (req.body.images) {
            product.images = Array.isArray(req.body.images) ? req.body.images : product.images;
        }
        if (req.body.features) {
            product.features = Array.isArray(req.body.features) ? req.body.features : product.features;
        }
        if (req.body.specifications) {
            product.specifications = Array.isArray(req.body.specifications) ? req.body.specifications : product.specifications;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Upload product image
router.post('/upload', verifyToken, isAdmin, upload.single('image'), async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        res.status(201).json({ url: fileUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a product
router.delete('/:id', verifyToken, isAdmin, async(req, res) => {
    try {
        const product = await findProductByIdOrSlug(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await Product.findByIdAndDelete(product._id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/category/:category', async(req, res) => {
    try {
        const products = await Product.find({ category: req.params.category, status: 'active' });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add or update a review for a product
router.post('/:id/reviews', verifyToken, async(req, res) => {
    try {
        const { rating, comment } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const product = await findProductByIdOrSlug(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const user = await UserModel.findById(req.user.id).select('name');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingReviewIndex = product.reviews.findIndex(
            (r) => r.user && r.user.toString() === req.user.id
        );

        if (existingReviewIndex !== -1) {
            product.reviews[existingReviewIndex].rating = rating;
            product.reviews[existingReviewIndex].comment = comment || product.reviews[existingReviewIndex].comment;
            product.reviews[existingReviewIndex].createdAt = new Date();
        } else {
            product.reviews.push({
                user: req.user.id,
                name: user.name,
                rating,
                comment: comment || '',
            });
        }

        product.numReviews = product.reviews.length;
        product.averageRating =
            product.reviews.reduce((acc, item) => acc + item.rating, 0) /
            (product.reviews.length || 1);

        const updated = await product.save();
        res.status(201).json(updated);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

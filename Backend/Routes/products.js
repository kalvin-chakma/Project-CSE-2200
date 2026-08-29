const express = require('express');
const router = express.Router();
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

// Get all products
router.get('/', async(req, res) => {
    try {
        const products = await Product.find();
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const toAbsolute = (url) => (url && url.startsWith('/uploads/') ? `${baseUrl}${url}` : url);
        const mapped = products.map(p => ({
            ...p.toObject(),
            image: toAbsolute(p.image),
        }));
        res.json(mapped);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single product
router.get('/:id', async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const toAbsolute = (url) => (url && url.startsWith('/uploads/') ? `${baseUrl}${url}` : url);
        const mapped = {...product.toObject(), image: toAbsolute(product.image) };
        res.json(mapped);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new product
router.post('/', verifyToken, isAdmin, async(req, res) => {
    const product = new Product({
        title: req.body.title,
        category: req.body.category,
        price: req.body.price,
        gender: req.body.gender || 'unisex',
        sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [],
        description: req.body.description,
        image: req.body.image,
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a product
router.put('/:id', verifyToken, isAdmin, async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.title = req.body.title || product.title;
        product.category = req.body.category || product.category;
        product.price = req.body.price || product.price;
        product.gender = req.body.gender || product.gender;
        if (req.body.sizes) {
            product.sizes = Array.isArray(req.body.sizes) ? req.body.sizes : product.sizes;
        }
        product.description = req.body.description || product.description;
        product.image = req.body.image || product.image;

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
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/category/:category', async(req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
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

        const product = await Product.findById(req.params.id);
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

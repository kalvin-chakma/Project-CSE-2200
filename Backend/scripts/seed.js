// One-off/idempotent dev database seed script.
// Run with: node scripts/seed.js   (from the Backend/ directory)
//
// - Ensures the dev admin account exists with the credentials in .env
// - Backfills missing/incomplete fields (slug, brand, stock, discount,
//   specifications, features, image gallery) on every existing product
// - Inserts the curated product catalog from productSeedData.js,
//   skipping any product whose slug already exists (safe to re-run)

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserModel = require('../Models/user');
const Product = require('../Models/Product');
const { CATEGORIES, reviewsFor } = require('./productSeedData');

const slugify = (text) =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'product';

const CATEGORY_FIXES = {
  accesories: 'accessories',
};

const generateUniqueSlug = async (title, excludeId) => {
  const base = slugify(title);
  let slug = base;
  let suffix = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Product.findOne(query).select('_id').lean();
    if (!existing) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
};

// Real, license-free Unsplash photography, 5 distinct photos per category —
// one per curated product in that category (see productSeedData.js), with
// the other 4 reused as gallery alternates. Every ID below was verified
// reachable before being committed here.
const CATEGORY_PHOTOS = {
  smartphones: ['1592890288564-76628a30a657', '1511707171634-5f897ff02aa9', '1598327105666-5b89351aff97', '1634403665481-74948d815f03', '1580910051074-3eb694886505'],
  laptops: ['1773332585698-cba3c91b73e4', '1496181133206-80ce9b88a853', '1541807084-5c52b6b3adef', '1525547719571-a2d4ac8945e2', '1486312338219-ce68d2c6f44d'],
  audio: ['1505740420928-5e560c06d30e', '1618366712010-f4ae9c647dcb', '1546435770-a3e426bf472b', '1545127398-14699f92334b', '1613040809024-b4ef7ba99bc3'],
  wearables: ['1579586337278-3befd40fd17a', '1660844817855-3ecc7ef21f12', '1508685096489-7aacd43bd3b1', '1546868871-7041f2a55e12', '1637160151663-a410315e4e75'],
  "men's clothing": ['1617137968427-85924c800a22', '1618886614638-80e3c103d31a', '1617114919297-3c8ddb01f599', '1488161628813-04466f872be2', '1617113930975-f9c7243ae527'],
  "women's clothing": ['1515886657613-9f3515b0c78f', '1483985988355-763728e1935b', '1492707892479-7bc8d5a4ee93', '1532453288672-3a27e9be9efd', '1617922001439-4a2e6562f328'],
  footwear: ['1542291026-7eec264c27ff', '1606107557195-0e29a4b5b4aa', '1595950653106-6c9ebd614d3a', '1600269452121-4f2416e55c28', '1525966222134-fcfa99b8ae77'],
  'bags & accessories': ['1584917865442-de89df76afd3', '1614179689702-355944cd0918', '1600857062241-98e5dba7f214', '1705909237050-7a7625b47fac', '1590874103328-eac38a683ce7'],
  'home & kitchen': ['1556911220-bff31c812dba', '1484154218962-a197022b5858', '1586208958839-06c17cacdf08', '1570222094114-d054a817e56b', '1596552183299-000ef779e88d'],
  'sports & outdoors': ['1584735935682-2f2b69dff9d2', '1602211844066-d3bb556e983b', '1562771242-a02d9090c90c', '1595909315417-2edd382a56dc', '1646504632442-6cacb1858bd6'],
};

const photoUrl = (id) => `https://images.unsplash.com/photo-${id}?w=900&q=75&fm=jpg&fit=crop&auto=format`;

// Real photo set for a curated product: its own photo plus two other real
// photos from the same category pool as gallery alternates.
const imagesFor = (category, index = 0) => {
  const pool = CATEGORY_PHOTOS[category];
  if (!pool || pool.length === 0) return [];
  const main = pool[index % pool.length];
  const alts = pool.filter((_, i) => i !== index % pool.length).slice(0, 2);
  return [photoUrl(main), ...alts.map(photoUrl)];
};

const ensureAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log('ADMIN_EMAIL/ADMIN_PASSWORD not set in .env, skipping admin seed.');
    return null;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const existing = await UserModel.findOne({ email });

  if (existing) {
    existing.password = hashedPassword;
    existing.role = 'admin';
    if (!existing.name) existing.name = 'Admin';
    await existing.save();
    console.log(`Admin user updated: ${email}`);
    return existing;
  }

  const created = await UserModel.create({
    name: 'Admin',
    email,
    password: hashedPassword,
    role: 'admin',
  });
  console.log(`Admin user created: ${email}`);
  return created;
};

const fixExistingProducts = async () => {
  const products = await Product.find();
  let fixedCount = 0;

  for (const product of products) {
    let changed = false;

    if (CATEGORY_FIXES[product.category]) {
      product.category = CATEGORY_FIXES[product.category];
      changed = true;
    }

    if (!product.slug) {
      product.slug = await generateUniqueSlug(product.title, product._id);
      changed = true;
    }

    if (!product.brand) {
      product.brand = 'Generic';
      changed = true;
    }

    if (product.stock === undefined || product.stock === null) {
      product.stock = 10 + Math.floor(Math.random() * 40);
      changed = true;
    }

    if (product.discountPercentage === undefined || product.discountPercentage === null) {
      product.discountPercentage = 0;
      changed = true;
    }

    if (!Array.isArray(product.images) || product.images.length === 0) {
      // Reuse the product's own real photo for every gallery slot rather
      // than fabricating unrelated "alternate views".
      product.images = [product.image, product.image, product.image].filter(Boolean);
      changed = true;
    }

    if (!Array.isArray(product.features) || product.features.length === 0) {
      product.features = [
        `Genuine ${product.brand || 'branded'} quality`,
        `Category: ${product.category}`,
        'Backed by our standard return policy',
      ];
      changed = true;
    }

    if (!Array.isArray(product.specifications) || product.specifications.length === 0) {
      product.specifications = [
        { key: 'Brand', value: product.brand || 'Generic' },
        { key: 'Category', value: product.category },
      ];
      changed = true;
    }

    if (changed) {
      await product.save();
      fixedCount += 1;
    }
  }

  console.log(`Reviewed ${products.length} existing products, fixed ${fixedCount}.`);
};

const seedNewProducts = async (reviewAuthorId) => {
  let inserted = 0;
  let skipped = 0;

  for (const group of CATEGORIES) {
    for (const [itemIndex, item] of group.items.entries()) {
      const slug = slugify(item.title);
      const exists = await Product.findOne({ slug });
      if (exists) {
        skipped += 1;
        continue;
      }

      const uniqueSlug = await generateUniqueSlug(item.title);
      const sizes = group.sizePool ? group.sizePool : [];
      const reviews = reviewAuthorId
        ? reviewsFor(inserted, 2 + (inserted % 3)).map((r) => ({
            user: reviewAuthorId,
            name: r.name,
            rating: r.rating,
            comment: r.comment,
          }))
        : [];

      const numReviews = reviews.length;
      const averageRating = numReviews
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews).toFixed(1))
        : 0;

      await Product.create({
        title: item.title,
        slug: uniqueSlug,
        brand: item.brand,
        category: group.category,
        price: item.price,
        discountPercentage: item.discountPercentage || 0,
        stock: item.stock,
        gender: group.gender || 'unisex',
        sizes,
        description: item.description,
        image: imagesFor(group.category, itemIndex)[0],
        images: imagesFor(group.category, itemIndex),
        features: item.features,
        specifications: item.specifications,
        reviews,
        numReviews,
        averageRating,
      });
      inserted += 1;
    }
  }

  console.log(`Inserted ${inserted} new products, skipped ${skipped} already present.`);
};

const run = async () => {
  const mongoUrl = process.env.MONGO_CONN;
  if (!mongoUrl) {
    throw new Error('MONGO_CONN is not set in .env');
  }

  await mongoose.connect(mongoUrl);
  console.log('Connected to MongoDB.');

  const admin = await ensureAdmin();
  await fixExistingProducts();
  await seedNewProducts(admin ? admin._id : null);

  await mongoose.disconnect();
  console.log('Done. Disconnected.');
};

run().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});

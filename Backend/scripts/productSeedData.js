// Curated seed data: ~50 realistic products across 10 categories.
// Used by scripts/seed.js to populate the database for development.

const REVIEW_POOL = [
  { name: 'Sarah M.', rating: 5, comment: 'Exactly as described, arrived quickly and works great.' },
  { name: 'David K.', rating: 4, comment: 'Good quality for the price. Would buy again.' },
  { name: 'Priya R.', rating: 5, comment: 'Exceeded my expectations, very happy with this purchase.' },
  { name: 'James T.', rating: 3, comment: 'Does the job but nothing special.' },
  { name: 'Emily C.', rating: 5, comment: 'Fantastic build quality and fast shipping.' },
  { name: 'Michael B.', rating: 4, comment: 'Solid product, matches the description closely.' },
  { name: 'Aisha N.', rating: 5, comment: 'Love it! Already recommended to friends.' },
  { name: 'Tom H.', rating: 4, comment: 'Great value, minor issues with packaging but product is fine.' },
  { name: 'Laura P.', rating: 5, comment: 'Perfect, this is my second time ordering.' },
  { name: 'Chris W.', rating: 3, comment: 'Average experience, took longer than expected to arrive.' },
];

const reviewsFor = (seedIndex, count) => {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push(REVIEW_POOL[(seedIndex + i) % REVIEW_POOL.length]);
  }
  return list;
};

const CATEGORIES = [
  {
    category: 'smartphones',
    gender: 'unisex',
    items: [
      {
        title: 'Apple iPhone 15 Pro Max', brand: 'Apple', price: 1199, discountPercentage: 5, stock: 24,
        description: 'The most advanced iPhone yet, featuring a titanium design, the A17 Pro chip, and a pro camera system with 5x telephoto zoom.',
        specifications: [
          { key: 'Display', value: '6.7" Super Retina XDR, 120Hz ProMotion' },
          { key: 'Chip', value: 'A17 Pro' },
          { key: 'Storage', value: '256GB' },
          { key: 'Camera', value: '48MP Main + 12MP Ultra Wide + 12MP Telephoto' },
          { key: 'Battery', value: 'Up to 29 hours video playback' },
          { key: 'Connectivity', value: '5G, Wi-Fi 6E, USB-C' },
        ],
        features: ['Titanium design', 'Action Button', 'ProMotion 120Hz display', 'USB-C with USB 3 speeds'],
      },
      {
        title: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', price: 1099, discountPercentage: 8, stock: 30,
        description: 'A powerhouse flagship with a built-in S Pen, 200MP camera, and Galaxy AI features for everyday productivity.',
        specifications: [
          { key: 'Display', value: '6.8" Dynamic AMOLED 2X, 120Hz' },
          { key: 'Chip', value: 'Snapdragon 8 Gen 3' },
          { key: 'Storage', value: '256GB' },
          { key: 'Camera', value: '200MP Main + 12MP Ultra Wide + Dual Telephoto' },
          { key: 'Battery', value: '5000mAh' },
          { key: 'S Pen', value: 'Built-in' },
        ],
        features: ['Built-in S Pen', 'Galaxy AI photo editing', 'Titanium frame', '100x Space Zoom'],
      },
      {
        title: 'Google Pixel 8 Pro', brand: 'Google', price: 899, discountPercentage: 10, stock: 18,
        description: 'Google\'s flagship with the Tensor G3 chip, Magic Editor, and a pro-grade triple camera system.',
        specifications: [
          { key: 'Display', value: '6.7" LTPO OLED, 120Hz' },
          { key: 'Chip', value: 'Google Tensor G3' },
          { key: 'Storage', value: '128GB' },
          { key: 'Camera', value: '50MP Main + 48MP Ultra Wide + 48MP Telephoto' },
          { key: 'Battery', value: '5050mAh' },
          { key: 'OS', value: 'Android 14' },
        ],
        features: ['Magic Editor', '7 years of OS updates', 'Best Take photo tool', 'Temperature sensor'],
      },
      {
        title: 'OnePlus 12', brand: 'OnePlus', price: 799, discountPercentage: 12, stock: 22,
        description: 'Flagship performance with Hasselblad-tuned cameras and blazing-fast 100W charging.',
        specifications: [
          { key: 'Display', value: '6.82" LTPO AMOLED, 120Hz' },
          { key: 'Chip', value: 'Snapdragon 8 Gen 3' },
          { key: 'Storage', value: '256GB' },
          { key: 'Camera', value: '50MP Hasselblad Triple Camera' },
          { key: 'Battery', value: '5400mAh, 100W SUPERVOOC' },
          { key: 'Charging', value: '100W wired, 50W wireless' },
        ],
        features: ['Hasselblad camera tuning', '100W fast charging', 'Alert Slider', 'Aqua Touch display'],
      },
      {
        title: 'Xiaomi 14', brand: 'Xiaomi', price: 749, discountPercentage: 15, stock: 15,
        description: 'Compact flagship with Leica-engineered optics and premium build quality.',
        specifications: [
          { key: 'Display', value: '6.36" LTPO AMOLED, 120Hz' },
          { key: 'Chip', value: 'Snapdragon 8 Gen 3' },
          { key: 'Storage', value: '256GB' },
          { key: 'Camera', value: '50MP Leica Triple Camera' },
          { key: 'Battery', value: '4610mAh, 90W wired charging' },
          { key: 'Build', value: 'Aluminum frame, IP68' },
        ],
        features: ['Leica optics', '90W HyperCharge', 'Compact flagship form factor', 'IP68 water resistance'],
      },
    ],
  },
  {
    category: 'laptops',
    gender: 'unisex',
    items: [
      {
        title: 'Apple MacBook Pro 14" M3', brand: 'Apple', price: 1599, discountPercentage: 5, stock: 12,
        description: 'Pro-level performance in a portable form factor, powered by the Apple M3 chip with a stunning Liquid Retina XDR display.',
        specifications: [
          { key: 'Chip', value: 'Apple M3' },
          { key: 'Display', value: '14.2" Liquid Retina XDR' },
          { key: 'Memory', value: '16GB unified memory' },
          { key: 'Storage', value: '512GB SSD' },
          { key: 'Battery', value: 'Up to 22 hours' },
          { key: 'Ports', value: '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3' },
        ],
        features: ['Liquid Retina XDR display', 'Up to 22-hour battery life', '1080p FaceTime HD camera', 'Six-speaker sound system'],
      },
      {
        title: 'Dell XPS 13', brand: 'Dell', price: 1099, discountPercentage: 10, stock: 20,
        description: 'An ultra-portable laptop with a virtually borderless InfinityEdge display and premium CNC-machined aluminum chassis.',
        specifications: [
          { key: 'Processor', value: 'Intel Core i7-1355U' },
          { key: 'Display', value: '13.4" FHD+ InfinityEdge' },
          { key: 'Memory', value: '16GB LPDDR5' },
          { key: 'Storage', value: '512GB SSD' },
          { key: 'Battery', value: 'Up to 12 hours' },
          { key: 'Weight', value: '1.17 kg' },
        ],
        features: ['InfinityEdge display', 'CNC-machined aluminum chassis', 'Backlit keyboard', 'Wi-Fi 6E'],
      },
      {
        title: 'HP Spectre x360 14', brand: 'HP', price: 1249, discountPercentage: 8, stock: 14,
        description: 'A 2-in-1 convertible laptop with a gem-cut design, OLED display option, and versatile tent/tablet modes.',
        specifications: [
          { key: 'Processor', value: 'Intel Core i7-1355U' },
          { key: 'Display', value: '13.5" 3K2K OLED Touch' },
          { key: 'Memory', value: '16GB LPDDR4x' },
          { key: 'Storage', value: '1TB SSD' },
          { key: 'Battery', value: 'Up to 17 hours' },
          { key: 'Form Factor', value: '2-in-1 convertible' },
        ],
        features: ['360-degree hinge', 'OLED touch display', 'Bang & Olufsen audio', 'Included active pen'],
      },
      {
        title: 'Lenovo ThinkPad X1 Carbon Gen 12', brand: 'Lenovo', price: 1449, discountPercentage: 6, stock: 16,
        description: 'The business standard for reliability, featuring a legendary keyboard, MIL-SPEC durability, and all-day battery life.',
        specifications: [
          { key: 'Processor', value: 'Intel Core Ultra 7' },
          { key: 'Display', value: '14" 2.8K OLED' },
          { key: 'Memory', value: '32GB LPDDR5x' },
          { key: 'Storage', value: '1TB SSD' },
          { key: 'Battery', value: 'Up to 15 hours' },
          { key: 'Durability', value: 'MIL-STD-810H tested' },
        ],
        features: ['Legendary ThinkPad keyboard', 'MIL-SPEC durability', 'Rapid Charge technology', 'Dolby Atmos speakers'],
      },
      {
        title: 'ASUS ROG Zephyrus G14', brand: 'ASUS', price: 1799, discountPercentage: 12, stock: 10,
        description: 'A compact gaming powerhouse with an AniMe Matrix display and desktop-class graphics performance.',
        specifications: [
          { key: 'Processor', value: 'AMD Ryzen 9 8945HS' },
          { key: 'GPU', value: 'NVIDIA GeForce RTX 4070' },
          { key: 'Display', value: '14" QHD+ 165Hz' },
          { key: 'Memory', value: '32GB DDR5' },
          { key: 'Storage', value: '1TB SSD' },
          { key: 'Battery', value: '76Wh' },
        ],
        features: ['AniMe Matrix LED lid', 'Desktop-class RTX graphics', '165Hz QHD+ display', 'Dolby Atmos speakers'],
      },
    ],
  },
  {
    category: 'audio',
    gender: 'unisex',
    items: [
      {
        title: 'Sony WH-1000XM5 Wireless Headphones', brand: 'Sony', price: 399, discountPercentage: 15, stock: 40,
        description: 'Industry-leading noise cancellation with exceptional sound quality and up to 30 hours of battery life.',
        specifications: [
          { key: 'Type', value: 'Over-ear, wireless' },
          { key: 'Noise Cancellation', value: 'Adaptive ANC with 8 microphones' },
          { key: 'Battery Life', value: 'Up to 30 hours' },
          { key: 'Connectivity', value: 'Bluetooth 5.2, multipoint' },
          { key: 'Weight', value: '250g' },
        ],
        features: ['Industry-leading noise cancellation', 'Multipoint Bluetooth connection', 'Speak-to-Chat technology', 'Quick charge: 3 min for 3 hrs playback'],
      },
      {
        title: 'Bose QuietComfort Ultra Headphones', brand: 'Bose', price: 429, discountPercentage: 10, stock: 28,
        description: 'Immersive spatial audio combined with Bose\'s best-in-class noise cancellation for an unmatched listening experience.',
        specifications: [
          { key: 'Type', value: 'Over-ear, wireless' },
          { key: 'Noise Cancellation', value: 'World-class ANC' },
          { key: 'Battery Life', value: 'Up to 24 hours' },
          { key: 'Audio', value: 'Bose Immersive Audio' },
          { key: 'Connectivity', value: 'Bluetooth 5.3' },
        ],
        features: ['Immersive spatial audio', 'Adjustable noise cancellation', 'Premium plush cushions', 'CustomTune sound calibration'],
      },
      {
        title: 'Apple AirPods Pro (2nd generation)', brand: 'Apple', price: 249, discountPercentage: 5, stock: 55,
        description: 'Next-level Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio in a compact true wireless design.',
        specifications: [
          { key: 'Type', value: 'In-ear, true wireless' },
          { key: 'Chip', value: 'Apple H2' },
          { key: 'Battery Life', value: 'Up to 6 hours (30 with case)' },
          { key: 'Water Resistance', value: 'IP54' },
          { key: 'Case', value: 'MagSafe charging case with speaker' },
        ],
        features: ['Adaptive Audio', 'Personalized Spatial Audio', 'Conversation Awareness', 'USB-C charging case'],
      },
      {
        title: 'JBL Flip 6 Portable Speaker', brand: 'JBL', price: 129, discountPercentage: 20, stock: 60,
        description: 'A bold, portable Bluetooth speaker delivering powerful JBL Original Pro Sound with an IP67 waterproof and dustproof design.',
        specifications: [
          { key: 'Type', value: 'Portable Bluetooth speaker' },
          { key: 'Battery Life', value: 'Up to 12 hours' },
          { key: 'Water Resistance', value: 'IP67 waterproof and dustproof' },
          { key: 'Connectivity', value: 'Bluetooth 5.1' },
          { key: 'Weight', value: '550g' },
        ],
        features: ['IP67 waterproof and dustproof', 'PartyBoost for speaker pairing', 'Playtime indicator', 'Durable fabric build'],
      },
      {
        title: 'Sennheiser Momentum 4 Wireless', brand: 'Sennheiser', price: 349, discountPercentage: 12, stock: 20,
        description: 'Audiophile-grade sound with up to 60 hours of battery life and adaptive noise cancellation.',
        specifications: [
          { key: 'Type', value: 'Over-ear, wireless' },
          { key: 'Battery Life', value: 'Up to 60 hours' },
          { key: 'Noise Cancellation', value: 'Adaptive ANC' },
          { key: 'Connectivity', value: 'Bluetooth 5.2, aptX Adaptive' },
          { key: 'Weight', value: '293g' },
        ],
        features: ['60-hour battery life', 'Adaptive noise cancellation', 'Smart Pause auto-play', 'Customizable EQ via app'],
      },
    ],
  },
  {
    category: 'wearables',
    gender: 'unisex',
    items: [
      {
        title: 'Apple Watch Series 9', brand: 'Apple', price: 399, discountPercentage: 5, stock: 35,
        description: 'The most advanced Apple Watch yet, with a brighter display, the S9 chip, and the new double tap gesture.',
        specifications: [
          { key: 'Display', value: 'Always-On Retina LTPO OLED' },
          { key: 'Chip', value: 'S9 SiP' },
          { key: 'Battery Life', value: 'Up to 18 hours' },
          { key: 'Water Resistance', value: '50 meters' },
          { key: 'Health', value: 'Blood oxygen, ECG, temperature sensing' },
        ],
        features: ['Double Tap gesture', 'Brighter always-on display', 'Crash Detection', 'Precision Finding for iPhone'],
      },
      {
        title: 'Samsung Galaxy Watch 6', brand: 'Samsung', price: 329, discountPercentage: 10, stock: 30,
        description: 'A sleek smartwatch with advanced sleep coaching, body composition analysis, and a vivid always-on display.',
        specifications: [
          { key: 'Display', value: '1.5" Super AMOLED' },
          { key: 'Battery Life', value: 'Up to 40 hours' },
          { key: 'Water Resistance', value: '5ATM + IP68' },
          { key: 'Health', value: 'Body composition, sleep coaching, ECG' },
          { key: 'Connectivity', value: 'Bluetooth, optional LTE' },
        ],
        features: ['Advanced sleep coaching', 'Body composition analysis', 'Rotating bezel navigation', 'Google Wallet support'],
      },
      {
        title: 'Fitbit Charge 6', brand: 'Fitbit', price: 159, discountPercentage: 15, stock: 45,
        description: 'A fitness tracker with built-in GPS, heart rate tracking, and up to 7 days of battery life.',
        specifications: [
          { key: 'Display', value: 'AMOLED color touchscreen' },
          { key: 'Battery Life', value: 'Up to 7 days' },
          { key: 'GPS', value: 'Built-in' },
          { key: 'Water Resistance', value: '50 meters' },
          { key: 'Health', value: 'Heart rate, SpO2, stress management' },
        ],
        features: ['Built-in GPS', '7-day battery life', 'YouTube Music controls', 'Google Wallet and Maps'],
      },
      {
        title: 'Garmin Forerunner 265', brand: 'Garmin', price: 449, discountPercentage: 8, stock: 18,
        description: 'A premium running smartwatch with a vivid AMOLED display and advanced training metrics for serious athletes.',
        specifications: [
          { key: 'Display', value: '1.3" AMOLED' },
          { key: 'Battery Life', value: 'Up to 13 days (smartwatch mode)' },
          { key: 'GPS', value: 'Multi-band GNSS' },
          { key: 'Water Resistance', value: '5 ATM' },
          { key: 'Training', value: 'Training readiness, race predictor' },
        ],
        features: ['Multi-band GPS accuracy', 'Training readiness score', 'Bright AMOLED display', 'Running dynamics'],
      },
      {
        title: 'Amazfit GTR 4 Smartwatch', brand: 'Amazfit', price: 199, discountPercentage: 25, stock: 40,
        description: 'A stylish smartwatch offering a 14-day battery life, dual-band GPS, and over 150 sports modes.',
        specifications: [
          { key: 'Display', value: '1.43" AMOLED' },
          { key: 'Battery Life', value: 'Up to 14 days' },
          { key: 'GPS', value: 'Dual-band GPS' },
          { key: 'Water Resistance', value: '5 ATM' },
          { key: 'Sports Modes', value: '150+' },
        ],
        features: ['14-day battery life', '150+ sports modes', 'Bluetooth phone calls', 'Zepp health coaching app'],
      },
    ],
  },
  {
    category: "men's clothing",
    gender: 'male',
    sizePool: ['s', 'm', 'xl', 'xxl'],
    items: [
      {
        title: "Levi's 501 Original Jeans", brand: "Levi's", price: 69.5, discountPercentage: 10, stock: 80,
        description: 'The original blue jean since 1873. A classic straight fit with a button fly, made from durable, rigid denim.',
        specifications: [
          { key: 'Fit', value: 'Straight, button fly' },
          { key: 'Material', value: '100% cotton denim' },
          { key: 'Rise', value: 'Mid rise' },
          { key: 'Care', value: 'Machine wash cold' },
        ],
        features: ['Iconic straight fit', 'Durable rigid denim', 'Button fly', 'Signature leather patch'],
      },
      {
        title: 'Nike Dri-FIT Training T-Shirt', brand: 'Nike', price: 34.99, discountPercentage: 20, stock: 120,
        description: 'A lightweight training tee with sweat-wicking Dri-FIT technology to help you stay dry and comfortable.',
        specifications: [
          { key: 'Material', value: '100% polyester Dri-FIT' },
          { key: 'Fit', value: 'Standard fit' },
          { key: 'Care', value: 'Machine washable' },
        ],
        features: ['Dri-FIT sweat-wicking technology', 'Lightweight breathable fabric', 'Crew neckline', 'Standard athletic fit'],
      },
      {
        title: 'Adidas Tiro Track Jacket', brand: 'Adidas', price: 64.99, discountPercentage: 15, stock: 70,
        description: 'A soccer-inspired track jacket with recycled polyester fabric and the iconic 3-Stripes design.',
        specifications: [
          { key: 'Material', value: 'Recycled polyester' },
          { key: 'Fit', value: 'Regular fit' },
          { key: 'Closure', value: 'Full zip' },
        ],
        features: ['Made with recycled materials', 'Iconic 3-Stripes design', 'Ribbed cuffs and hem', 'Zippered pockets'],
      },
      {
        title: 'Zara Slim Fit Blazer', brand: 'Zara', price: 129, discountPercentage: 0, stock: 25,
        description: 'A tailored slim-fit blazer suitable for both formal occasions and smart-casual wear.',
        specifications: [
          { key: 'Material', value: 'Polyester-viscose blend' },
          { key: 'Fit', value: 'Slim fit' },
          { key: 'Lining', value: 'Fully lined' },
        ],
        features: ['Tailored slim fit', 'Notched lapel', 'Two-button closure', 'Interior pockets'],
      },
      {
        title: 'Uniqlo Ultra Light Down Jacket', brand: 'Uniqlo', price: 79.9, discountPercentage: 10, stock: 90,
        description: 'An ultra-lightweight, packable down jacket that provides warmth without the bulk.',
        specifications: [
          { key: 'Fill', value: '90% down, 10% feather' },
          { key: 'Material', value: 'Nylon shell' },
          { key: 'Packable', value: 'Yes, includes stuff pouch' },
        ],
        features: ['Packs into its own pocket', 'Lightweight warmth', 'Wind-resistant shell', 'Elastic cuffs'],
      },
    ],
  },
  {
    category: "women's clothing",
    gender: 'female',
    sizePool: ['s', 'm', 'xl'],
    items: [
      {
        title: 'Zara Floral Wrap Midi Dress', brand: 'Zara', price: 89.9, discountPercentage: 15, stock: 45,
        description: 'A flowing wrap midi dress with a floral print, adjustable waist tie, and flattering V-neckline.',
        specifications: [
          { key: 'Material', value: '100% viscose' },
          { key: 'Length', value: 'Midi' },
          { key: 'Closure', value: 'Wrap tie waist' },
        ],
        features: ['Flattering wrap silhouette', 'Adjustable waist tie', 'Lightweight breathable fabric', 'V-neckline'],
      },
      {
        title: 'H&M Chunky Knit Sweater', brand: 'H&M', price: 44.99, discountPercentage: 20, stock: 60,
        description: 'A cozy chunky knit sweater with a relaxed fit, perfect for layering in colder months.',
        specifications: [
          { key: 'Material', value: 'Acrylic-wool blend' },
          { key: 'Fit', value: 'Relaxed fit' },
          { key: 'Care', value: 'Hand wash recommended' },
        ],
        features: ['Chunky cable knit texture', 'Relaxed comfortable fit', 'Ribbed cuffs and hem', 'Versatile layering piece'],
      },
      {
        title: "Levi's High-Waisted Mom Jeans", brand: "Levi's", price: 79.5, discountPercentage: 10, stock: 55,
        description: 'A vintage-inspired high-waisted fit with a relaxed taper, made from comfort-stretch denim.',
        specifications: [
          { key: 'Fit', value: 'High-waisted, tapered leg' },
          { key: 'Material', value: '99% cotton, 1% elastane' },
          { key: 'Rise', value: 'High rise' },
        ],
        features: ['Vintage-inspired silhouette', 'Comfort stretch denim', 'High-rise fit', 'Tapered leg opening'],
      },
      {
        title: "Nike Women's Running Leggings", brand: 'Nike', price: 59.99, discountPercentage: 15, stock: 100,
        description: 'High-waisted running leggings with Dri-FIT technology and a supportive, squat-proof fit.',
        specifications: [
          { key: 'Material', value: '78% polyester, 22% spandex' },
          { key: 'Rise', value: 'High-waisted' },
          { key: 'Pockets', value: 'Side pocket for phone' },
        ],
        features: ['Dri-FIT sweat-wicking fabric', 'Squat-proof compression fit', 'High-waisted support', 'Side phone pocket'],
      },
      {
        title: 'Mango Belted Trench Coat', brand: 'Mango', price: 149.99, discountPercentage: 0, stock: 20,
        description: 'A timeless double-breasted trench coat with a belted waist and water-resistant cotton blend fabric.',
        specifications: [
          { key: 'Material', value: 'Cotton-polyester blend' },
          { key: 'Closure', value: 'Double-breasted, belted' },
          { key: 'Length', value: 'Knee-length' },
        ],
        features: ['Classic double-breasted design', 'Belted waist for shaping', 'Water-resistant fabric', 'Storm flap detailing'],
      },
    ],
  },
  {
    category: 'footwear',
    gender: 'unisex',
    items: [
      {
        title: 'Nike Air Max 270', brand: 'Nike', price: 150, discountPercentage: 10, stock: 65,
        description: 'Featuring Nike\'s biggest heel Air unit yet, the Air Max 270 delivers unrivaled all-day comfort.',
        specifications: [
          { key: 'Upper', value: 'Engineered mesh' },
          { key: 'Midsole', value: 'Foam with large Air unit' },
          { key: 'Closure', value: 'Lace-up' },
        ],
        features: ['Largest heel Air unit in Nike history', 'Breathable mesh upper', 'Foam midsole cushioning', 'Rubber waffle-pattern outsole'],
      },
      {
        title: 'Adidas Ultraboost 22', brand: 'Adidas', price: 190, discountPercentage: 15, stock: 50,
        description: 'A responsive running shoe with BOOST midsole cushioning and a Primeknit adaptive upper.',
        specifications: [
          { key: 'Upper', value: 'Primeknit+' },
          { key: 'Midsole', value: 'BOOST energy return foam' },
          { key: 'Outsole', value: 'Continental rubber' },
        ],
        features: ['BOOST energy-return cushioning', 'Primeknit adaptive upper', 'Torsion System stability', 'Continental rubber outsole'],
      },
      {
        title: 'Puma RS-X Efekt', brand: 'Puma', price: 110, discountPercentage: 20, stock: 40,
        description: 'A bold retro-inspired sneaker with chunky RS cushioning and a mix of textures for a standout street look.',
        specifications: [
          { key: 'Upper', value: 'Mesh and synthetic overlays' },
          { key: 'Midsole', value: 'RS foam cushioning' },
          { key: 'Style', value: 'Retro running silhouette' },
        ],
        features: ['Chunky retro silhouette', 'RS cushioning technology', 'Mixed-material upper', 'Bold colorway options'],
      },
      {
        title: 'Converse Chuck Taylor All Star', brand: 'Converse', price: 65, discountPercentage: 5, stock: 100,
        description: 'The iconic canvas sneaker that has defined casual style for generations.',
        specifications: [
          { key: 'Upper', value: 'Canvas' },
          { key: 'Sole', value: 'Vulcanized rubber' },
          { key: 'Closure', value: 'Lace-up, high top' },
        ],
        features: ['Timeless canvas design', 'Vulcanized rubber sole', 'OrthoLite insole for comfort', 'Iconic All Star ankle patch'],
      },
      {
        title: 'Clarks Desert Boot', brand: 'Clarks', price: 140, discountPercentage: 0, stock: 30,
        description: 'A heritage-crafted suede desert boot with a crepe sole, a classic since 1950.',
        specifications: [
          { key: 'Upper', value: 'Genuine suede' },
          { key: 'Sole', value: 'Natural crepe' },
          { key: 'Closure', value: 'Two-eyelet lace-up' },
        ],
        features: ['Genuine suede construction', 'Iconic crepe sole', 'Heritage 1950 design', 'Leather lining for comfort'],
      },
    ],
  },
  {
    category: 'bags & accessories',
    gender: 'unisex',
    items: [
      {
        title: 'Herschel Little America Backpack', brand: 'Herschel', price: 99.99, discountPercentage: 10, stock: 40,
        description: 'A timeless backpack with a rounded silhouette, vegan leather details, and a padded laptop sleeve.',
        specifications: [
          { key: 'Capacity', value: '25L' },
          { key: 'Material', value: '600D polyester' },
          { key: 'Laptop Sleeve', value: 'Fits up to 15"' },
        ],
        features: ['Padded 15" laptop sleeve', 'Vegan leather details', 'Signature striped lining', 'Adjustable shoulder straps'],
      },
      {
        title: 'Ray-Ban Aviator Classic Sunglasses', brand: 'Ray-Ban', price: 173, discountPercentage: 0, stock: 55,
        description: 'The original pilot sunglasses, featuring crystal lenses and a timeless gold metal frame.',
        specifications: [
          { key: 'Frame Material', value: 'Metal' },
          { key: 'Lens', value: 'Crystal, 100% UV protection' },
          { key: 'Style', value: 'Aviator' },
        ],
        features: ['Iconic aviator shape', '100% UV protection', 'Lightweight metal frame', 'Includes protective case'],
      },
      {
        title: 'Michael Kors Jet Set Tote Bag', brand: 'Michael Kors', price: 298, discountPercentage: 20, stock: 18,
        description: 'A spacious signature tote crafted from saffiano leather, perfect for work or travel.',
        specifications: [
          { key: 'Material', value: 'Saffiano leather' },
          { key: 'Interior', value: 'Zip and slip pockets' },
          { key: 'Hardware', value: 'Gold-tone' },
        ],
        features: ['Structured saffiano leather', 'Spacious main compartment', 'Gold-tone hardware', 'Interior organization pockets'],
      },
      {
        title: 'Casio G-Shock GA-2100', brand: 'Casio', price: 99, discountPercentage: 5, stock: 45,
        description: 'The "CasiOak", a slim octagonal G-Shock built with carbon core guard for extreme shock resistance.',
        specifications: [
          { key: 'Movement', value: 'Quartz' },
          { key: 'Water Resistance', value: '200 meters' },
          { key: 'Case Material', value: 'Resin with carbon core guard' },
        ],
        features: ['Carbon core guard construction', '200m water resistance', 'Slim octagonal design', 'LED backlight'],
      },
      {
        title: 'Samsonite Freeform Hardside Luggage', brand: 'Samsonite', price: 219.99, discountPercentage: 25, stock: 22,
        description: 'A lightweight hardside spinner suitcase with a scratch-resistant textured shell and 360-degree wheels.',
        specifications: [
          { key: 'Material', value: 'Polypropylene hardside' },
          { key: 'Capacity', value: '28-inch, 98L' },
          { key: 'Wheels', value: '4 spinner wheels, 360°' },
        ],
        features: ['Scratch-resistant textured shell', '360-degree spinner wheels', 'TSA-approved lock', 'Telescoping push-button handle'],
      },
    ],
  },
  {
    category: 'home & kitchen',
    gender: 'unisex',
    items: [
      {
        title: 'Instant Pot Duo 7-in-1', brand: 'Instant Pot', price: 99.95, discountPercentage: 30, stock: 60,
        description: 'A 7-in-1 electric pressure cooker that replaces a pressure cooker, slow cooker, rice cooker, and more.',
        specifications: [
          { key: 'Capacity', value: '6 quarts' },
          { key: 'Functions', value: '7-in-1: pressure cook, slow cook, rice cooker, steamer, sauté, yogurt maker, warmer' },
          { key: 'Material', value: 'Stainless steel inner pot' },
        ],
        features: ['7 kitchen appliances in one', '13 customizable smart programs', 'Stainless steel inner pot', 'Advanced safety mechanisms'],
      },
      {
        title: 'Dyson V15 Detect Cordless Vacuum', brand: 'Dyson', price: 749.99, discountPercentage: 12, stock: 15,
        description: 'A cordless vacuum with laser dust detection and a piezo sensor that counts and sizes particles in real time.',
        specifications: [
          { key: 'Battery Life', value: 'Up to 60 minutes' },
          { key: 'Bin Capacity', value: '0.76L' },
          { key: 'Filtration', value: 'Whole-machine HEPA filtration' },
        ],
        features: ['Laser dust detection', 'Piezo sensor particle counting', 'Whole-machine HEPA filtration', 'LCD screen displaying scientific proof of cleaning'],
      },
      {
        title: 'Philips Air Fryer XXL', brand: 'Philips', price: 249.99, discountPercentage: 20, stock: 35,
        description: 'A large-capacity air fryer using Rapid Air Technology to cook with little to no oil.',
        specifications: [
          { key: 'Capacity', value: '7.3L / feeds up to 6 people' },
          { key: 'Technology', value: 'Twin TurboStar Rapid Air Technology' },
          { key: 'Controls', value: 'Digital touchscreen with presets' },
        ],
        features: ['Rapid Air Technology for less oil', 'Large family-sized capacity', 'Dishwasher-safe parts', 'Fat removal technology'],
      },
      {
        title: 'Ninja Professional Blender', brand: 'Ninja', price: 99.99, discountPercentage: 15, stock: 50,
        description: 'A powerful 1000-watt blender with Total Crushing Technology for ice, fruits, and vegetables.',
        specifications: [
          { key: 'Power', value: '1000 watts' },
          { key: 'Capacity', value: '72oz pitcher' },
          { key: 'Blades', value: 'Total Crushing Technology stainless steel blades' },
        ],
        features: ['1000-watt professional motor', 'Total Crushing Technology blades', 'Large 72oz pitcher', 'Dishwasher-safe parts'],
      },
      {
        title: 'KitchenAid Artisan Stand Mixer', brand: 'KitchenAid', price: 449.99, discountPercentage: 10, stock: 20,
        description: 'The iconic stand mixer with a tilt-head design and 10 speeds for mixing, kneading, and whipping.',
        specifications: [
          { key: 'Capacity', value: '5-quart stainless steel bowl' },
          { key: 'Power', value: '325 watts' },
          { key: 'Speeds', value: '10-speed slide control' },
        ],
        features: ['Tilt-head design for easy access', '10-speed slide control', 'Includes flat beater, whisk, and dough hook', 'Over 15 optional attachments available'],
      },
    ],
  },
  {
    category: 'sports & outdoors',
    gender: 'unisex',
    items: [
      {
        title: 'Wilson Evolution Indoor Basketball', brand: 'Wilson', price: 64.99, discountPercentage: 10, stock: 75,
        description: 'The #1 indoor game ball in America, featuring a composite microfiber cover for a consistent, game-ready feel.',
        specifications: [
          { key: 'Size', value: 'Official Size 7 (29.5")' },
          { key: 'Cover', value: 'Composite microfiber' },
          { key: 'Use', value: 'Indoor' },
        ],
        features: ['Composite microfiber cover', 'Moisture-wicking technology', 'Cushion core carcass', 'Deep channel design'],
      },
      {
        title: 'YETI Rambler 20oz Tumbler', brand: 'YETI', price: 35, discountPercentage: 0, stock: 90,
        description: 'A double-wall vacuum insulated tumbler that keeps drinks cold or hot for hours, with a durable no-sweat design.',
        specifications: [
          { key: 'Capacity', value: '20 oz' },
          { key: 'Material', value: '18/8 stainless steel' },
          { key: 'Insulation', value: 'Double-wall vacuum' },
        ],
        features: ['Double-wall vacuum insulation', 'No-sweat exterior design', 'Dishwasher safe', 'MagSlider lid included'],
      },
      {
        title: 'Coleman Sundome 4-Person Tent', brand: 'Coleman', price: 89.99, discountPercentage: 20, stock: 30,
        description: 'A weatherproof dome tent with WeatherTec system to keep you dry, setting up in about 10 minutes.',
        specifications: [
          { key: 'Capacity', value: '4-person' },
          { key: 'Dimensions', value: '9 x 7 feet' },
          { key: 'Weather Protection', value: 'WeatherTec system, welded floors' },
        ],
        features: ['WeatherTec waterproof system', 'Sets up in about 10 minutes', 'Large mesh windows for ventilation', 'Included rainfly'],
      },
      {
        title: 'Manduka PRO Yoga Mat', brand: 'Manduka', price: 138, discountPercentage: 5, stock: 40,
        description: 'A dense, cushioned yoga mat built to last a lifetime, offering superior joint protection and stability.',
        specifications: [
          { key: 'Thickness', value: '6mm' },
          { key: 'Material', value: 'Closed-cell PVC' },
          { key: 'Dimensions', value: '71" x 26"' },
        ],
        features: ['Lifetime guarantee', 'Closed-cell surface resists moisture', 'High-density cushioning', 'Free of foaming agents'],
      },
      {
        title: 'Titleist Pro V1 Golf Balls (Dozen)', brand: 'Titleist', price: 54.99, discountPercentage: 0, stock: 100,
        description: 'The #1 ball in golf, delivering consistent flight, soft feel, and exceptional greenside spin.',
        specifications: [
          { key: 'Quantity', value: '12 balls per box' },
          { key: 'Construction', value: '3-piece' },
          { key: 'Cover', value: 'Urethane elastomer' },
        ],
        features: ['Consistent, penetrating ball flight', 'Soft feel with responsive spin', 'Durable urethane cover', 'Tour-proven performance'],
      },
    ],
  },
];

module.exports = { CATEGORIES, reviewsFor };

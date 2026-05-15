require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  {
    name: 'Free Fire',
    slug: 'free-fire',
    category: 'game-topup',
    description: 'Top up Free Fire Diamonds instantly. Receive diamonds directly in your Garena Free Fire account within 60 seconds.',
    image: '/images/topup-free-fire.png',
    bannerColor: '#FF6B35',
    featured: true,
    popularity: 95,
    packages: [
      { label: '115 Diamonds', amount: 115, price: 95 },
      { label: '355 Diamonds', amount: 355, price: 285, originalPrice: 320 },
      { label: '610 Diamonds', amount: 610, price: 470, originalPrice: 530 },
      { label: '1090 Diamonds', amount: 1090, price: 930, originalPrice: 1040 },
      { label: '1720 Diamonds', amount: 1720, price: 1860, originalPrice: 2050 },
      { label: '2530 Diamonds', amount: 2530, price: 4680, originalPrice: 5100 },
      { label: 'Level Up Pass', amount: 1, price: 395, originalPrice: 450 },
      { label: 'Weekly', amount: 7, price: 185 },
      { label: 'Monthly', amount: 30, price: 900, originalPrice: 980 },
    ],
    inputFields: [
      {
        name: 'playerId',
        label: 'Player ID',
        placeholder: 'Enter your Free Fire Player ID',
        required: true,
      },
    ],
  },
  {
    name: 'PUBG Mobile',
    slug: 'pubg-mobile',
    category: 'game-topup',
    description: 'Buy PUBG Mobile UC (Unknown Cash) at the best price. Instant delivery to your PUBG Mobile account.',
    image: '/images/topup-pubg-uc.png',
    bannerColor: '#F2A900',
    featured: true,
    popularity: 90,
    packages: [
      { label: '60 UC', amount: 60, price: 150 },
      { label: '325 UC', amount: 325, price: 720, originalPrice: 700 },
      { label: '660 UC', amount: 660, price: 1480, originalPrice: 1380 },
      { label: '1800 UC', amount: 1800, price: 3590, originalPrice: 3650 },
      { label: '3850 UC', amount: 3850, price: 7180, originalPrice: 7600 },
      { label: '8100 UC', amount: 8100, price: 14300, originalPrice: 15200 },
    ],
    inputFields: [
      {
        name: 'playerId',
        label: 'Player ID',
        placeholder: 'Enter your PUBG Mobile Player ID',
        required: true,
      },
    ],
  },
  {
    name: 'Mobile Legends',
    slug: 'mobile-legends',
    category: 'game-topup',
    description: 'Recharge Mobile Legends: Bang Bang Diamonds. Fast and secure MLBB top-up with instant delivery.',
    image: '/images/topup-mlbb.png',
    bannerColor: '#1E90FF',
    featured: true,
    popularity: 88,
    packages: [
      { label: '86 Diamonds', amount: 86, price: 149, originalPrice: 180 },
      { label: '172 Diamonds', amount: 172, price: 289, originalPrice: 350 },
      { label: '257 Diamonds', amount: 257, price: 429, originalPrice: 520 },
      { label: '706 Diamonds', amount: 706, price: 1149, originalPrice: 1400 },
      { label: '2195 Diamonds', amount: 2195, price: 3499, originalPrice: 4300 },
      { label: '4390 Diamonds', amount: 4390, price: 6899, originalPrice: 8500 },
    ],
    inputFields: [
      {
        name: 'userId',
        label: 'User ID',
        placeholder: 'Enter your MLBB User ID',
        required: true,
      },
      {
        name: 'serverId',
        label: 'Server ID (Zone ID)',
        placeholder: 'Enter your Server/Zone ID',
        required: true,
      },
    ],
  },
  {
    name: 'PUBG Lite BattleCoins',
    slug: 'pubg-lite',
    category: 'game-topup',
    description: 'Top up PUBG Lite BattleCoins instantly.',
    image: '/images/topup-pubg-lite.png',
    bannerColor: '#F97316',
    featured: false,
    popularity: 80,
    packages: [
      { label: '100 BC', amount: 100, price: 110 },
      { label: '300 BC', amount: 300, price: 320, originalPrice: 360 },
      { label: '600 BC', amount: 600, price: 620, originalPrice: 700 },
      { label: '1500 BC', amount: 1500, price: 1490, originalPrice: 1650 },
      { label: '3000 BC', amount: 3000, price: 2890, originalPrice: 3200 },
    ],
    inputFields: [
      {
        name: 'playerId',
        label: 'Player ID',
        placeholder: 'Enter PUBG Lite ID',
        required: true,
      },
    ],
  },
  {
    name: 'Call of Duty Mobile',
    slug: 'call-of-duty-mobile',
    category: 'game-topup',
    description: 'Top up COD Mobile CP instantly with fast delivery.',
    image: '/images/topup-codm.png',
    bannerColor: '#EF4444',
    featured: false,
    popularity: 85,
    packages: [
      { label: '80 CP', amount: 80, price: 140 },
      { label: '420 CP', amount: 420, price: 690, originalPrice: 760 },
      { label: '880 CP', amount: 880, price: 1360, originalPrice: 1490 },
      { label: '2400 CP', amount: 2400, price: 3490, originalPrice: 3850 },
      { label: '5000 CP', amount: 5000, price: 7190, originalPrice: 7800 },
    ],
    inputFields: [
      {
        name: 'uid',
        label: 'Player UID',
        placeholder: 'Enter UID',
        required: true,
      },
    ],
  },
  {
    name: 'Clash of Clans',
    slug: 'clash-of-clans',
    category: 'game-topup',
    description: 'Top up Clash of Clans gems instantly with secure payment and fast delivery.',
    image: '/images/topup-clash-of-clans.png',
    bannerColor: '#22C55E',
    featured: false,
    popularity: 82,
    packages: [
      { label: '80 Gems', amount: 80, price: 160 },
      { label: '500 Gems', amount: 500, price: 770, originalPrice: 850 },
      { label: '1200 Gems', amount: 1200, price: 1490, originalPrice: 1650 },
      { label: '2500 Gems', amount: 2500, price: 2890, originalPrice: 3250 },
      { label: '6500 Gems', amount: 6500, price: 7290, originalPrice: 7950 },
      { label: '14000 Gems', amount: 14000, price: 14450, originalPrice: 15800 },
    ],
    inputFields: [
      {
        name: 'playerTag',
        label: 'Player Tag',
        placeholder: '#ABCD123',
        required: true,
      },
    ],
  },
  {
    name: 'Clash Royale',
    slug: 'clash-royale',
    category: 'game-topup',
    description: 'Top up Clash Royale gems instantly with secure payment and quick delivery.',
    image: '/images/topup-clash-royale.png',
    bannerColor: '#3B82F6',
    featured: false,
    popularity: 78,
    packages: [
      { label: '80 Gems', amount: 80, price: 150 },
      { label: '500 Gems', amount: 500, price: 750, originalPrice: 820 },
      { label: '1200 Gems', amount: 1200, price: 1450, originalPrice: 1600 },
      { label: '2500 Gems', amount: 2500, price: 2850, originalPrice: 3200 },
      { label: '6500 Gems', amount: 6500, price: 7200, originalPrice: 7800 },
      { label: '14000 Gems', amount: 14000, price: 14200, originalPrice: 15500 },
    ],
    inputFields: [
      {
        name: 'playerTag',
        label: 'Player Tag',
        placeholder: '#ABCD123',
        required: true,
      },
    ],
  },
  // ── Gift Cards ──
  {
    name: 'Google Play',
    slug: 'google-play',
    category: 'gift-card',
    description: 'Google Play gift card with instant code delivery.',
    image: '/images/gift-google-play.png',
    bannerColor: '#34A853',
    featured: false,
    popularity: 75,
    packages: [
      { label: 'Rs. 500 Card', amount: 500, price: 500 },
      { label: 'Rs. 1000 Card', amount: 1000, price: 1000 },
      { label: 'Rs. 2500 Card', amount: 2500, price: 2500 },
      { label: 'Rs. 5000 Card', amount: 5000, price: 5000 },
    ],
    inputFields: [
      {
        name: 'accountEmail',
        label: 'Google Play email',
        placeholder: 'you@example.com',
        required: true,
      },
    ],
  },
  {
    name: 'iTunes / Apple',
    slug: 'itunes-apple',
    category: 'gift-card',
    description: 'iTunes / Apple gift card with instant code delivery.',
    image: '/images/gift-itunes.png',
    bannerColor: '#FB5BC5',
    featured: false,
    popularity: 72,
    packages: [
      { label: '$5 Card', amount: 5, price: 750 },
      { label: '$10 Card', amount: 10, price: 1450 },
      { label: '$25 Card', amount: 25, price: 3600 },
      { label: '$50 Card', amount: 50, price: 7100 },
    ],
    inputFields: [
      {
        name: 'accountEmail',
        label: 'Apple ID email',
        placeholder: 'you@example.com',
        required: true,
      },
    ],
  },
  {
    name: 'Steam Wallet',
    slug: 'steam-wallet',
    category: 'gift-card',
    description: 'Steam Wallet gift card with instant code delivery.',
    image: '/images/gift-steam.png',
    bannerColor: '#1B2838',
    featured: false,
    popularity: 74,
    packages: [
      { label: '$5 Wallet', amount: 5, price: 760 },
      { label: '$10 Wallet', amount: 10, price: 1480 },
      { label: '$20 Wallet', amount: 20, price: 2920 },
      { label: '$50 Wallet', amount: 50, price: 7250 },
    ],
    inputFields: [
      {
        name: 'accountEmail',
        label: 'Steam account email',
        placeholder: 'you@example.com',
        required: true,
      },
    ],
  },
  {
    name: 'PlayStation',
    slug: 'playstation',
    category: 'gift-card',
    description: 'PlayStation gift card with instant code delivery.',
    image: '/images/gift-playstation.png',
    bannerColor: '#006FCD',
    featured: false,
    popularity: 70,
    packages: [
      { label: '$10 Card', amount: 10, price: 1500 },
      { label: '$20 Card', amount: 20, price: 2950 },
      { label: '$50 Card', amount: 50, price: 7300 },
      { label: '$100 Card', amount: 100, price: 14500 },
    ],
    inputFields: [
      {
        name: 'accountEmail',
        label: 'PSN account email',
        placeholder: 'you@example.com',
        required: true,
      },
    ],
  },
  {
    name: 'Xbox',
    slug: 'xbox',
    category: 'gift-card',
    description: 'Xbox gift card with instant code delivery.',
    image: '/images/gift-xbox.png',
    bannerColor: '#107C10',
    featured: false,
    popularity: 68,
    packages: [
      { label: '$5 Card', amount: 5, price: 760 },
      { label: '$10 Card', amount: 10, price: 1490 },
      { label: '$25 Card', amount: 25, price: 3650 },
      { label: '$50 Card', amount: 50, price: 7200 },
    ],
    inputFields: [
      {
        name: 'accountEmail',
        label: 'Xbox account email',
        placeholder: 'you@example.com',
        required: true,
      },
    ],
  },
  {
    name: 'Netflix',
    slug: 'netflix',
    category: 'gift-card',
    description: 'Netflix gift card with instant code delivery.',
    image: '/images/gift-netflix.png',
    bannerColor: '#E50914',
    featured: false,
    popularity: 73,
    packages: [
      { label: '1 Month Standard', amount: 1, price: 1300 },
      { label: '3 Months Standard', amount: 3, price: 3800 },
      { label: '6 Months Standard', amount: 6, price: 7400 },
      { label: '12 Months Standard', amount: 12, price: 14500 },
    ],
    inputFields: [
      {
        name: 'accountEmail',
        label: 'Netflix email',
        placeholder: 'you@example.com',
        required: true,
      },
    ],
  },
  // ── New Products ──
  {
    name: 'TikTok Coin',
    slug: 'tiktok-coin',
    category: 'game-topup',
    description: 'Top up TikTok Coins instantly. Send gifts to your favorite creators!',
    image: '/images/topup-tiktok-coin.png',
    bannerColor: '#EE1D52',
    featured: true,
    popularity: 92,
    packages: [
      { label: '65 Coins', amount: 65, price: 110 },
      { label: '330 Coins', amount: 330, price: 520, originalPrice: 580 },
      { label: '660 Coins', amount: 660, price: 1020, originalPrice: 1150 },
      { label: '1321 Coins', amount: 1321, price: 1990, originalPrice: 2250 },
      { label: '3303 Coins', amount: 3303, price: 4850, originalPrice: 5400 },
      { label: '6607 Coins', amount: 6607, price: 9500, originalPrice: 10600 },
    ],
    inputFields: [
      {
        name: 'username',
        label: 'TikTok Username',
        placeholder: '@yourusername',
        required: true,
      },
    ],
  },
  {
    name: 'CapCut Premium',
    slug: 'capcut-premium',
    category: 'game-topup',
    description: 'Unlock CapCut Premium with advanced editing tools, effects, and templates.',
    image: '/images/topup-capcut-premium.png',
    bannerColor: '#6C5CE7',
    featured: false,
    popularity: 76,
    packages: [
      { label: '1 Month Premium', amount: 1, price: 650 },
      { label: '3 Months Premium', amount: 3, price: 1750, originalPrice: 1950 },
      { label: '6 Months Premium', amount: 6, price: 3200, originalPrice: 3900 },
      { label: '12 Months Premium', amount: 12, price: 5800, originalPrice: 7800 },
    ],
    inputFields: [
      {
        name: 'accountEmail',
        label: 'CapCut Account Email',
        placeholder: 'you@example.com',
        required: true,
      },
    ],
  },
  {
    name: 'Minecraft',
    slug: 'minecraft',
    category: 'game-topup',
    description: 'Top up Minecraft Minecoins instantly. Buy skins, texture packs, and worlds from the Marketplace!',
    image: '/images/topup-minecraft.png',
    bannerColor: '#56A84B',
    featured: true,
    popularity: 86,
    packages: [
      { label: '320 Minecoins', amount: 320, price: 310 },
      { label: '700 Minecoins', amount: 700, price: 620, originalPrice: 700 },
      { label: '1720 Minecoins', amount: 1720, price: 1450, originalPrice: 1650 },
      { label: '3500 Minecoins', amount: 3500, price: 2850, originalPrice: 3300 },
      { label: '8800 Minecoins', amount: 8800, price: 6900, originalPrice: 7800 },
    ],
    inputFields: [
      {
        name: 'gamertag',
        label: 'Xbox/Microsoft Gamertag',
        placeholder: 'Enter your Gamertag',
        required: true,
      },
    ],
  },
  {
    name: 'Discord Nitro',
    slug: 'discord-nitro',
    category: 'game-topup',
    description: 'Upgrade to Discord Nitro for HD streaming, bigger uploads, and custom emojis.',
    image: '/images/topup-discord-nitro.png',
    bannerColor: '#5865F2',
    featured: true,
    popularity: 89,
    packages: [
      { label: 'Nitro Basic – 1 Month', amount: 1, price: 450 },
      { label: 'Nitro Basic – 3 Months', amount: 3, price: 1250, originalPrice: 1350 },
      { label: 'Nitro – 1 Month', amount: 1, price: 1350 },
      { label: 'Nitro – 3 Months', amount: 3, price: 3800, originalPrice: 4050 },
      { label: 'Nitro – 6 Months', amount: 6, price: 7200, originalPrice: 8100 },
      { label: 'Nitro – 12 Months', amount: 12, price: 13500, originalPrice: 16200 },
    ],
    inputFields: [
      {
        name: 'discordTag',
        label: 'Discord Username',
        placeholder: 'username#0000',
        required: true,
      },
    ],
  },
  {
    name: 'Roblox',
    slug: 'roblox',
    category: 'game-topup',
    description: 'Top up Roblox Robux instantly. Buy game passes, items, and accessories!',
    image: '/images/topup-roblox.png',
    bannerColor: '#E2231A',
    featured: true,
    popularity: 91,
    packages: [
      { label: '400 Robux', amount: 400, price: 640 },
      { label: '800 Robux', amount: 800, price: 1240, originalPrice: 1380 },
      { label: '1700 Robux', amount: 1700, price: 2490, originalPrice: 2800 },
      { label: '4500 Robux', amount: 4500, price: 6350, originalPrice: 7100 },
      { label: '10000 Robux', amount: 10000, price: 13500, originalPrice: 15200 },
    ],
    inputFields: [
      {
        name: 'robloxUser',
        label: 'Roblox Username',
        placeholder: 'Enter Roblox username',
        required: true,
      },
    ],
  },
  {
    name: 'Razer Gold',
    slug: 'razer-gold',
    category: 'gift-card',
    description: 'Razer Gold gift card with instant pin delivery. Use across 42,000+ games worldwide.',
    image: '/images/gift-razer-gold.png',
    bannerColor: '#44D62C',
    featured: false,
    popularity: 71,
    packages: [
      { label: '$5 Pin', amount: 5, price: 760 },
      { label: '$10 Pin', amount: 10, price: 1480 },
      { label: '$25 Pin', amount: 25, price: 3600 },
      { label: '$50 Pin', amount: 50, price: 7100 },
      { label: '$100 Pin', amount: 100, price: 14000 },
    ],
    inputFields: [
      {
        name: 'accountEmail',
        label: 'Razer account email',
        placeholder: 'you@example.com',
        required: true,
      },
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed products
    await Product.insertMany(products);
    console.log(`📦 ${products.length} products seeded successfully`);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@karmastore.np';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Krm@2026!Host_Admin9x';

    await User.create({
      name: 'Karma Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isVerified: true,
    });
    console.log(`👤 Admin user created (${adminEmail}) — run "npm run prepare-host" for production credentials file`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();

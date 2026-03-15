const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Cake = require('./models/Cake');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const products = [
  // ── Cakes ──
  {
    name: 'Chocolate Truffle Cake',
    description: 'Rich and indulgent chocolate truffle cake with layers of dark chocolate ganache.',
    price: 500,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/dessert',
    category: 'Cakes',
    weightOptions: ['500g', '1kg', '2kg'],
    available: true,
  },
  {
    name: 'Red Velvet Cake',
    description: 'Classic red velvet cake with smooth cream cheese frosting. Soft, moist, and vibrant.',
    price: 600,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/spices',
    category: 'Cakes',
    weightOptions: ['500g', '1kg', '2kg'],
    available: true,
  },
  {
    name: 'Vanilla Sponge Cake',
    description: 'Light and fluffy vanilla sponge cake topped with fresh whipped cream and seasonal fruits.',
    price: 400,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/pot-mussels',
    category: 'Cakes',
    weightOptions: ['500g', '1kg'],
    available: true,
  },
  {
    name: 'Black Forest Cake',
    description: 'Traditional black forest cake with layers of chocolate sponge, whipped cream, and cherries.',
    price: 550,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/nature-mountains',
    category: 'Cakes',
    weightOptions: ['500g', '1kg', '2kg'],
    available: true,
  },
  {
    name: 'Butterscotch Crunch Cake',
    description: 'Delicious butterscotch cake with crunchy caramel praline pieces and butterscotch frosting.',
    price: 550,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/fish-vegetables',
    category: 'Cakes',
    weightOptions: ['500g', '1kg', '2kg'],
    available: true,
  },
  // ── Groceries ──
  {
    name: 'Organic Whole Wheat Flour',
    description: 'Premium organic whole wheat flour, perfect for baking healthy bread and rotis. 5kg pack.',
    price: 280,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/accessories-bag',
    category: 'Groceries',
    weightOptions: ['1kg', '5kg'],
    available: true,
  },
  {
    name: 'Basmati Rice Premium',
    description: 'Long grain aged basmati rice with rich aroma. Ideal for biryanis and pulao.',
    price: 350,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/shoes',
    category: 'Groceries',
    weightOptions: ['1kg', '5kg'],
    available: true,
  },
  {
    name: 'Cold Pressed Coconut Oil',
    description: 'Pure cold pressed virgin coconut oil for cooking and skincare. 1 litre bottle.',
    price: 450,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/leather-bag-gray',
    category: 'Groceries',
    weightOptions: ['500ml', '1L'],
    available: true,
  },
  {
    name: 'Mixed Dal Pack',
    description: 'Combo pack of Toor Dal, Moong Dal, and Chana Dal. Fresh and nutritious.',
    price: 320,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/animals/three-dogs',
    category: 'Groceries',
    weightOptions: ['1kg', '2kg'],
    available: true,
  },
  {
    name: 'Organic Honey',
    description: 'Pure organic honey sourced from natural bee farms. No added sugar or preservatives.',
    price: 399,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/cloudinary-group',
    category: 'Groceries',
    weightOptions: ['250g', '500g'],
    available: true,
  },
  // ── Fast Food ──
  {
    name: 'Classic Chicken Burger',
    description: 'Juicy grilled chicken patty with lettuce, tomato, cheese, and special sauce in a toasted bun.',
    price: 180,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man',
    category: 'Fast Food',
    weightOptions: ['Regular', 'Large'],
    available: true,
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic thin crust pizza with fresh mozzarella, tomato sauce, and basil leaves.',
    price: 299,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/bike',
    category: 'Fast Food',
    weightOptions: ['Medium', 'Large'],
    available: true,
  },
  {
    name: 'Loaded French Fries',
    description: 'Crispy golden fries topped with melted cheese, jalapenos, and sour cream.',
    price: 150,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/dessert',
    category: 'Fast Food',
    weightOptions: ['Regular', 'Large'],
    available: true,
  },
  {
    name: 'Paneer Wrap',
    description: 'Grilled paneer tikka wrapped in a soft tortilla with mint chutney and fresh veggies.',
    price: 160,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/spices',
    category: 'Fast Food',
    weightOptions: ['Regular', 'Large'],
    available: true,
  },
  {
    name: 'Veg Momos (8 pcs)',
    description: 'Steamed vegetable momos served with spicy red chutney. Soft and flavorful.',
    price: 120,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/pot-mussels',
    category: 'Fast Food',
    weightOptions: ['8 pcs', '12 pcs'],
    available: true,
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Seed products
    await Cake.deleteMany({});
    const inserted = await Cake.insertMany(products);
    console.log(`Seeded ${inserted.length} products successfully!`);

    // Create admin user if not exists
    const adminEmail = 'admin@azservice.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        email: adminEmail,
        password: 'admin123',
        name: 'Admin',
        role: 'admin',
      });
      console.log('Admin user created: admin@azservice.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();

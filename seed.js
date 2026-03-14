const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Cake = require('./models/Cake');
const connectDB = require('./config/db');

dotenv.config();

const cakes = [
  {
    name: 'Chocolate Truffle Cake',
    description: 'Rich and indulgent chocolate truffle cake with layers of dark chocolate ganache. A chocolate lover\'s dream come true.',
    price: 500,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/dessert',
    category: 'Chocolate',
    weightOptions: ['500g', '1kg', '2kg'],
    available: true,
  },
  {
    name: 'Red Velvet Cake',
    description: 'Classic red velvet cake with smooth cream cheese frosting. Soft, moist, and beautifully vibrant.',
    price: 600,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/spices',
    category: 'Premium',
    weightOptions: ['500g', '1kg', '2kg'],
    available: true,
  },
  {
    name: 'Vanilla Sponge Cake',
    description: 'Light and fluffy vanilla sponge cake topped with fresh whipped cream and seasonal fruits.',
    price: 400,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/pot-mussels',
    category: 'Classic',
    weightOptions: ['500g', '1kg'],
    available: true,
  },
  {
    name: 'Butterscotch Crunch Cake',
    description: 'Delicious butterscotch cake with crunchy caramel praline pieces and creamy butterscotch frosting.',
    price: 550,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/fish-vegetables',
    category: 'Classic',
    weightOptions: ['500g', '1kg', '2kg'],
    available: true,
  },
  {
    name: 'Black Forest Cake',
    description: 'Traditional black forest cake with layers of chocolate sponge, whipped cream, and cherries.',
    price: 550,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/nature-mountains',
    category: 'Chocolate',
    weightOptions: ['500g', '1kg', '2kg'],
    available: true,
  },
  {
    name: 'Mango Delight Cake',
    description: 'Seasonal mango cake with fresh alphonso mango pulp layered with cream. A tropical treat!',
    price: 650,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/animals/three-dogs',
    category: 'Fruity',
    weightOptions: ['500g', '1kg'],
    available: true,
  },
  {
    name: 'Pineapple Cake',
    description: 'Soft pineapple-flavored sponge cake with pineapple glaze and cherry topping.',
    price: 450,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/accessories-bag',
    category: 'Fruity',
    weightOptions: ['500g', '1kg', '2kg'],
    available: true,
  },
  {
    name: 'Blueberry Cheesecake',
    description: 'Creamy New York style cheesecake with a rich blueberry compote topping on a buttery biscuit base.',
    price: 700,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man',
    category: 'Premium',
    weightOptions: ['500g', '1kg'],
    available: true,
  },
  {
    name: 'Strawberry Cream Cake',
    description: 'Fresh strawberry cake with layers of strawberry cream and topped with real strawberry slices.',
    price: 600,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/cloudinary-group',
    category: 'Fruity',
    weightOptions: ['500g', '1kg', '2kg'],
    available: true,
  },
  {
    name: 'Coffee Walnut Cake',
    description: 'Rich coffee-infused sponge cake with crunchy walnuts and mocha buttercream frosting.',
    price: 580,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/bike',
    category: 'Premium',
    weightOptions: ['500g', '1kg'],
    available: true,
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    await Cake.deleteMany({});
    const inserted = await Cake.insertMany(cakes);
    console.log(`Seeded ${inserted.length} cakes successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();

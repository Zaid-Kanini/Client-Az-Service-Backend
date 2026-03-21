const Cake = require('../models/Cake');
const { cloudinary } = require('../config/cloudinary');

const getAllCakes = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { available: true };
    if (category) filter.category = category;

    const cakes = await Cake.find(filter).sort({ createdAt: -1 });
    res.json(cakes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCakeById = async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) {
      return res.status(404).json({ message: 'Cake not found' });
    }
    res.json(cake);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addCake = async (req, res) => {
  try {
    const { name, description, price, category, weightOptions } = req.body;
    const image = req.file ? req.file.path : req.body.image;

    const cake = await Cake.create({
      name,
      description,
      price,
      image,
      category,
      weightOptions: weightOptions || ['500g', '1kg'],
    });

    res.status(201).json(cake);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

const updateCake = async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) {
      return res.status(404).json({ message: 'Cake not found' });
    }

    const updates = req.body;
    if (req.file) {
      // Delete old Cloudinary image if replacing
      if (cake.image && cake.image.includes('cloudinary.com')) {
        try {
          const parts = cake.image.split('/');
          const folder = parts[parts.length - 2];
          const fileWithExt = parts[parts.length - 1];
          const publicId = `${folder}/${fileWithExt.split('.')[0]}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudErr) {
          console.error('Cloudinary delete error:', cloudErr.message);
        }
      }
      updates.image = req.file.path;
    }

    const updated = await Cake.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

const deleteCake = async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) {
      return res.status(404).json({ message: 'Cake not found' });
    }

    // Delete image from Cloudinary if it's a Cloudinary URL
    if (cake.image && cake.image.includes('cloudinary.com')) {
      try {
        const parts = cake.image.split('/');
        const folder = parts[parts.length - 2];
        const fileWithExt = parts[parts.length - 1];
        const publicId = `${folder}/${fileWithExt.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.error('Cloudinary delete error:', cloudErr.message);
      }
    }

    await cake.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Cake.distinct('category', { available: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllCakes, getCakeById, addCake, updateCake, deleteCake, getCategories };

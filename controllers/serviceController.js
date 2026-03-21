const Service = require('../models/Service');
const { cloudinary } = require('../config/cloudinary');

const getAllServices = async (req, res) => {
  try {
    const filter = { active: true };
    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addService = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const image = req.file ? req.file.path : req.body.image || null;

    const service = await Service.create({
      name,
      description,
      price: price ? parseFloat(price) : null,
      image,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const updates = { ...req.body };
    if (req.file) {
      if (service.image && service.image.includes('cloudinary.com')) {
        try {
          const parts = service.image.split('/');
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

    if (updates.price) {
      updates.price = parseFloat(updates.price);
    }

    const updated = await Service.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.image && service.image.includes('cloudinary.com')) {
      try {
        const parts = service.image.split('/');
        const folder = parts[parts.length - 2];
        const fileWithExt = parts[parts.length - 1];
        const publicId = `${folder}/${fileWithExt.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.error('Cloudinary delete error:', cloudErr.message);
      }
    }

    await service.deleteOne();
    res.json({ message: 'Service removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllServices, getServiceById, addService, updateService, deleteService };

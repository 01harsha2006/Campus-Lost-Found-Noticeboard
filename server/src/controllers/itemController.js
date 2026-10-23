import mongoose from 'mongoose';
import Item from '../models/Item.js';

// Seed sample notices for immediate preview if MongoDB is not connected
let memoryItems = [
  {
    _id: new mongoose.Types.ObjectId().toString(),
    title: 'Blue Hydro Flask (32oz) with Engineering Stickers',
    category: 'Lost',
    location: 'Student Union Lounge, 2nd Floor',
    contactInfo: 'alex.chen@campus.edu',
    isResolved: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    title: 'Apple AirPods Pro 2 in Black Protective Case',
    category: 'Found',
    location: 'Library Quiet Study Room 3B',
    contactInfo: 'frontdesk.library@campus.edu',
    isResolved: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    title: 'TI-84 Plus CE Graphing Calculator',
    category: 'Found',
    location: 'Mathematics Building, Room 204',
    contactInfo: 'mathlab@campus.edu',
    isResolved: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    title: 'Black North Face Backpack with Notebooks',
    category: 'Lost',
    location: 'Campus Recreation Center Locker Room',
    contactInfo: 'jordan.m@campus.edu',
    isResolved: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * @desc    Fetch all items sorted by createdAt descending
 * @route   GET /api/items
 * @access  Public
 */
export const getItems = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const items = await Item.find().sort({ createdAt: -1 });
      return res.status(200).json(items);
    }

    // Fallback if MongoDB is not connected in development
    const sorted = [...memoryItems].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return res.status(200).json(sorted);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new lost/found item
 * @route   POST /api/items
 * @access  Public
 */
export const createItem = async (req, res, next) => {
  try {
    const { title, category, location, contactInfo } = req.body;

    // Strict validation of required fields
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!category || !['Lost', 'Found'].includes(category)) {
      return res.status(400).json({ message: "Category must be either 'Lost' or 'Found'" });
    }

    if (!location || typeof location !== 'string' || !location.trim()) {
      return res.status(400).json({ message: 'Location is required' });
    }

    if (!contactInfo || typeof contactInfo !== 'string' || !contactInfo.trim()) {
      return res.status(400).json({ message: 'Contact information is required' });
    }

    if (isDbConnected()) {
      const newItem = await Item.create({
        title: title.trim(),
        category,
        location: location.trim(),
        contactInfo: contactInfo.trim(),
        isResolved: false,
      });
      return res.status(201).json(newItem);
    }

    // Memory fallback
    const now = new Date().toISOString();
    const newItem = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: title.trim(),
      category,
      location: location.trim(),
      contactInfo: contactInfo.trim(),
      isResolved: false,
      createdAt: now,
      updatedAt: now,
    };
    memoryItems.unshift(newItem);
    return res.status(201).json(newItem);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

/**
 * @desc    Toggle item isResolved status
 * @route   PATCH /api/items/:id
 * @access  Public
 */
export const toggleItemResolved = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (isDbConnected()) {
      const item = await Item.findById(id);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }

      if (typeof req.body.isResolved === 'boolean') {
        item.isResolved = req.body.isResolved;
      } else {
        item.isResolved = !item.isResolved;
      }

      const updatedItem = await item.save();
      return res.status(200).json(updatedItem);
    }

    // Memory fallback
    const index = memoryItems.findIndex((it) => it._id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const currentItem = memoryItems[index];
    const newStatus =
      typeof req.body.isResolved === 'boolean'
        ? req.body.isResolved
        : !currentItem.isResolved;

    const updated = {
      ...currentItem,
      isResolved: newStatus,
      updatedAt: new Date().toISOString(),
    };
    memoryItems[index] = updated;

    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an item by ID
 * @route   DELETE /api/items/:id
 * @access  Public
 */
export const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (isDbConnected()) {
      const deletedItem = await Item.findByIdAndDelete(id);
      if (!deletedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }

      return res.status(200).json({
        message: 'Item deleted successfully',
        item: deletedItem,
      });
    }

    // Memory fallback
    const index = memoryItems.findIndex((it) => it._id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const [deleted] = memoryItems.splice(index, 1);
    return res.status(200).json({
      message: 'Item deleted successfully',
      item: deleted,
    });
  } catch (error) {
    next(error);
  }
};

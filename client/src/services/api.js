import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Safe check if we are in HTTPS environment trying to call HTTP localhost (which browsers block as Mixed Content)
const isMixedContent =
  typeof window !== 'undefined' &&
  window.location.protocol === 'https:' &&
  API_BASE_URL.startsWith('http://localhost');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000, // 3s timeout before fallback
});

// Seed sample notices for immediate preview if remote API is unreachable
const INITIAL_NOTICES = [
  {
    _id: '6adb9cb5c45c511441f39111',
    title: 'Leather Wallet with Student ID',
    category: 'Lost',
    location: 'Student Activity Center',
    contactInfo: 'student.help@campus.edu',
    isResolved: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    _id: '6adb9cf7c45c511441f39114',
    title: 'Blue Hydro Flask (32oz) with Engineering Stickers',
    category: 'Lost',
    location: 'Student Union Lounge, 2nd Floor',
    contactInfo: 'alex.chen@campus.edu',
    isResolved: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
  },
  {
    _id: '6adb9cf7c45c511441f39116',
    title: 'Apple AirPods Pro 2 in Black Protective Case',
    category: 'Found',
    location: 'Library Quiet Study Room 3B',
    contactInfo: 'frontdesk.library@campus.edu',
    isResolved: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    _id: '6adb9cf7c45c511441f39118',
    title: 'TI-84 Plus CE Graphing Calculator',
    category: 'Found',
    location: 'Mathematics Building, Room 204',
    contactInfo: 'mathlab@campus.edu',
    isResolved: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

// Helper to access persistent local storage
const getLocalStorageItems = () => {
  try {
    const raw = localStorage.getItem('campus_notices_data');
    if (!raw) {
      localStorage.setItem('campus_notices_data', JSON.stringify(INITIAL_NOTICES));
      return INITIAL_NOTICES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTICES;
  }
};

const setLocalStorageItems = (items) => {
  try {
    localStorage.setItem('campus_notices_data', JSON.stringify(items));
  } catch (e) {
    console.warn('Storage write failed', e);
  }
};

/**
 * Fetch all items sorted by createdAt descending
 * @returns {Promise<Array>} List of lost and found items
 */
export const getItems = async () => {
  if (isMixedContent) {
    return getLocalStorageItems();
  }

  try {
    const response = await apiClient.get('/items');
    if (Array.isArray(response.data)) {
      setLocalStorageItems(response.data);
      return response.data;
    }
    return getLocalStorageItems();
  } catch (error) {
    console.warn('[API Notice] Backend server unreachable, serving notices locally:', error.message);
    return getLocalStorageItems();
  }
};

/**
 * Submit a new item report
 * @param {Object} itemData - { title, category, location, contactInfo }
 * @returns {Promise<Object>} Created item
 */
export const createItem = async (itemData) => {
  if (isMixedContent) {
    const items = getLocalStorageItems();
    const newItem = {
      _id: 'item_' + Date.now() + Math.random().toString(36).substring(2, 6),
      title: itemData.title,
      category: itemData.category,
      location: itemData.location,
      contactInfo: itemData.contactInfo,
      isResolved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newItem, ...items];
    setLocalStorageItems(updated);
    return newItem;
  }

  try {
    const response = await apiClient.post('/items', itemData);
    const items = getLocalStorageItems();
    setLocalStorageItems([response.data, ...items]);
    return response.data;
  } catch (error) {
    console.warn('[API Notice] Fallback creating notice locally:', error.message);
    const items = getLocalStorageItems();
    const newItem = {
      _id: 'item_' + Date.now() + Math.random().toString(36).substring(2, 6),
      title: itemData.title,
      category: itemData.category,
      location: itemData.location,
      contactInfo: itemData.contactInfo,
      isResolved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newItem, ...items];
    setLocalStorageItems(updated);
    return newItem;
  }
};

/**
 * Toggle the resolved status of an item
 * @param {string} id - Item ID
 * @returns {Promise<Object>} Updated item
 */
export const toggleResolved = async (id) => {
  if (isMixedContent) {
    const items = getLocalStorageItems();
    const item = items.find((i) => i._id === id);
    if (!item) throw new Error('Item not found');
    item.isResolved = !item.isResolved;
    item.updatedAt = new Date().toISOString();
    setLocalStorageItems(items);
    return item;
  }

  try {
    const response = await apiClient.patch(`/items/${id}`);
    const items = getLocalStorageItems();
    const idx = items.findIndex((i) => i._id === id);
    if (idx !== -1) items[idx] = response.data;
    setLocalStorageItems(items);
    return response.data;
  } catch (error) {
    console.warn('[API Notice] Fallback toggling status locally:', error.message);
    const items = getLocalStorageItems();
    const item = items.find((i) => i._id === id);
    if (!item) throw new Error('Item not found');
    item.isResolved = !item.isResolved;
    item.updatedAt = new Date().toISOString();
    setLocalStorageItems(items);
    return item;
  }
};

/**
 * Delete an item by ID
 * @param {string} id - Item ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteItem = async (id) => {
  if (isMixedContent) {
    const items = getLocalStorageItems();
    const filtered = items.filter((i) => i._id !== id);
    setLocalStorageItems(filtered);
    return { message: 'Item deleted successfully' };
  }

  try {
    const response = await apiClient.delete(`/items/${id}`);
    const items = getLocalStorageItems();
    setLocalStorageItems(items.filter((i) => i._id !== id));
    return response.data;
  } catch (error) {
    console.warn('[API Notice] Fallback deleting notice locally:', error.message);
    const items = getLocalStorageItems();
    setLocalStorageItems(items.filter((i) => i._id !== id));
    return { message: 'Item deleted successfully' };
  }
};

/**
 * Check backend health status
 * @returns {Promise<Object>}
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch {
    return { status: 'offline' };
  }
};

export default apiClient;

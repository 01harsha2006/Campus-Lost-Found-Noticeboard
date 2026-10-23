import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Fetch all items sorted by createdAt descending
 * @returns {Promise<Array>} List of lost and found items
 */
export const getItems = async () => {
  const response = await apiClient.get('/items');
  return response.data;
};

/**
 * Submit a new item report
 * @param {Object} itemData - { title, category, location, contactInfo }
 * @returns {Promise<Object>} Created item
 */
export const createItem = async (itemData) => {
  const response = await apiClient.post('/items', itemData);
  return response.data;
};

/**
 * Toggle the resolved status of an item
 * @param {string} id - Item ID
 * @returns {Promise<Object>} Updated item
 */
export const toggleResolved = async (id) => {
  const response = await apiClient.patch(`/items/${id}`);
  return response.data;
};

/**
 * Delete an item by ID
 * @param {string} id - Item ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteItem = async (id) => {
  const response = await apiClient.delete(`/items/${id}`);
  return response.data;
};

/**
 * Check backend health status
 * @returns {Promise<Object>}
 */
export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export default apiClient;

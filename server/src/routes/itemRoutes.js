import express from 'express';
import {
  getItems,
  createItem,
  toggleItemResolved,
  deleteItem,
} from '../controllers/itemController.js';

const router = express.Router();

router.route('/')
  .get(getItems)
  .post(createItem);

router.route('/:id')
  .patch(toggleItemResolved)
  .delete(deleteItem);

export default router;

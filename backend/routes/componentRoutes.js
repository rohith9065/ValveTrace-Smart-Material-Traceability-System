import express from 'express';
import { createComponent, getAllComponents } from '../controllers/componentController.js';

const router = express.Router();

router.post('/', createComponent);
router.get('/', getAllComponents);

export default router;

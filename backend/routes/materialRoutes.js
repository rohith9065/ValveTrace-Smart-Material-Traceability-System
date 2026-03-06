import express from 'express';
import { createMaterial, getAllMaterials, getMaterialById } from '../controllers/materialController.js';

const router = express.Router();

router.post('/', createMaterial);
router.get('/', getAllMaterials);
router.get('/:id', getMaterialById);

export default router;

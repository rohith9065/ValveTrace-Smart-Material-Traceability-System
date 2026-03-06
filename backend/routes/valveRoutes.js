import express from 'express';
import { createValve, assembleValve, getAllValves } from '../controllers/valveController.js';

const router = express.Router();

router.post('/', createValve);
router.post('/assemble', assembleValve);
router.get('/', getAllValves);

export default router;

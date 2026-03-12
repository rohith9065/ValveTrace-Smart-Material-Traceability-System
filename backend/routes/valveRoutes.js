import express from 'express';
import { createValve, assembleValve, getAllValves, addTestReport, dispatchValves } from '../controllers/valveController.js';

const router = express.Router();

router.post('/', createValve);
router.post('/assemble', assembleValve);
router.post('/:id/test', addTestReport);
router.post('/dispatch', dispatchValves);
router.get('/', getAllValves);

export default router;

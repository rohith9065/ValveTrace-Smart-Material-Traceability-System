import express from 'express';
import { backwardTrace, forwardTrace } from '../controllers/traceController.js';

const router = express.Router();

router.get('/valve/:id', backwardTrace);
router.get('/material/:id', forwardTrace);

export default router;

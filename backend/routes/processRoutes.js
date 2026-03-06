import express from 'express';
import { logProcess } from '../controllers/processController.js';

const router = express.Router();

router.post('/scan', logProcess);

export default router;

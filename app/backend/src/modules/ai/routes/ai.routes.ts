// src/modules/ai/routes/ai.routes.ts

import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';

const router = Router();
const aiController = new AIController();

// POST /api/ai/query
router.post('/query', (req, res) => aiController.handleQuery(req, res));

export default router;
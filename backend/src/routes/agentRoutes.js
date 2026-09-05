import { Router } from 'express';
import { AgentController } from '../controllers/agentController.js';

const router = Router();

router.post('/analyze', AgentController.analyze);
router.post('/recommend', AgentController.recommend);
router.post('/execute', AgentController.execute);
router.get('/actions', AgentController.getActions);

export default router;

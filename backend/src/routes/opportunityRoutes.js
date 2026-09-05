import { Router } from 'express';
import { OpportunityController } from '../controllers/opportunityController.js';
import { validateObjectId } from '../middleware/validate.js';

const router = Router();

router.get('/', OpportunityController.getOpportunities);
router.get('/:id', validateObjectId('id'), OpportunityController.getOpportunityById);
router.patch('/:id/status', validateObjectId('id'), OpportunityController.updateOpportunityStatus);

export default router;

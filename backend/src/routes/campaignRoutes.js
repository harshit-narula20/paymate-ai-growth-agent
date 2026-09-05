import { Router } from 'express';
import { CampaignController } from '../controllers/campaignController.js';
import { validateObjectId } from '../middleware/validate.js';

const router = Router();

router.get('/', CampaignController.getCampaigns);
router.post('/', CampaignController.createCampaign);
router.get('/:id', validateObjectId('id'), CampaignController.getCampaignById);
router.post('/:id/execute', validateObjectId('id'), CampaignController.executeCampaignById);

export default router;

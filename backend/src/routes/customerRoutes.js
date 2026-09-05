import { Router } from 'express';
import { CustomerController } from '../controllers/customerController.js';
import { validateObjectId } from '../middleware/validate.js';

const router = Router();

router.get('/', CustomerController.getCustomers);
router.get('/:id', validateObjectId('id'), CustomerController.getCustomerById);

export default router;

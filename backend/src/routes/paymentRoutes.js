import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController.js';

const router = Router();

router.get('/', PaymentController.getPayments);
router.get('/failed', PaymentController.getFailedPayments);

export default router;

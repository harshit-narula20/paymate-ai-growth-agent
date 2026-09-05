import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController.js';

const router = Router();

router.get('/', TransactionController.getTransactions);

export default router;

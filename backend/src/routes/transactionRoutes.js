import express from 'express';
import { 
  getTransactionsHandler, 
  getFilterOptionsHandler 
} from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', getTransactionsHandler);
router.get('/filter-options', getFilterOptionsHandler);

export default router;


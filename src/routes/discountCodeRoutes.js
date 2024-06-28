import {Router} from 'express';
import { applyDiscountCode } from '../controllers/discountCodeController.js';

const router = Router();

router.post('/discount', applyDiscountCode);

export default router;

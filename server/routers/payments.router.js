import express from 'express'
import PaymentController from '../controllers/payments.controller.js'
import { verifyAdmin, verifyToken } from '../middlewares/auth.middleware.js';


const PaymentRouter=express.Router();

PaymentRouter.get('/',verifyToken, verifyAdmin,PaymentController.getAll);
PaymentRouter.get('/:id',verifyToken, PaymentController.getById);
PaymentRouter.post('/',verifyToken, verifyAdmin, PaymentController.add);
PaymentRouter.patch('/:id',verifyToken, verifyAdmin, PaymentController.update);

export default PaymentRouter;
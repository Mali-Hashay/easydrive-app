import express from 'express'
import PaymentController from '../controllers/payments.controller.js'
import { verifyAdmin, verifyToken } from '../middlewares/auth.middleware.js';


const PaymentRouter=express.Router();

PaymentRouter.get('/getAll',verifyToken, verifyAdmin,PaymentController.getAll);
PaymentRouter.get('/getById/:id',verifyToken, PaymentController.getById);
PaymentRouter.post('/add',verifyToken, PaymentController.add);
PaymentRouter.patch('/update/:id',verifyToken, verifyAdmin, PaymentController.update);

export default PaymentRouter;
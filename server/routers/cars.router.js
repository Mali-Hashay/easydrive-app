import express from 'express'
import CarController from '../controllers/cars.controller.js'
import { verifyAdmin, verifyToken } from '../middlewares/auth.middleware.js';

const CarRouter=express.Router();

CarRouter.get('/getAll',CarController.getAll);
CarRouter.get('/getById/:id',CarController.getById);
CarRouter.post('/add',verifyToken, verifyAdmin, CarController.add);
CarRouter.patch('/update/:id',verifyToken, verifyAdmin, CarController.update);
CarRouter.delete('/delete/:id',verifyToken, verifyAdmin, CarController.delete);
CarRouter.get('/availableCars', CarController.getAvailableCars);

export default CarRouter;

import express from 'express'
import CarController from '../controllers/cars.controller.js'
import { verifyAdmin, verifyToken } from '../middlewares/auth.middleware.js';

const CarRouter=express.Router();

CarRouter.get('/',CarController.getAll);
CarRouter.get('/available', CarController.getAvailableCars);
CarRouter.get('/:id',CarController.getById);
CarRouter.post('/',verifyToken, verifyAdmin, CarController.add);
CarRouter.patch('/:id',verifyToken, verifyAdmin, CarController.update);
CarRouter.delete('/:id',verifyToken, verifyAdmin, CarController.delete);

export default CarRouter;

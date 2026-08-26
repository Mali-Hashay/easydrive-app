import express from "express"
import RentalController from "../controllers/rentals.controller.js"
import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const RentalRouter=express.Router();

RentalRouter.get('/getAll',verifyToken, verifyAdmin, RentalController.getAll);
RentalRouter.get('/getById/:id',verifyToken, RentalController.getById);
RentalRouter.get('/my-rentals', verifyToken, RentalController.getMyRentals);
RentalRouter.post('/add',verifyToken, RentalController.add);
RentalRouter.patch('/update/:id',verifyToken, RentalController.update);
RentalRouter.delete('/delete/:id',verifyToken, verifyAdmin, RentalController.adminDelete);
RentalRouter.patch('/cancel/:id', verifyToken, RentalController.cancelRental);
RentalRouter.patch('/complete/:id',verifyToken, verifyAdmin, RentalController.completeRental);
RentalRouter.patch('/extend/:id',verifyToken,RentalController.extendRental);
RentalRouter.get('/update-rental-statuses', RentalController.updateRentalStatuses);

export default RentalRouter;
import express from "express"
import RentalController from "../controllers/rentals.controller.js"
import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const RentalRouter=express.Router();

RentalRouter.get('/',verifyToken, verifyAdmin, RentalController.getAll);
RentalRouter.get('/my-rentals', verifyToken, RentalController.getMyRentals);
RentalRouter.get('/update-rental-statuses', RentalController.updateRentalStatuses);
RentalRouter.get('/:id',verifyToken, RentalController.getById);
RentalRouter.post('/',verifyToken, RentalController.add);
RentalRouter.patch('/:id',verifyToken, verifyAdmin, RentalController.update);
RentalRouter.delete('/:id',verifyToken, verifyAdmin, RentalController.adminDelete);
RentalRouter.patch('/:id/cancel', verifyToken, RentalController.cancelRental);
RentalRouter.patch('/:id/complete',verifyToken, verifyAdmin, RentalController.completeRental);
RentalRouter.patch('/:id/status',verifyToken, verifyAdmin, RentalController.changeRentalStatus);
RentalRouter.patch('/:id/extend',verifyToken,RentalController.extendRental);

export default RentalRouter;
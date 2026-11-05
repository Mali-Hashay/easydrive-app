import express from "express"
import CategoriesController from "../controllers/categories.controller.js"
import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const CategoriesRouter=express.Router();

CategoriesRouter.get('/',CategoriesController.getAll);
CategoriesRouter.get('/:id',CategoriesController.getById);
CategoriesRouter.post('/',verifyToken, verifyAdmin, CategoriesController.add);
CategoriesRouter.patch('/:id',verifyToken, verifyAdmin, CategoriesController.update);
CategoriesRouter.delete('/:id',verifyToken, verifyAdmin, CategoriesController.delete);

export default CategoriesRouter
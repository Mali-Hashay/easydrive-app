import express from "express"
import CategoriesController from "../controllers/categories.controller.js"
import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const CategoriesRouter=express.Router();

CategoriesRouter.get('/getAll',CategoriesController.getAll);
CategoriesRouter.get('/getById/:id',CategoriesController.getById);
CategoriesRouter.post('/add',verifyToken, verifyAdmin, CategoriesController.add);
CategoriesRouter.patch('/update/:id',verifyToken, verifyAdmin, CategoriesController.update);
CategoriesRouter.delete('/delete/:id',verifyToken, verifyAdmin, CategoriesController.delete);

export default CategoriesRouter
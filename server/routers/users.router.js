import express from 'express'
import UserController from '../controllers/users.controller.js'
import {verifyToken, verifyAdmin } from '../middlewares/auth.middleware.js';

const UsersRouter = express.Router();

UsersRouter.get('/getAll',verifyToken, verifyAdmin, UserController.getAll);
UsersRouter.get('/getById/:id',verifyToken, UserController.getById);
UsersRouter.post('/add',verifyToken, verifyAdmin, UserController.add);
UsersRouter.patch('/update/:id',verifyToken, UserController.update);
UsersRouter.delete('/delete/:id',verifyToken, verifyAdmin, UserController.delete);


export default UsersRouter;
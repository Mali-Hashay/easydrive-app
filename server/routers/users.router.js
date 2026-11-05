import express from 'express'
import UserController from '../controllers/users.controller.js'
import {verifyToken, verifyAdmin } from '../middlewares/auth.middleware.js';

const UsersRouter = express.Router();

UsersRouter.get('/',verifyToken, verifyAdmin, UserController.getAll);
UsersRouter.get('/:id',verifyToken, UserController.getById);
UsersRouter.post('/',verifyToken, verifyAdmin, UserController.add);
UsersRouter.patch('/:id',verifyToken, verifyAdmin, UserController.update);
UsersRouter.delete('/:id',verifyToken, verifyAdmin, UserController.delete);


export default UsersRouter;
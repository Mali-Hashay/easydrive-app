import express from 'express';
import ContactController from '../controllers/contact.controller.js';
import {verifyToken, verifyAdmin} from '../middlewares/auth.middleware.js'

const ContactRouter = express.Router();

ContactRouter.post('/', ContactController.submitContactForm);

ContactRouter.get('/',verifyToken,verifyAdmin,ContactController.getAll);
ContactRouter.patch('/:id',verifyToken, verifyAdmin, ContactController.updateStatus);
ContactRouter.delete('/:id',verifyToken, verifyAdmin, ContactController.delete);

export default ContactRouter;


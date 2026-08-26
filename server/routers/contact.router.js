import express from 'express';
import ContactController from '../controllers/contact.controller.js';
import {verifyToken, verifyAdmin} from '../middlewares/auth.middleware.js'

const ContactRouter = express.Router();

ContactRouter.post('/submit-form', ContactController.submitContactForm);

ContactRouter.get('/getAll',verifyToken,verifyAdmin,ContactController.getAll);
ContactRouter.patch('/update-status/:id',verifyToken, verifyAdmin, ContactController.updateStatus);
ContactRouter.delete('/delete/:id',verifyToken, verifyAdmin, ContactController.delete);

export default ContactRouter;


import mongoose from "mongoose";
import {sendEmail} from '../utils/sendEmail.js'
import CategoriesController from "./categories.controller.js";
import Contact from "../models/contact.model.js";
import { contactAdminEmail, contactClientEmail } from '../utils/emailTemplates.js';

const ContactController ={

    getAll: async(req,res) =>{

       try{
             const contacts = await Contact.find({},{  __v: 0}).lean().sort({ createdAt: -1 });
             res.status(200).json(contacts);
        }
        catch(err){
            console.error("Server Error in getAll contacts:", err);
            console.log(err.message);
            res.status(500).json({ message: "שגיאה פנימית בשרת בטעינת רשימת הפניות" });
        }
    },

    updateStatus: async(req, res) => {

        const {id} = req.params;
        const {status} = req.body;

        if (!['pending', 'handled'].includes(status))
            return res.status(400).json({message: 'סטטוס לא תקין' });

        try{
            const contact = await Contact.findById(id);
            if (!contact) 
                return res.status(404).json({ success: false, message: 'הפנייה לא נמצאה במערכת' });
           
            contact.status = status;
            await contact.save();

            res.status(200).json(contact);
        }
        catch(err)
        {
            console.error('Error updating contact status:', error);
            res.status(500).json({ message: 'שגיאה בשרת בעדכון הסטטוס' });
        }
    },

    delete: async(req, res) => {

        const { id } = req.params; 

        try {
            const deletedContact = await Contact.findByIdAndDelete(id);
            if (!deletedContact) 
                return res.status(404).json({message: 'הפנייה לא נמצאה במערכת (ייתכן שכבר נמחקה)' });

            res.status(200).json({message: 'הפנייה נמחקה בהצלחה' });

        } 
        catch (error) {
            
            console.error('Error in deleteContact controller:', error); 
            res.status(500).json({message: 'שגיאה פנימית בשרת בזמן מחיקת הפנייה' });
        }
    },

   submitContactForm: async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'נא למלא את כל שדות החובה.' });
    }

    try {
        const newContact = new Contact({ name, email, phone, message });
        await newContact.save();

        const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

        const adminEmailData = contactAdminEmail({ name, email, phone, message });

        await sendEmail(adminEmail, adminEmailData.subject, adminEmailData.text, adminEmailData.html, email);

        const clientEmailData = contactClientEmail({ name });

        await sendEmail(email, clientEmailData.subject, clientEmailData.text, clientEmailData.html);

        return res.status(200).json({ message: 'הודעתך נשלחה בהצלחה!' });

    } catch (err) {
        console.error('Contact error:', err);
        return res.status(500).json({ message: 'שגיאה בשליחת ההודעה' });
    }
}
}

export default ContactController;
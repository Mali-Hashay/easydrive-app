import mongoose from "mongoose";

const Contact = mongoose.models.Contact || mongoose.model(
    "Contact",
    new mongoose.Schema({
        name:{
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        message: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now 
        },
        status: {
            type: String,
            enum: ['pending', 'handled'], 
            default: 'pending' 
        }
    }
));

export default Contact;
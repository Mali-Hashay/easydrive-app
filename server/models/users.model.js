import mongoose, { Schema } from 'mongoose'

const User=mongoose.models.User|| mongoose.model(
    "User",
    new mongoose.Schema({
        firstName:{
            type:String, 
            required:true, 
            minlength:[2, 'שם פרטי חייב להכיל לפחות שני תווים'],
            maxlength: 10,
        },
        lastName:{
            type:String, 
            required:true,
            minlength:[2, 'שם משפחה חייב להכיל לפחות שני תווים'],
            maxlength: 10,
        },
        email:{
            type:String, 
            required:true,
            unique: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'כתובת אימייל לא תקינה']
        },
        password:{
            type:String, 
            required:true,
            minlength:8
        },
        phoneNumber:{
            type:String,
            required:true, 
            match:[/^\+?[0-9\- ]{7,20}$/, 'מספר טלפון לא תקין'],
            minlength:10, 
            maxlength:15
        },
        idNumber: { 
            type: String, 
            trim: true, 
            minlength: [9, 'תעודת זהות חייבת להכיל בדיוק 9 ספרות'],
            maxlength: [9, 'תעודת זהות חייבת להכיל בדיוק 9 ספרות'],
            match: [/^\d+$/, 'תעודת זהות חייבת להכיל ספרות בלבד']
        },
        licenseNumber: { 
            type: String, 
            trim: true, 
            minlength: 8, 
            maxlength: 9, 
            match: /^\d+$/
        },
        birthDate: { 
            type: Date 
        },
        role: 
        {
            type: String,
            enum: ['customer', 'admin', 'staff'],
            default: 'customer',
            required: true,
        },
        status: 
        {
            type: String,
            required: true,
            enum: ['active', 'inactive', 'blocked'],
            default: 'active',
            trim: true,
        },
        passwordChangedAt: {
            type: Date
        }
    },"users")
);

export default User;
import mongoose, { Schema } from "mongoose";

const rentalSchema = new Schema(
    {
        clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
        pickupDate: { type: Date, required: true },
        plannedReturnDate: { type: Date, required: true },
        actualReturnDate: { type: Date },
        driversBirthDate: { type: Date, required: true },
        driversIdNumber: {
            type: String,
            required: true, 
            trim: true, 
            minlength: [9, 'תעודת זהות חייבת להכיל בדיוק 9 ספרות'],
            maxlength: [9, 'תעודת זהות חייבת להכיל בדיוק 9 ספרות'],
            match: [/^\d+$/, 'תעודת זהות חייבת להכיל ספרות בלבד']
        },
        licenseNumber: { 
            type: String, 
            required: true, 
            trim: true, 
            minlength: 8, 
            maxlength: 9, 
            match: [/^\d+$/, 'מספר רישיון חייב להכיל ספרות בלבד'] 
        },
        totalPrice: { type: Number, required: true },
        payments: [{
            type: Schema.Types.ObjectId,
            ref: 'Payment',
        }],
        status: {
            type: String,
            required: true, 
            enum: ['confirmed', 'active', 'completed', 'cancelled', 'overdue', 'deleted'],
            default: 'confirmed'
        },
    },
    {
        timestamps: true, 
        collection: 'rentals'
    }
);

const Rental = mongoose.models.Rental || mongoose.model("Rental", rentalSchema);

export default Rental;
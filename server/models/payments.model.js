import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
    {
        rentalId: { type: Schema.Types.ObjectId, required: true, ref: 'Rental' },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'authorized', 'paid', 'failed', 'refunded', 'partial_refund', 'cancelled'],
            default: 'pending',
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'paypal', 'apple_pay', 'google_pay'],
        },
        sum: { type: Number, required: true },
        paymentNumber: { type: String, unique: true, sparse: true },
        transactionId: { type: String, unique: true, sparse: true }
    },
    {
        timestamps: true, 
        collection: 'payments'
    }
);

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
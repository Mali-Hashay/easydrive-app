import Payment from "../models/payments.model.js";
import Rental from "../models/rentals.model.js";


export const createPayment = async ({rentalId, sum, paymentMethod = "credit_card" }) => {
    const payment = new Payment({
        rentalId,
        status: "paid",
        paymentMethod,
        paymentNumber: Math.floor(Math.random() * 1000000).toString(),
        transactionId: Math.floor(Math.random() * 1000000000).toString(),
        sum
    });

    await payment.save();
    return payment;
};


export const addPaymentToExistingRental = async (rentalId, sum, paymentMethod) => {
    const rental = await Rental.findById(rentalId);

    if (!rental)
        throw new Error('RENTAL_NOT_FOUND');

    const payment = await createPayment({rentalId, sum, paymentMethod});  
    rental.payments.push(payment._id);
    await rental.save()
    return payment;
};
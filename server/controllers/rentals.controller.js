import mongoose from "mongoose";
import Rental from '../models/rentals.model.js'
import Car from "../models/cars.model.js";
import Payment from "../models/payments.model.js";
import { createPayment } from "../services/paymentService.js";
import dayjs from "dayjs";
import User from "../models/users.model.js";
import { rentalConfirmationEmail } from "../utils/emailTemplates.js";
import { sendEmail } from "../utils/sendEmail.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const formatIsraelDateTime = (date) => dayjs(date)
    .tz('Asia/Jerusalem')
    .format('DD/MM/YYYY HH:mm');

// every started 24 hours counts as a full day, same as the client's calculateTotalPrice
const calculateRentalPrice = (start, end, dailyPrice) => {
    const totalHours = dayjs(end).diff(dayjs(start), 'hour', true);
    return Math.ceil(totalHours / 24) * dailyPrice;
};

// returns an error message if the rental dates are invalid, otherwise null
const getRentalDatesError = (start, end) => {
    if (isNaN(start.getTime()) || isNaN(end.getTime()))
        return "פורמט התאריכים שהוזנו אינו תקין";
    if (start <= new Date())
        return "מועד האיסוף חייב להיות עתידי";
    if (end <= start)
        return "מועד ההחזרה חייב להיות מאוחר ממועד האיסוף";
    return null;
};

// returns an error message if the car can't be booked for these dates, otherwise null.
// excludeRentalId lets an edited rental skip checking against itself
const getCarAvailabilityError = async (carId, start, end, excludeRentalId = null) => {
    const exclude = excludeRentalId ? { _id: { $ne: excludeRentalId } } : {};

    // an overdue rental blocks the car regardless of dates until the admin completes it
    const overdueRental = await Rental.exists({ carId, status: 'overdue', ...exclude });
    if (overdueRental)
        return "הרכב טרם הוחזר מהשכרה קודמת ולכן אינו זמין להזמנה כרגע";

    const overlappingRental = await Rental.exists({
        carId,
        status: { $in: ['confirmed', 'active'] },
        pickupDate: { $lt: end },
        plannedReturnDate: { $gt: start },
        ...exclude
    });
    if (overlappingRental)
        return "הרכב  מוזמן לתאריכים המבוקשים";

    return null;
};

const RentalController={

    //GET
     getAll: async(req,res)=>{
        try{
            const rentals = await Rental.find({ status: { $ne: 'deleted' } }, { __v: 0 })
            .lean()
            .populate('clientId', '-password') 
            .populate('carId');

             res.status(200).json(rentals);
        }
        catch(err){
            console.error("Server Error in getAll rentals:", err);
            res.status(500).json({ message: "שגיאה פנימית בשרת בטעינת רשימת ההשכרות" });
        }
    },
    //GET
    getById: async(req,res)=>{
        try{
            const {id}=req.params;
            const rental= await Rental.findById(id).select('-__v');

            if(!rental)
                return res.status(404).json({message: 'ההשכרה המבוקשת לא נמצאה'});
            
             if (!(rental.clientId.toString() === req.user.id  || req.user.role === 'admin')) 
                return res.status(403).json({ message: "אין הרשאה"});

             res.status(200).json(rental);
        }

        catch(err){
            console.error("Server Error in getById rental:", err);
            res.status(500).json({ message: "שגיאה פנימית בשרת בשליפת פרטי ההשכרה" });
        }
    },
    //GET
    getMyRentals: async (req, res) => {
        try {
            const clientId = req.user.id; 

            const rentals = await Rental.find(
                { clientId: clientId },
                { __v: 0 }
            ).populate({
                path: 'carId',
                select: 'brand model  imageUrl ' 
            })
            .sort({ createdAt: -1 });

            res.status(200).json(rentals);
        }
        catch (err) {
            console.error("Server Error in getMyRentals:", err);
            res.status(500).json({ message: "שגיאה פנימית בשרת בטעינת רשימת ההשכרות שלך" });
        }
    },
    //POST
    add: async (req, res) => {
    try {
        if (req.user.status === 'inactive') 
            return res.status(403).json({ message: "חשבון לא פעיל, לא ניתן לבצע השכרה" });
        
        const {
            carId, pickupDate, plannedReturnDate,
            driversBirthDate, driversIdNumber, licenseNumber, paymentInfo
        } = req.body;

        const car = await Car.findById(carId);
        if (!car) 
            return res.status(404).json({ message: "הרכב המבוקש לא נמצא במערכת" });
        // a currently rented car can still be booked for other dates; the overlap check below handles that
        if (['maintenance', 'inactive'].includes(car.status))
            return res.status(400).json({ message: "הרכב אינו זמין כרגע במערכת (בטיפול/מושבת)" });

        const start = new Date(pickupDate);
        const end = new Date(plannedReturnDate);

        const datesError = getRentalDatesError(start, end);
        if (datesError)
            return res.status(400).json({ message: datesError });

        const availabilityError = await getCarAvailabilityError(carId, start, end);
        if (availabilityError)
            return res.status(400).json({ message: availabilityError });

        // the price is always calculated here, a price sent by the client is not trusted
        const totalPrice = calculateRentalPrice(start, end, car.dailyPrice);

        const isSelfRental = req.user.role !== 'admin' || !req.body.clientId;
        const clientId = isSelfRental ? req.user.id : req.body.clientId;

        const newRentalId = new mongoose.Types.ObjectId();
        const newPayment = await createPayment({ rentalId: newRentalId, sum: totalPrice });

        const newRental = new Rental({
            _id: newRentalId,
            clientId,
            carId,
            pickupDate: start,
            plannedReturnDate: end,
            driversBirthDate,
            driversIdNumber,
            licenseNumber,
            totalPrice,
            payments: [newPayment._id],
            status: 'confirmed'
        });

        await newRental.save();

        try {
            const client = await User.findById(clientId).select('firstName email');
            if (client?.email) {
                const emailContent = rentalConfirmationEmail({
                    name: client.firstName || 'לקוח יקר',
                    car,
                    pickupDate: formatIsraelDateTime(start),
                    plannedReturnDate: formatIsraelDateTime(end),
                    totalPrice
                });

                await sendEmail(
                    client.email,
                    emailContent.subject,
                    emailContent.text,
                    emailContent.html
                );
            }
        } catch (emailError) {
            console.error("Rental confirmation email error:", emailError);
        }

        if (isSelfRental) {
            const userToUpdate = await User.findById(clientId);
            if (userToUpdate) {
                let isModified = false;

                if (driversBirthDate && !userToUpdate.birthDate) {
                    userToUpdate.birthDate = driversBirthDate;
                    isModified = true;
                }
                if (driversIdNumber && !userToUpdate.idNumber) {
                    userToUpdate.idNumber = driversIdNumber;
                    isModified = true;
                }
                if (licenseNumber && !userToUpdate.licenseNumber) {
                    userToUpdate.licenseNumber = licenseNumber;
                    isModified = true;
                }

                if (isModified) await userToUpdate.save();
            }
        }

        res.status(200).json(newRental);
    } catch (err) {
        console.error("Server Error in add rental:", err);
        res.status(500).json({ message: "שגיאה פנימית בשרת במהלך הוספת ההשכרה" });
    }
},
    //PATCH
    // admin only. status changes go through their own actions, not through here
    update: async (req, res) => {
    try {
        const { id } = req.params;
        const { driversIdNumber, licenseNumber, driversBirthDate, pickupDate, plannedReturnDate } = req.body;

        const rental = await Rental.findById(id);
        if (!rental)
            return res.status(404).json({ message: "הזמנה לא נמצאה" });

        if (rental.status !== 'confirmed')
            return res.status(400).json({ message: "ניתן לערוך הזמנה רק לפני מועד האיסוף" });

        if (driversIdNumber !== undefined) rental.driversIdNumber = driversIdNumber;
        if (licenseNumber !== undefined) rental.licenseNumber = licenseNumber;
        if (driversBirthDate !== undefined) rental.driversBirthDate = driversBirthDate;

        const start = new Date(pickupDate ?? rental.pickupDate);
        const end = new Date(plannedReturnDate ?? rental.plannedReturnDate);
        const datesChanged = start.getTime() !== rental.pickupDate.getTime() ||
                             end.getTime() !== rental.plannedReturnDate.getTime();

        if (datesChanged) {
            const datesError = getRentalDatesError(start, end);
            if (datesError)
                return res.status(400).json({ message: datesError });

            const availabilityError = await getCarAvailabilityError(rental.carId, start, end, rental._id);
            if (availabilityError)
                return res.status(400).json({ message: availabilityError });

            const car = await Car.findById(rental.carId);
            if (!car)
                return res.status(404).json({ message: "הרכב המקושר להזמנה לא נמצא" });

            rental.pickupDate = start;
            rental.plannedReturnDate = end;
            rental.totalPrice = calculateRentalPrice(start, end, car.dailyPrice);
        }

        await rental.save();
        await rental.populate('clientId', '-password');
        await rental.populate('carId');

        res.status(200).json(rental);
    } catch (err) {
        console.error("Server Error in update rental:", err);
        res.status(500).json({ message: "שגיאה פנימית בשרת במהלך עדכון ההשכרה" });
    }
},
    //PATCH
    cancelRental: async(req,res)=>{
        try{
            const {id}=req.params;
            const rental = await Rental.findById(id);
            if(!rental)
                return res.status(404).json({ message: "ההזמנה לא נמצאה" });

            const isOwner = rental.clientId.toString() === req.user.id;
            const isAdmin = req.user.role === 'admin';
            if (!isOwner && !isAdmin)
                return res.status(403).json({ message: "אין לך הרשאה לבטל הזמנה זו" });

            if (rental.status !== 'confirmed')
            return res.status(400).json({ message: "ניתן לבטל רק הזמנות עתידיות שטרם החלו" });

            const now = dayjs();
            const startDate = dayjs(rental.pickupDate);
            const hoursUntilStart = startDate.diff(now, 'hour') ;
            // admins can cancel at any time (for example: a last-minute call from the customer or a car stuck)
            if(!isAdmin && hoursUntilStart<24)
                return res.status(400).json({ message: "לא ניתן לבטל השכרה פחות מ-24 שעות לפני מועד ההתחלה"});
            
            // the car status is left untouched: a confirmed rental hasn't been picked up, so it never set the car to 'rented'.
            // its dates are freed automatically, since availability checks only count confirmed/active rentals
            rental.status = 'cancelled';
            await rental.save();

            res.status(200).json({message: "ההשכרה בוטלה בהצלחה", id});
        }
        catch(err){
            console.error("Server Error in delete rental:", err); 
            res.status(500).json({ message: "שגיאה פנימית בשרת במהלך ביטול ההשכרה" }); 
        }
    },
    
    //DELETE
    adminDelete: async (req, res) => {
        try {
            const {id} = req.params;
            const rental = await Rental.findById(id);

            if(!rental)
                return res.status(404).json({ message: "ההזמנה לא נמצאה" });

            if (['active', 'overdue'].includes(rental.status))
                return res.status(409).json({ message: "לא ניתן למחוק השכרה פעילה. יש לסיים את ההשכרה תחילה."});
            
            // the car status is left untouched: only active/overdue rentals hold the car, and those are blocked above
            rental.status = 'deleted';
            await rental.save();

            res.status(200).json({message: "ההזמנה נמחקה בהצלחה מהמערכת", id });
        }
        catch (err) {
            console.error("Server Error in admin delete rental:", err); 
            res.status(500).json({message: "שגיאה פנימית בשרת במהלך מחיקת ההזמנה" }); 
        }
    },
    //PATCH
    completeRental :async (req, res) => {
        try {
            const { id } = req.params;

            const rental = await Rental.findById(id);
            if (!rental) 
                return res.status(404).json({ message: "הזמנה לא נמצאה" });
            
            if (!['active', 'overdue'].includes(rental.status))
                return res.status(400).json({ message: "ניתן לסיים רק השכרה פעילה או באיחור" });

            rental.actualReturnDate = new Date();
            rental.status = 'completed';

            const car = await Car.findById(rental.carId);
            if (car) {
                car.status = 'available';
                await car.save();
            }
            await rental.save();
            await rental.populate('clientId', '-password');
            await rental.populate('carId');
        
            res.status(200).json({ message: "ההשכרה הסתיימה בהצלחה", rental });
        } catch (err) {
            console.error("Error in completeRental:", err);
            res.status(500).json({ message: "שגיאה פנימית בשרת במהלך סיום ההשכרה" });
        }
    },
    //PATCH
    // manual transitions for cases the automatic flow can't handle. every other status change has its own action
    changeRentalStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const allowedTransitions = {
                'confirmed': ['active'],    // early pickup
                'active': ['cancelled'],    // customer didn't show up
                'completed': ['active']     // undo a completion made by mistake
            };

            const rental = await Rental.findById(id);
            if (!rental)
                return res.status(404).json({ message: "הזמנה לא נמצאה" });

            if (!allowedTransitions[rental.status]?.includes(status))
                return res.status(409).json({ message: `פעולה לא חוקית: לא ניתן לשנות סטטוס השכרה מ-${rental.status} ל-${status}.` });

            const car = await Car.findById(rental.carId);
            if (!car)
                return res.status(404).json({ message: "הרכב המקושר להזמנה לא נמצא" });

            const isPickupToday = dayjs(rental.pickupDate).tz('Asia/Jerusalem')
                .isSame(dayjs().tz('Asia/Jerusalem'), 'day');

            // early pickup
            if (rental.status === 'confirmed') {
                if (!isPickupToday)
                    return res.status(400).json({ message: "ניתן לסמן איסוף רק ביום האיסוף המתוכנן" });
                if (car.status !== 'available')
                    return res.status(400).json({ message: "הרכב אינו זמין כרגע (מושכר ללקוח אחר, בטיפול או מושבת)" });

                car.status = 'rented';
                rental.status = 'active';
            }
            // customer didn't show up
            else if (rental.status === 'active') {
                if (!isPickupToday)
                    return res.status(400).json({ message: "ניתן לסמן אי הגעה  רק ביום האיסוף" });

                car.status = 'available';
                rental.status = 'cancelled';
            }
             // undo a completion made by mistake
            else if (rental.status === 'completed') {
                if (car.status !== 'available')
                    return res.status(400).json({ message: "לא ניתן לבטל את סיום ההשכרה: הרכב כבר מושכר ללקוח אחר, בטיפול או מושבת" });

                rental.actualReturnDate = undefined;
                rental.status = rental.plannedReturnDate < new Date() ? 'overdue' : 'active';
                car.status = 'rented';
            }

            // car first: if saving the rental fails, the car status is the easier one to correct
            await car.save();
            await rental.save();
            await rental.populate('clientId', '-password');
            await rental.populate('carId');

            res.status(200).json({ message: "סטטוס ההשכרה עודכן בהצלחה", rental });
        } catch (err) {
            console.error("Error in changeRentalStatus:", err);
            res.status(500).json({ message: "שגיאה פנימית בשרת במהלך עדכון סטטוס ההשכרה" });
        }
    },

    extendRental: async (req, res) => {
    try {
        const { id } = req.params;
        const { newReturnDate } = req.body; 

        const extensionDate = new Date(newReturnDate);
        if (extensionDate <= new Date()) 
            return res.status(400).json({ message: "תאריך ההארכה חייב להיות עתידי" });
        
        const rental = await Rental.findById(id);
        if (!rental || !(['active', 'confirmed', 'overdue'].includes(rental.status)))
            return res.status(404).json({ message: "לא ניתן להאריך השכרה זו (לא נמצאה או שאינה פעילה)" });

        const isOwner = rental.clientId.toString() === req.user.id;
        if (!isOwner && req.user.role !== 'admin')
            return res.status(403).json({ message: "אין לך הרשאה להאריך הזמנה זו" });

        if (extensionDate <= rental.plannedReturnDate) 
            return res.status(400).json({ message: "תאריך ההארכה חייב להיות מאוחר מתאריך ההחזרה הנוכחי" });
    
        const conflictingRental = await Rental.findOne({
            carId: rental.carId,
            _id: { $ne: rental._id }, 
            status: { $in: ['active', 'confirmed', 'overdue'] }, 
            pickupDate: { $lt: extensionDate },
            plannedReturnDate: { $gt: rental.plannedReturnDate }
        });

        if (conflictingRental) 
            return res.status(400).json({ message: "לא ניתן להאריך את ההשכרה. הרכב כבר מוזמן ללקוח אחר בתאריכים אלו." });
        
        rental.plannedReturnDate = extensionDate;

        if (rental.status === 'overdue') {
            rental.status = 'active';
        }
        
        const car = await Car.findById(rental.carId);
        if (!car) 
            return res.status(404).json({ message: "הרכב המקושר להזמנה לא נמצא" });

        rental.totalPrice = calculateRentalPrice(rental.pickupDate, extensionDate, car.dailyPrice);
        
        await rental.save();
        await rental.populate('clientId', '-password');
        await rental.populate('carId');

        res.status(200).json({ message: "ההשכרה הוארכה בהצלחה", rental });

    } catch (error) {
        console.error("Error extending rental:", error);
        res.status(500).json({ message: "שגיאה בהארכת ההשכרה", error: error.message });
    }
    },

    // intended to be triggered externally every 30 minutes to flip rentals to active/overdue and cars to rented
    updateRentalStatuses: async (req, res) => {
    try {

        const authHeader = req.headers.authorization;
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return res.status(403).json({ message: "גישה לא חוקית - אין הרשאה להפעיל פונקציה זו" });
        }
        const now = new Date();

        const startingRentals = await Rental.find({
            status: 'confirmed',
            pickupDate: { $lte: now }
        });

        for (const rental of startingRentals) {
            // Update the car first: if we crash before the rental is saved,
            // it stays 'confirmed' and the next run retries both updates.
            const car = await Car.findById(rental.carId);
            if (car) {
                car.status = 'rented';
                await car.save();
            }

            rental.status = 'active';
            await rental.save();
        }
        const overdueRentals = await Rental.find({
            status: 'active',
            plannedReturnDate: { $lt: now }
        });

        for (const rental of overdueRentals) {
            rental.status = 'overdue';
            await rental.save();
        }

        return res.status(200).json({
            message: "סטטוסי ההשכרות והרכבים עודכנו בהצלחה",
            activatedCount: startingRentals.length,
            overdueCount: overdueRentals.length
        });
    } catch (err) {
        console.error("Error running status update task:", err);
        return res.status(500).json({ message: "שגיאה פנימית בשרת במהלך עדכון הסטטוסים" });
    }
}
}
    
export default RentalController;

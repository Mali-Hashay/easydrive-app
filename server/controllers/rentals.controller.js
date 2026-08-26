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

const RentalController={

    //GET
     getAll: async(req,res)=>{
        try{
            if (req.user.role !== 'admin') 
                return res.status(403).json({ message: "אין לך הרשאה לצפות בכל ההשכרות במערכת" });
            
            const rentals = await Rental.find({ status: { $ne: 'cancelled' } }, { __v: 0 })
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
            carId, pickupDate, plannedReturnDate, actualReturnDate, 
            driversBirthDate, driversIdNumber, licenseNumber, totalPrice, paymentInfo
        } = req.body;

        const car = await Car.findById(carId);
        if (!car) 
            return res.status(404).json({ message: "הרכב המבוקש לא נמצא במערכת" });
        if (car.status !== 'available') 
            return res.status(400).json({ message: "הרכב אינו זמין כרגע במערכת (בטיפול/מושבת)" });

        const start = new Date(pickupDate);
        const end = new Date(plannedReturnDate);

        //  בדיקת חפיפת תאריכים מול השכרות קיימות  
        const existingRental = await Rental.findOne({
            carId,
            status: { $in: ['confirmed', 'active'] },
            pickupDate: { $lt: end },
            plannedReturnDate: { $gt: start }
        });

        if (existingRental) {
            return res.status(400).json({ message: "הרכב  מוזמן לתאריכים המבוקשים" });
        }


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
            actualReturnDate,
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
    //PUT
    update: async (req, res) => {
    try {
        const { id } = req.params;
        const { payments, status } = req.body;

        const rental = await Rental.findById(id);
        if (!rental)
            return res.status(404).json({ message: "הזמנה לא נמצאה" });
       
        const isOwner = rental.clientId.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin)
            return res.status(403).json({ message: "אין לך הרשאה לעדכן הזמנה זו" });

        if (isAdmin) {
            if (payments !== undefined) rental.payments = payments;
            if (status !== undefined) rental.status = status;
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
    //PUT
    cancelRental: async(req,res)=>{
        try{
            const {id}=req.params;
            const rental = await Rental.findById(id);
            if(!rental)
                return res.status(404).json({ message: "ההזמנה לא נמצאה" });

            if (rental.status !== 'confirmed') 
            return res.status(400).json({ message: "ניתן לבטל רק הזמנות עתידיות שטרם החלו" });
        
            const now = dayjs();
            const startDate = dayjs(rental.pickupDate);
            const hoursUntilStart = startDate.diff(now, 'hour') ;
            if(hoursUntilStart<24)
                return res.status(404).json({ message: "לא ניתן לבטל השכרה פחות מ-24 שעות לפני מועד ההתחלה"});
            
            rental.status = 'cancelled';
            await rental.save();
            
            await Car.findByIdAndUpdate(rental.carId, {status: 'available'});
            
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

            if (rental.status === 'active') 
                return res.status(409).json({ message: "לא ניתן למחוק השכרה פעילה. יש לסיים את ההשכרה תחילה."});
            
            if (rental.status === 'confirmed'|| rental.status === 'completed') 
                await Car.findByIdAndUpdate(rental.carId, { status: 'available' }, {new: true});
            
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
    
            if (req.user.role !== 'admin') 
                return res.status(403).json({ message: "אינך מורשה לסיים השכרה" });
            
            const rental = await Rental.findById(id);
            if (!rental) 
                return res.status(404).json({ message: "הזמנה לא נמצאה" });
            
            if (rental.status === 'completed') 
                return res.status(400).json({ message: "ההשכרה כבר הסתיימה בעבר" });
            
            rental.actualReturnDate = new Date();
            rental.status = 'completed';

        
            if (rental.carId) 
            {
                const car = await Car.findById(rental.carId);
                car.status = 'available';
                await car.save();
            }
            await rental.save();
            await rental.populate('clientId', '-password');
            await rental.populate('carId');
        
            res.status(200).json({ message: "ההשכרה הסתיימה בהצלחה", rental });
        } catch (err) {
            console.error("Error in completeRental:", err);
            res.status(500).json({ message: err.message });
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
        
        // עדכון תאריך ההחזרה המתוכנן
        rental.plannedReturnDate = extensionDate;

        if (rental.status === 'overdue') {
            rental.status = 'active';
        }
        
        const car = await Car.findById(rental.carId);
        if (!car) 
            return res.status(404).json({ message: "הרכב המקושר להזמנה לא נמצא" });

        const totalHours = dayjs(extensionDate).diff(dayjs(rental.pickupDate), 'hour', true);
        const totalDays = Math.ceil(totalHours / 24);
    
        rental.totalPrice = totalDays * car.dailyPrice;
        
        await rental.save();
        await rental.populate('clientId', '-password');
        await rental.populate('carId');

        res.status(200).json({ message: "ההשכרה הוארכה בהצלחה", rental });

    } catch (error) {
        console.error("Error extending rental:", error);
        res.status(500).json({ message: "שגיאה בהארכת ההשכרה", error: error.message });
    }
    },

    //פונקציה שתופעל אוטומטית בשרת מדי חצי שעה ע''מ לעדן השכרות לפעילות או רכבים למושכרים 
    updateRentalStatuses: async (req, res) => {
    try {

        const secretKey = req.query.secret; 
        if (secretKey !== process.env.CRON_SECRET) {
            return res.status(403).json({ message: "גישה לא חוקית - אין הרשאה להפעיל פונקציה זו" });
        }
        const now = new Date();

        const startingRentals = await Rental.find({
            status: 'confirmed',
            pickupDate: { $lte: now }
        });

        //עדכון להשכרות שמתחילות
        for (const rental of startingRentals) {
            rental.status = 'active';
            await rental.save();
            
            // עדכון הרכב לסטטוס rented
            const car = await Car.findById(rental.carId);
            car.status = 'rented';
            await car.save();

        }
        //עדכון להשכרות שבאיחור
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

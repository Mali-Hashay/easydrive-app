import express from 'express'
import mongoose from 'mongoose'
import Car from '../models/cars.model.js'
import Rental from '../models/rentals.model.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const CarController={

    //GET
    getAll: async(req,res)=>{
        try{
             const cars=await Car.find(
                { status: { $ne: 'inactive' } },
                {  __v: 0}).lean();

             res.status(200).json(cars);
        }
        catch(err){
            console.error("Server Error in getAll cars:", err); 
            res.status(500).json({ message: "שגיאה פנימית בשרת בטעינת רשימת הרכבים" })
        }
    },

    //GET
    getById: async(req,res)=>{
        try{
            const {id}=req.params;
            const car= await Car.findById(id).select('-__v');
            if(!car)
                return res.status(404).json({error: 'הרכב המבוקש לא נמצא'});
             res.status(200).json(car);
        }
        catch(err){
            console.error("Server Error in getById car:", err); 
            res.status(500).json({ message: "שגיאה פנימית בשרת בשליפת פרטי הרכב" });
        }
    },

    //POST
    add: async(req,res)=>{

        try{
            const {brand,model,licensePlate,year,categories,seats,transmission,fuelType,
                mileage,dailyPrice,status,imageUrl}=req.body;

            if (!licensePlate || !brand || !model) 
                return res.status(400).json({ message: "יצרן, דגם ומספר רישוי הם שדות חובה" });

            const existingCar = await Car.findOne({licensePlate: licensePlate});
            if(existingCar)
                return res.status(400).json({ message: "רכב עם מספר רישוי זה כבר קיים במערכת" });

            const newCar=new Car({
                brand,
                model,
                licensePlate,
                year,
                categories,
                seats,
                transmission,
                fuelType,
                mileage,
                dailyPrice,
                status,
                imageUrl
            })

            await newCar.save();
             res.status(200).json(newCar)
        }
        catch(err){
           console.error("Server Error in add car:", err); 
           res.status(500).json({ message: "שגיאה פנימית בשרת במהלך הוספת הרכב" });
        }
    },
    
    //PATCH
    update: async(req,res)=>{
        try{
            const{ id}=req.params
             const {categories,
                    mileage,dailyPrice,status,imageUrl}=req.body;

            const car=await Car.findById(id);
            if(!car)
                return res.status(404).json({message: "הרכב המבוקש לא נמצא" });

            const allowedTransitions = {
                'available': ['rented', 'maintenance', 'inactive'],
                'rented' : ['available'],
                'maintenance' : ['available'],
                'inactive' : ['available']
            }

            if(status!==undefined && status!==car.status)
            {
                if(!allowedTransitions[car.status].includes(status))
                    return res.status(409).json({ message: `פעולה לא חוקית: לא ניתן לשנות סטטוס רכב מ-${car.status} ל-${status}.`});
                car.status = status;
            }
               
           //רק אלו השדות שניתן לעדכן
            if (categories !== undefined) car.categories = categories;
            if (mileage !== undefined) car.mileage = mileage;
            if (dailyPrice !== undefined) car.dailyPrice = dailyPrice;
            if (imageUrl !== undefined) car.imageUrl = imageUrl;

            await car.save();
            res.status(200).json(car);
        }
        catch(err){
             console.error("Server Error in update car:", err); 
             res.status(500).json({ message: "שגיאה פנימית בשרת במהלך עדכון פרטי הרכב" });
        }
        },

    //DELETE
    delete: async(req,res)=>{
        try{
            const {id} = req.params;
            const car = await Car.findById(id);
            if(!car)
                return res.status(404).json({message: "רכב לא נמצא"});
            if(car.status ==='rented')
                return res.status(409).json({message:" רכב מושכר, לא ניתן למחוק"});
            car.status = 'inactive';
            await car.save();
            res.status(200).json({ id });
        }
        catch(err){
            console.error("Server Error in delete car:", err);
            res.status(500).json({ message: "שגיאה פנימית בשרת במהלך מחיקת הרכב" });
        }
    },

    //GET
   getAvailableCars: async (req, res) => {
    try {
        const { pickupDate, pickupTime, returnDate, returnTime } = req.query;

        console.log("=== 1. Request Query Params ===", req.query);

        if (!pickupDate || !returnDate) {
            const allCars = await Car.find({ status: 'available' }).lean();
            return res.status(200).json(allCars);
        }

        //  הגדרת ברירת מחדל לשעות: תחילת יום 00:00 וסוף יום 23:59  
        const startTime = pickupTime || '00:00';
        const endTime = returnTime || '23:59';

        // המרה אחידה לפי שעון ישראל
        const userStart = dayjs.tz(`${pickupDate}T${startTime}`, 'Asia/Jerusalem').toDate();
        const userEnd = dayjs.tz(`${returnDate}T${endTime}`, 'Asia/Jerusalem').toDate();

        console.log("=== 2. Parsed Dates ===");
        console.log("userStart (ISO/UTC):", userStart.toISOString(), "| Local:", userStart.toString());
        console.log("userEnd   (ISO/UTC):", userEnd.toISOString(), "| Local:", userEnd.toString());

        // בדיקת תקינות
        if (isNaN(userStart.getTime()) || isNaN(userEnd.getTime())) {
            return res.status(400).json({ message: "פורמט התאריכים שהוזנו אינו תקין" });
        }

        if (userStart > userEnd) {
            return res.status(400).json({ message: "תאריך ההתחלה אינו יכול להיות מאוחר מתאריך הסיום" });
        }

        // מציאת כל ההזמנות החופפות
        const overlappingRentals = await Rental.find({
            status: { $in: ['active', 'confirmed', 'overdue'] },
            pickupDate: { $lte: userEnd },
            plannedReturnDate: { $gte: userStart },
            $or: [
                { actualReturnDate: null },
                { actualReturnDate: { $exists: false } }
            ]
        }).select('carId pickupDate plannedReturnDate status').lean();

        console.log("=== 3. Overlapping Rentals Found ===", overlappingRentals);

        const busyCarIds = overlappingRentals.map(rental => rental.carId);
        console.log("=== 4. Busy Car IDs ===", busyCarIds);

        const finalCars = await Car.find({
            _id: { $nin: busyCarIds },
            status: { $ne: 'maintenance' }
        }).lean();

        console.log(`=== 5. Total Available Cars Returned: ${finalCars.length} ===`);

        res.status(200).json(finalCars);

    } catch (err) {
        console.error("Server Error in getAvailableCars:", err);
        res.status(500).json({ message: "שגיאה פנימית בשרת בחישוב זמינות הרכבים" });
    }
}}
export default CarController;
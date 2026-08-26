import mongoose from 'mongoose'
import Payment from '../models/payments.model.js'
import Rental from '../models/rentals.model.js';
import { addPaymentToExistingRental } from '../services/paymentService.js';
const PaymentController={

    //GET
    getAll: async(req,res)=>{
        try{
             const payments = await Payment.find({},{  __v: 0}).lean();
             res.status(200).json(payments);
        }

        catch(err){
            console.error("Server Error in getAll payments:", err);
            res.status(500).json({ message: "שגיאה פנימית בשרת בטעינת רשימת התשלומים" });
        }
    },
    //GET
    getById: async(req,res)=>{
        try{
            const {id} = req.params;
            const payment = await Payment.findById(id).select('-__v');
            if(!payment)
                return res.status(404).json({message: 'התשלום המבוקש לא נמצא' });

            //שליפת ההזמנה אליה מיוחס התשלום
            //כדי  לאמת את הלקוח- שדה שנמצא בהזמנה ולא בתשלום
            const rental = await Rental.findById(payment.rentalId);
            if (!rental)
                return res.status(404).json({ message: 'ההזמנה המשויכת לתשלום זה לא נמצאה' });

            if(!(req.user.id == rental.clientId.toString() || req.user.role === 'admin'))
                return res.status(403).json({message: "אין הרשאה"});

             res.status(200).json(payment);
        }
        catch(err){
            console.error("Server Error in getById payment:", err); 
            res.status(500).json({ message: "שגיאה פנימית בשרת בשליפת פרטי התשלום" });
        }
    },
    //POST
    add: async(req,res)=>{

        try{
            const {rentalId,sum, paymentMethod} = req.body;
            const savedPayment = await addPaymentToExistingRental(rentalId, sum,paymentMethod, req.user);
             res.status(200).json(savedPayment);
        }

        catch(err){
            if (err.message === 'RENTAL_NOT_FOUND') 
            return res.status(404).json({ message: 'ההזמנה לא נמצאה' });
        
            if (err.message === 'UNAUTHORIZED') 
            return res.status(403).json({ message: "אין הרשאה לביצוע התשלום" });

            console.error("Server Error in add payment:", err); 
            res.status(500).json({ message: "שגיאה פנימית בשרת במהלך הוספת התשלום" });
        }
    },
    //PUT
    update: async(req,res)=>{
        try{
            const{ id} = req.params;
            const {status,paymentMethod} = req.body;
            
            const payment=await Payment.findById(id);
            if(!payment)
                return res.status(404).json({message: "התשלום המבוקש לא נמצא"})

            const allowedTransitions = {
                'pending': ['authorized', 'paid', 'failed', 'cancelled'],
                'authorized': ['paid', 'cancelled', 'failed'],
                'paid': ['refunded', 'partial_refund'],
                'failed': [], 
                'refunded': [], 
                'partial_refund': ['refunded'], 
                'cancelled': []  
            };
          
           if (status !== undefined && status!==payment.status) 
           {
                if(!allowedTransitions[payment.status].includes(status))
                    return res.status(409).json({message: `פעולה לא חוקית: לא ניתן לשנות סטטוס תשלום מ-${payment.status} ל-${status}.`});

                payment.status = status;
           }
           
           if (paymentMethod !== undefined && paymentMethod!==payment.paymentMethod) 
           {
                if (['paid', 'refunded', 'partial_refund'].includes(payment.status)) 
                    return res.status(409).json({message: "לא ניתן לשנות אמצעי תשלום לאחר שהעסקה חויבה."});
                
                payment.paymentMethod = paymentMethod;
           }
           
           await payment.save();
           res.status(200).json(payment);
        }
        catch(err){
             console.error("Server Error in update payment:", err); 
             res.status(500).json({ message: "שגיאה פנימית בשרת במהלך עדכון התשלום" })
        }
        },   
}
    
export default PaymentController;
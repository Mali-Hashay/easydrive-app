import mongoose from 'mongoose'
import User from '../models/users.model.js'
import bcrypt from 'bcryptjs';

const UserController={

    //GET
    getAll: async(req,res)=>{
        try{
             const users=await User.find({},{  __v: 0, password: 0}).lean();
             res.status(200).json(users);
        }
        catch(err){
            res.status(500).json({message: "שגיאה פנימית בשרת בטעינת רשימת המשתמשים"});
        }
    },
    //GET
    getById: async(req,res)=>{
        try{
            const {id} = req.params;

             if(!(String(id) === String(req.user.id) || req.user.role === 'admin'))
                return res.status(403).json({ message: "אין לך הרשאה לצפות בפרטי משתמש זה"});

            const user = await User.findById(id).select('-__v -password');
            if(!user)
                return res.status(404).json({message: 'המשתמש לא נמצא'});

             res.status(200).json(user);
        }
        catch(err){
            console.error("Server Error in getById:", err);
            res.status(500).json({ message: "שגיאה פנימית בשרת בשליפת פרטי המשתמש" });
        }
    },
    //POST
    add: async(req,res)=>{

        try{
            const {firstName,lastName,email,password,phoneNumber,role,status,idNumber,licenseNumber,birthDate}=req.body;
            const existingUser = await User.findOne({ email });
             if (existingUser)
                return res.status(400).json({ message: "משתמש עם אימייל זה כבר קיים במערכת" });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser=new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phoneNumber,
                role,
                status,
                idNumber,
                licenseNumber,
                birthDate
            });

            await newUser.save();
            //מחיקת הסיסמה מהאוביקט המוחזר ללקוח- אבטחה
            const userResponse = newUser.toObject();
            delete userResponse.password;

            res.status(200).json(userResponse);
        }
        catch(err){
            console.error("Server Error in addUser:", err);
            res.status(500).json({ message: "שגיאה פנימית בשרת במהלך הוספת המשתמש" });
        }
    },
    //PATCH
    update: async(req,res)=>{
        try{
            const{ id}=req.params;
            const {firstName,lastName,email,phoneNumber,status,idNumber, licenseNumber, birthDate,role} = req.body;

            if(!(String(id) === String(req.user.id) || req.user.role == 'admin'))
                return res.status(403).json({error: "אין הרשאה"});
            
            const user  = await User.findById(id);
            if(!user)
                return res.status(404).json({message:"not found"})
          
            if (firstName !== undefined) user.firstName = firstName;
            if (lastName !== undefined) user.lastName = lastName;
            if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
            if (idNumber !== undefined) user.idNumber = idNumber;
            if (licenseNumber !== undefined) user.licenseNumber = licenseNumber;
            if (birthDate !== undefined) user.birthDate = birthDate;
            
            if (email !== undefined && email!==user.email) 
            {
                const existingUser = await User.findOne({email});
                if(existingUser)
                    return res.status(400).json({message: "כתובת האימייל כבר קיימת במערכת"})
                user.email = email;
            }
            if(req.user.role == 'admin' && status!==undefined)
                user.status = status;
            if (req.user.role === 'admin' && role !== undefined) 
                user.role = role;
            

            await user.save();

            const userResponse = user.toObject();
            delete userResponse.password;

            res.status(200).json({message: "הפרטים עודכנו בהצלחה",user: userResponse});
        }
        catch(err){
             console.error("Server Error in updateUser:", err);
             res.status(500).json({ message: "שגיאה פנימית בשרת במהלך עדכון הפרטים" });
        }
        },

    //DELETE
    delete: async(req,res)=>{
        try{
            const {id} = req.params;
            if (!(id === req.user.id || req.user.role === 'admin'))
                return res.status(403).json({ message: "אין לך הרשאה למחוק משתמש זה" });

            const user = await User.findByIdAndUpdate(id, {status: 'inactive'}, {new: true});
            if(!user)
                return res.status(404).json({ message: "המשתמש לא נמצא" });

            return res.status(200).json({ message: "המשתמש נמחק בהצלחה", id });
        }
        catch(err){
            console.error("Server Error in delete user:", err);
            res.status(500).json({ message: "שגיאה פנימית בשרת במהלך מחיקת המשתמש" });
        }
    },
}
    
export default UserController;
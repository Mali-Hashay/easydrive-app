import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { sendEmail } from "../utils/sendEmail.js";
import { resetPasswordEmail } from "../utils/emailTemplates.js";

const AuthController = {
   //POST
   register: async(req, res) => {
    
    try{
        const{firstName, lastName, email, password, phoneNumber} = req.body;
        
        const existingUser = await User.findOne({email});
        if(existingUser)
            return res.status(400).json({ message: "משתמש עם אימייל זה כבר קיים במערכת" });
    
        //הצפנת הסיסמה
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber
        });
        await newUser.save();
       
        //יצירת הטוקן
        const token = jwt.sign(
            {id: newUser._id, role: newUser.role},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        //מחיקת הסיסמה לפני ההחזרה ללקוח 
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(200).json({user: userResponse, token});
    }
    catch(err){
        console.error("full error: ", err); 
        res.status(500).json({ message: "שגיאה פנימית בשרת במהלך הרשמה" });
    }
   },

   //POST
   login: async(req, res) => {
    try{
        const {email, password} = req.body;
        if (!email || !password) 
            return res.status(400).json({ message: "נא להזין אימייל וסיסמה" });
        
        const user = await User.findOne({email, status: 'active'});
        if(!user)
            return res.status(404).json({message: "אימייל או סיסמה שגויים"});

        //בדיקה אם הסיסמה תואמת להצפנה
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            return res.status(400).json({message: "אימייל או סיסמה שגויים"});

        //יצירת טוקן
        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET || 'my_super_secret_key',
            {expiresIn: '7d'}
        );

        //מחיקת סיסמה לפני החזרה
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({user: userResponse, token});
    }
    catch(err){
        res.status(500).json({message: "שגיאה פנימית בשרת במהלך ההתחברות"});
    }
   },

   //GET
   getCurrentUser: async(req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        if (!user) 
            return res.status(404).json({ message: 'המשתמש לא נמצא' });
        
        res.status(200).json({user}); 
    } 
    catch (error){
        console.error("Server Error in getCurrentUser:", error);
        res.status(500).json({ message: 'שגיאת שרת' });
    }    
   },

   //POST- שחזור סיסמה
   forgotPassword: async(req, res) => {
    try{
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user)
            return res.status(404).json({message: ' משתמש לא נמצא'});

        //יצירת טוקן זמני, ברגע שהסיסמה החדשה תיווצר הוא לא יהיה בתוקף
        const secret = process.env.JWT_SECRET+ user.password;
        const token = jwt.sign(
            {id: user._id, email: email},
            secret,
            {expiresIn:'15m'}
        );

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${user._id}/${token}`;
        const emailContent = resetPasswordEmail({ resetLink });

        await sendEmail(user.email, emailContent.subject, emailContent.text, emailContent.html);

        res.status(200).json({ message: "נשלח מייל עם קישור לאיפוס סיסמה" });
    }
    catch(error){
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "שגיאה בשרת, נסה שוב מאוחר יותר" });
    }
   },

   //POST- איפוס סיסמה
   resetPassword : async(req, res) => {
    try{
        const {id, token} = req.params;
        const {newPassword} = req.body;

        const user = await User.findById(id);
        if (!user) 
            return res.status(404).json({ message: "משתמש לא קיים" });
        
        const secret = process.env.JWT_SECRET + user.password;
        
        jwt.verify(token, secret);
        //הצפנת הסיסמה החדשה
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.status(200).json({ message: "הסיסמה שונתה בהצלחה" });
    }
    catch(err){

        //שגיאת טוקן
       if(err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError')
            return res.status(400).json({message: "הקישור פג תוקף או שכבר נעשה בו שימוש"});
        //שגיאת שרת
        console.error("Server Error in resetPassword:", err);
        res.status(500).json({ message: "שגיאה פנימית בשרת" });
    }
   },
   //PATCH
    changePassword: async(req,res) => {
        try{
            const userId = req.user.id;
            const {currentPassword, newPassword} = req.body;

            if(!currentPassword || !newPassword)
                return res.status(400).json({ message: "יש להזין את הסיסמה הנוכחית ואת הסיסמה החדשה" });

            if (newPassword.length < 8) 
                return res.status(400).json({ message: "הסיסמה החדשה חייבת להכיל לפחות שמונה תווים" });

            const user = await User.findById(userId);
            if (!user) 
                return res.status(404).json({ message: "משתמש לא נמצא" });
            
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) 
                return res.status(401).json({ message: "הסיסמה הנוכחית שגויה" });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            user.passwordChangedAt = Date.now() - 1000;

            await user.save();

           const newToken = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.status(200).json({message: "הסיסמה שונתה בהצלחה",token: newToken});

        } catch (error) {
            console.error("Error in changePassword:", error);
            res.status(500).json({ message: "שגיאה פנימית בשרת במהלך שינוי הסיסמה" });
        }
    },
   // PATCH - עדכון פרטי המשתמש המחובר
    updateProfile: async (req, res) => {
        try {
            const {
                firstName,
                lastName,
                phoneNumber,
                idNumber,
                licenseNumber,
                birthDate
            } = req.body;

            const user = await User.findById(req.user.id);
            if (!user) 
                return res.status(404).json({ message: "המשתמש לא נמצא" });
            
            if (firstName !== undefined) user.firstName = firstName;
            if (lastName !== undefined) user.lastName = lastName;
            if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
            if (idNumber !== undefined) user.idNumber = idNumber;
            if (licenseNumber !== undefined) user.licenseNumber = licenseNumber;
            if (birthDate !== undefined) user.birthDate = birthDate;

            await user.save();

            const userResponse = user.toObject();
            delete userResponse.password;

            res.status(200).json({user: userResponse});
        } catch (err) {
            console.error("Server Error in update profile:", err);
            res.status(500).json({ message: "שגיאה פנימית בשרת במהלך עדכון הפרופיל" });
        }
    }
}

export default AuthController;
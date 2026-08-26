import jwt from 'jsonwebtoken';
import User from '../models/users.model.js';

export const verifyToken = async (req, res, next) => {
    try{
        
        let token = req.header('Authorization');
        if(!token)
            return res.status(401).json({message: "גישה נדחתה"});

        if(token.startsWith('Bearer '))
            token = token.slice(7).trim();

        const secret = process.env.JWT_SECRET ;
        const decoded = jwt.verify(token, secret);

        const user = await User.findById(decoded.id);
        if(!user)
            return res.status(401).json({ message: "המשתמש בעל הטוקן הזה אינו קיים במערכת" });
        
        if (user.passwordChangedAt) 
        {
            const changedTimestamp = Math.floor(user.passwordChangedAt.getTime() / 1000);
            if (decoded.iat < changedTimestamp) 
                return res.status(401).json({ message: "הסיסמה שונתה לאחרונה, אנא התחבר מחדש" });
        }
        req.user = user;

        next();
    }
    catch(err)
    {
        res.status(403).json({ message: "טוקן לא חוקי ", error: err.message });
    }
}

//אימות מנהל- אחרי אימות הטוקן הרגיל
export const verifyAdmin = (req, res, next) => {
    if(req.user && req.user.role == 'admin')
        next();
    else
        return res.status(403).json({message: "גישה נדחתה"});
}
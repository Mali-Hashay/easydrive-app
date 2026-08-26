import axios from 'axios';
import { privateApi, publicApi } from './axiosClient';



export const login = async (credentials)=> {
    try{
        const response = await publicApi.post('/auth/login', credentials);
        return response.data;
    }
    catch(error){
       console.error('API Error in login:', error);
       const errMsg = error.response?.data?.message || 'ההתחברות נכשלה, נא לנסות שוב מאוחר יותר';
       throw new Error(errMsg);
    }
}

export const register = async(userData) =>{
    try{
        const response = await publicApi.post(`/auth/register`, userData);
        return response.data;
    }
    catch(error){
        console.error('API Error in register:', error);
        const errMsg = error.response?.data?.message || 'ההרשמה נכשלה, נא לנסות שוב מאוחר יותר';
        throw new Error(errMsg);
    }
}

//בדיקת מצב החיבור בטעינת האתר
//אסינכרונית כי מתקשרת עם שרת ובודקת טוקן מההדפדפן -לכסות מקרים שהמידע ברידקס נמחק בגלל ריענון
//והמשתמש כביכול כבר לא מחובר ברידקס למרת שלא התנתק

export const getCurrentUser = async () => {
    try {
        const response = await privateApi.get('/auth/me'); 
        return response.data;
    } 
    catch (error) {
        console.error('API Error in checkAuthStatus:', error);
        
        const errMsg = error.response?.data?.message || 'לא ניתן לאמת את סטטוס החיבור של המשתמש';
        throw new Error(errMsg);
    }
}

export const forgotPassword= async(email) => {
    try{
        const response = await publicApi.post('/auth/forgot-password', {email});
        return response.data;
    }
    catch(error){
        console.error('API Error in forgotPassword:', error);
        const errorMessage = error.response?.data?.message || 'שגיאה בשליחת בקשה לשיחזור סיסמה';
        throw new Error(errorMessage); 
    }
}

export const resetPassword = async(id, token, newPassword) => {
    try{
        const response = await publicApi.post(`/auth/reset-password/${id}/${token}`, {newPassword});
        return response.data;
    }
    catch(error){
        console.error('API Error in resetPassword:', error);
        const errorMsg = error.response?.data?.message || 'שגיאה בשליחת בקשה לאיפוס סיסמה';
        throw new Error(errorMsg);
    }
}

export const changePassword = async({currentPassword, newPassword}) =>{
    try{
        const token = localStorage.getItem('token');

        if (!token) 
            return {message: 'לא נמצא טוקן בתוקף, אנא התחבר מחדש.'};
        
        const response = await privateApi.patch('/auth/change-password', {currentPassword, newPassword});

        if (response.data.token) 
            localStorage.setItem('token', response.data.token);

        return response.data;   
    }
    catch(error){
        console.error('API Error in changePassword');
        const errorMsg =error.response?.data?.message ||'אירעה שגיאה בשינוי הסיסמה. אנא נסה שוב מאוחר יותר.';
        throw new Error(errorMsg); 
    }
}

export const updateProfile = async (updateData) => {
    try {
        const response = await privateApi.patch('/auth/me', updateData);
        return response.data;
    } catch (error) {
        console.error('API Error in updateProfile:', error);
        const errMsg = error.response?.data?.message || 'עדכון הפרטים נכשל, נא לנסות שוב מאוחר יותר';
        throw new Error(errMsg);
    }
};
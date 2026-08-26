import axios from "axios";
import { privateApi } from "./axiosClient";

export const getAllPayments = async () => {
    try {
        const response = await privateApi.get('/payments/getAll');
        return response.data;  
    }
    catch (error) {
        console.error('API Error in getAllPayments:', error); 
        const errorMsg = error.response?.data?.message || 'לא ניתן לטעון את רשימת התשלומים'; 
        throw new Error(errorMsg);
    }
}

export const getPaymentById = async (id) => {
    try {
        const response = await privateApi.get(`/payments/getById/${id}`);
        return response.data;
    }
    catch (error) {
        console.error(`API Error in getPaymentById for ID ${id}:`, error);
        const errorMsg = error.response?.data?.message || 'לא ניתן למצוא את פרטי התשלום המבוקש'; 
        throw new Error(errorMsg);
    }
}

export const addPayment = async (paymentData) => {
    try {
        const response = await privateApi.post('/payments/add', paymentData);
        return response.data;
    }
    catch (error) {
        console.error('API Error in addPayment:', error);
        const errorMsg = error.response?.data?.message || "אירעה שגיאת תקשורת, ביצוע התשלום נכשל"; // שינוי: חילוץ שגיאה דינמית מהשרת
        throw new Error(errorMsg);
    }
}

export const updatePayment = async (id, updatedFields) => {
    try {
        const response = await privateApi.patch(`/payments/update/${id}`, updatedFields);
        return response.data;
    } 
    catch (error) {
        console.error(`API Error in updatePayment for ID ${id}:`, error); 
        const errorMsg = error.response?.data?.message || 'לא ניתן לעדכן את פרטי התשלום, אנא נסה שנית'; 
        throw new Error(errorMsg);
    }
}


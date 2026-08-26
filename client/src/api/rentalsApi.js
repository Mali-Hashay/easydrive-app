import axios from "axios";
import { privateApi } from "./axiosClient";

export const getAllRentals = async() => {
    try{
        const response= await privateApi.get('/rentals/getAll');
        return response.data;
    }
    catch(error){
        console.error('API Error in getAllRentals:', error);
        const errorMsg = error.response?.data?.message || 'לא ניתן לטעון את רשימת ההשכרות';
        throw new Error(errorMsg);
    }
}

export const getRentalById = async(id) => {
    try{
        const response= await privateApi.get(`/rentals/getById/${id}`);
        return response.data;
    }
    catch(error){
        console.error(`API Error in getRentalById for ID ${id}:`, error);
        const errorMsg = error.response?.data?.message || 'לא ניתן למצוא את פרטי ההשכרה המבוקשת';
        throw new Error(errorMsg);
    }
}

export const getMyRentals = async () => {
    try {
        const response = await privateApi.get('/rentals/my-rentals');
        return response.data;  
    } catch(error) {
        console.error("Error occurred while fetching my orders", error);
        const errorMsg = error.response?.data?.message || "אירעה שגיאה בטעינת ההזמנות שלך, נא לנסות שוב";
        throw new Error(errorMsg);
    }
}

export const addRental = async (rentalData) =>{
    try{
        const response= await privateApi.post('/rentals/add',rentalData);
        return response.data;  
    }
    catch(error){
        console.error("Error occurred while adding rental", error);
        const errorMsg = error.response?.data?.message || "אירעה שגיאה בהוספת ההשכרה, נא לנסות שוב"; // שינוי: חילוץ השגיאה הדינמית מהשרת
        throw new Error(errorMsg);
    }
}

export const updateRental = async (id, updatedFields) => {
    try{
        console.log(updatedFields);
        const response = await privateApi.patch(`/rentals/update/${id}`,updatedFields);
        return response.data;   
    }
    catch(error){
        console.error(`API Error in updateRental for ID ${id}:`, error);
        const errorMsg = error.response?.data?.message || 'לא ניתן לעדכן את פרטי ההשכרה'; 
        throw new Error(errorMsg);
    }
}

export const deleteRental = async(id) => {
    try{
        const response = await privateApi.delete(`/rentals/delete/${id}`);
        return response.data;
    }
    catch(error){
        console.error(`API Error in deleteRental for ID ${id}:`, error); 
        const errorMsg = error.response?.data?.message || 'לא ניתן למחוק את ההשכרה'; 
        throw new Error(errorMsg);
    }
}

export const cancelRental = async(id) => {
    try{
        const response = await privateApi.patch(`/rentals/cancel/${id}`);
        return response.data;
    }
    catch(error){
        console.error(`API Error in cancelRental for ID ${id}:`, error); 
        const errorMsg = error.response?.data?.message || 'לא ניתן לבטל את ההשכרה'; 
        throw new Error(errorMsg);
    }
}

export const completeRental = async(id) => {
    try{
        const response = await privateApi.patch(`/rentals/complete/${id}`);
        return response.data;
    }
    catch(error){
        console.error(`API Error in completeRental for ID ${id}:`, error); 
        const errorMsg = error.response?.data?.message || 'לא ניתן לסיים את ההשכרה'; 
        throw new Error(errorMsg);
    }
}

export const extendRental = async (id, newReturnDate) => {
    try {
        const response = await privateApi.patch(`/rentals/extend/${id}`, { newReturnDate });
        return response.data;
    }
    catch (error) {
        console.error(`API Error in extendRental for ID ${id}:`, error); 
        const errorMsg = error.response?.data?.message || 'לא ניתן להאריך את ההשכרה'; 
        throw new Error(errorMsg);
    }
};

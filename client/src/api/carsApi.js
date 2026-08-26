import axios from "axios";
import { privateApi, publicApi } from "./axiosClient";


export const getAllCars= async()=>{
    try{
        const response= await publicApi.get('/cars/getAll');
        return response.data;  
    }
    catch(error){
        console.error('API Error in getAllCars:', error);
        const errorMsg = error.response?.data?.message || 'לא ניתן לטעון את רשימת הרכבים';
        throw new Error(errorMsg);
    }
}

export const getCarById= async(id) =>{
    try{
        const response= await publicApi.get(`/cars/getById/${id}`);
        return response.data;
    }
    catch(error){
        console.error(`API Error in getCarById for ID ${id}:`, error);
        const errorMsg = error.response?.data?.message || 'לא ניתן למצוא את פרטי הרכב המבוקש';
        throw new Error(errorMsg);
    }
}

export const addCar = async (carData) =>{
    try{
        const response = await privateApi.post('/cars/add',carData);
        return response.data;
    }
    catch(error){
        console.error('API Error in addCar:', error);
        const errorMsg = error.response?.data?.message || "אירעה שגיאת תקשורת עם השרת, הוספת הרכב נכשלה";
        throw new Error(errorMsg);
    }
}

export const updateCarDetails = async (id, updatedFields) => {
    try{
        console.log("הנתונים שנשלחים:", updatedFields);
        const response = await privateApi.patch(`/cars/update/${id}`,updatedFields);
        return response.data;
    } 
    catch(error){
        console.error(`API Error in updateCar for ID ${id}:`, error);
        const errorMsg = error.response?.data?.message || 'לא ניתן לעדכן את פרטי הרכב, אנא נסה שנית'; 
        throw new Error(errorMsg);
    }
}

export const deleteCar = async(id) => {
    try{
        const response = await privateApi.delete(`/cars/delete/${id}`);
        return response.data;
    }
    catch(error){
         console.error(`API Error in deleteCar for ID ${id}:`, error);
        const errorMsg = error.response?.data?.message || 'לא ניתן למחוק את הרכב המבוקש';
        throw new Error(errorMsg);
    }
}
    
export const getAvailableCars = async (pickupDate, pickupTime, returnDate, returnTime) => {
    try{

        const response = await publicApi.get('/cars/availableCars',{
                params:{
                    pickupDate: pickupDate || undefined,
                    pickupTime: pickupTime || undefined,
                    returnDate: returnDate || undefined,
                    returnTime: returnTime || undefined,
                }
            }
               
        );
        return response.data;
    }
    catch(error){
        console.error('API Error in getAvailableCars:', error);
        const errorMsg = error.response?.data?.message || 'לא ניתן לטעון את רשימת הרכבים הזמינים לתאריכים אלו';
        throw new Error(errorMsg);
    }
}
   


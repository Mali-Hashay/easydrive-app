import axios from "axios";
import { privateApi } from "./axiosClient";

const BASIC_URL="http://localhost:5000/users";

export const getAllUsers = async()=>{
    try{
        const response = await privateApi.get('/users/getAll');
        return response.data;
    } 
    catch(error){ 
        console.error('An error occurred while fetching users', error);
        const errMsg = error.response?.data?.message || 'לא ניתן לטעון את רשימת המשתמשים';
        throw new Error(errMsg);
    }
}

export const getUserById = async(id) => {
    try{
        const response= await privateApi.get(`/users/getById/${id}`);
        return response.data;
    }
    catch(error){
        console.error(`API Error in getUserById for ID ${id}:`, error);
        const errorMsg = error.response?.data?.message || 'לא ניתן למצוא את פרטי המשתמש המבוקש';
        throw new Error(errorMsg);
    }
}

export const addUser= async(userData)=>{
    try{
        const response= await privateApi.post('/users/add',userData);
        return response.data;
    }
    catch(error){
        console.error('API Error in addUser:', error);
        const errorMsg = error.response?.data?.message || "אירעה שגיאה בהוספת המשתמש, נא לנסות שוב";
        throw new Error(errorMsg);
    }  
}

export const updateUser = async(id, updatedFields) => {
    try{
        //לבדוק לגבי שיטת גישה
        const response = await privateApi.patch(`/users/update/${id}`, updatedFields);
        return response.data;
    }
    catch (error) {
        console.error(`API Error in updateUser for ID ${id}:`, error);
        const errorMsg = error.response?.data?.message || 'לא ניתן לעדכן את פרטי המשתמש, אנא נסה שנית';
        throw new Error(errorMsg);
    }
}

export const deleteUser = async (id) => {
    try {
        const response = await privateApi.delete(`/users/delete/${id}`);
        return response.data;
    }
    catch (error) {
         console.error(`API Error in deleteUser for ID ${id}:`, error);
         const errorMsg = error.response?.data?.message || 'לא ניתן למחוק את המשתמש המבוקש';
         throw new Error(errorMsg);
    }
}



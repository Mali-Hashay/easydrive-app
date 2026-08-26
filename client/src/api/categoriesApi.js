import axios from "axios"
import { privateApi, publicApi } from "./axiosClient";

export const getAllCategories = async()=>{
    try{
        const response = await publicApi.get('/categories/getAll');
        return response.data;   
    } 
    catch(error){ 
        console.error('API Error in getAllCategories:', error);
        const errorMsg = error.response?.data?.message || 'לא ניתן לטעון את רשימת הקטגוריות'; 
        throw new Error(errorMsg);
    }
}

export const getCategoryById = async (id) =>{
    try{
        const response = await publicApi.get(`/categories/getById/${id}`);
        return response.data;
    }
    catch(error){
        console.error(`API Error in getCategoryById for ID ${id}:`, error);
        const errorMsg = error.response?.data?.message || 'לא ניתן למצוא את פרטי הקטגוריה המבוקשת'; 
        throw new Error(errorMsg);
    }
}

export const addCategory = async (categoryData) =>{
    try{
        const response = await privateApi.post('/categories/add',categoryData);
        return response.data;
    }
    catch(error){
        console.error('API Error in addCategory:', error);
        const errorMsg = error.response?.data?.message || "אירעה שגיאת תקשורת עם השרת, הוספת הקטגוריה נכשלה"; 
        throw new Error(errorMsg);
    }
}

export const updateCategory = async(id, updatedFields) => {
    try{
        //לבדוק מה לעשות בקשר לשיטת הגישה- כנל בשאר הקבצים
        const response = await privateApi.patch(`/categories/update/${id}`,
             updatedFields);
        return  response.data;
    } 
    catch(error){
        console.error(`API Error in updateCategory for ID ${id}:`, error);
        const errorMsg = error.response?.data?.message || 'לא ניתן לעדכן את פרטי הקטגוריה'; 
        throw new Error(errorMsg);
    }
}

export const deleteCategory = async(id) => {
    try{
        const response = await privateApi.delete( `/categories/delete/${id}`);
        return response.data;
    }
    catch (error) {
        console.error(`API Error in deleteCategory for ID ${id}:`, error);
        const errorMsg = error.response?.data?.message || 'לא ניתן למחוק את הקטגוריה המבוקשת';
        throw new Error(errorMsg);
    }
}

import { privateApi, publicApi } from "./axiosClient"

export const submitContactForm = async(formData) => { 
    try {
        
        const response = await publicApi.post('/contact/submit-form', formData);
        return response.data;
    }
    catch (err) { 
        console.error('API Error in submitContactForm:', err); 
        const errorMsg = err.response?.data?.message || 'לא ניתן לשלוח את טופס יצירת הקשר';
        throw new Error(errorMsg);
    }
};

export const getAllContacts = async () => {
    try {
        const response = await privateApi.get('/contact/getAll'); 
        return response.data; 
    } 
    catch (err) {
        console.error('API Error in getAllContacts:', err); 
        const errorMsg = err.response?.data?.message || 'לא ניתן לטעון את הפניות';
        throw new Error(errorMsg);;
    }
};

export const updateContactStatus = async (id, newStatus) => {
    try {
        const response = await privateApi.patch(`/contact/update-status/${id}`, { status: newStatus }); 
        return response.data; 
    } 
    catch (err) {
        console.error('API Error in updateContactStatus:', err); 
        const errorMsg = err.response?.data?.message || 'לא ניתן לעדכן את סטטוס הפניה';
        throw new Error(errorMsg);;
    }
};

export const deleteContact = async (id) => {
    try {
        const response = await privateApi.delete(`/contact/delete/${id}`); 
        return response.data; 
    } 
    catch (err) {
        console.error('API Error in deleteContact:', err); 
        const errorMsg = err.response?.data?.message || 'לא ניתן למחוק את הפניה';
        throw new Error(errorMsg);;
    }
};
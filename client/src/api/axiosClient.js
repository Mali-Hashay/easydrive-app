
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

//מופע כללי לפונקציות שלא ודרשות טקן
export const publicApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// מופע פרטי לפונקציות שדורשות טוקן
export const privateApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

//פונקציות שדורשות טוקן- שימוש במיירט
privateApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); 
        if (token) 
            config.headers.Authorization = `Bearer ${token}`;
        
        return config;
    },
    (error) => Promise.reject(error)
);
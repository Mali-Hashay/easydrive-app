
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// no auth needed
export const publicApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// attaches the token via the interceptor below
export const privateApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

privateApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); 
        if (token) 
            config.headers.Authorization = `Bearer ${token}`;
        
        return config;
    },
    (error) => Promise.reject(error)
);
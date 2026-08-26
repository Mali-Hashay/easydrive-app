
import { configureStore } from "@reduxjs/toolkit";

import rentalReducer from './slices/rentalSlice'
import categoryReducer from './slices/categorySlice'
import carReducer from './slices/carSlice'
import authReducer from './slices/authSlice'
import rentalFlowReducer from './slices/rentalFlowSlice'
import userReducer from './slices/userSlice'

 export const store=configureStore({
    reducer:{
        cars: carReducer,
        rentals: rentalReducer,
        categories: categoryReducer,
        auth: authReducer,
        rentalFlow: rentalFlowReducer,
        users: userReducer
    },
})

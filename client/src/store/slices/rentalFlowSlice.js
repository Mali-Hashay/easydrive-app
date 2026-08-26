import { createSlice } from "@reduxjs/toolkit"

const initialState ={

    //פרטי חיפוש
    searchParams : {
        pickupDate: '',
        pickupTime: '',
        returnDate: '',
        returnTime: ''
    },
    //הרכב הנבחר
    selectedCar: null,
    //פרטי לקוח
    personalDetails :{
        firstName: '',
        lastName: '',
        birthDate: '',
        idNumber: '',
        phone: '',
        licenseNumber: '',
    }
}

const rentalFlowSlice = createSlice({
    name: "rentalFlow",
    initialState,
    reducers: {
        setSearchParams: (state, action) => {
            state.searchParams = { ...state.searchParams, ...action.payload };
        },
        setSelectedCar: (state, action) => {
            state.selectedCar= action.payload;
        },
        setPersonalDetails: (state, action) => {
            state.personalDetails ={...state.personalDetails, ...action.payload} ;
        },
        clearRentalFlow: () => {
            return initialState; 
    }
    }
});

export const { 
  setSearchParams, 
  setSelectedCar, 
  setPersonalDetails, 
  clearRentalFlow 
} = rentalFlowSlice.actions;

export default rentalFlowSlice.reducer;
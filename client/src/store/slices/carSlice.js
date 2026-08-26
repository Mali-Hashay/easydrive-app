import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addCar, deleteCar, getAllCars, getAvailableCars, getCarById, updateCarDetails } from "../../api/carsApi";

const initialState = {
    allCars: [],
    availableCars: [],
    currentCar: null,
    loading: false,
    error: null,
}

export const fetchAllCars = createAsyncThunk(
    'cars/getAll',
    async(_, {rejectWithValue}) => {
        try{
            const data = await getAllCars();
            return data;
        }
        catch(error){
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCarById = createAsyncThunk(
    'cars/getCarById',
    async(carId, {rejectWithValue}) => {
        try{
            const data = await getCarById(carId);
            return data;
        }
        catch(error){
            return rejectWithValue(error.message);
        }
    }
);

export const addNewCar = createAsyncThunk(
    'cars/addCar',
    async(carData, {rejectWithValue})=> {
        try{
            const newCar = await addCar(carData);
            return newCar;
        }
        catch(error){
            return rejectWithValue(error.message);
        }
    }
);

export const updateCar = createAsyncThunk(
    'cars/updateCar',
    async({id, updatedFields}, {rejectWithValue})=> {
        try{
            const updatedCar = await updateCarDetails(id, updatedFields);
            return updatedCar;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeCar = createAsyncThunk(
    'cars/deleteCar',
    async (id, { rejectWithValue }) => {
        try {
            const data = await deleteCar(id);
            return data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAvailableCars = createAsyncThunk(
    'cars/availableCars',
    async({ pickupDate, pickupTime, returnDate, returnTime }, { rejectWithValue }) => {
        try{
            const data = await getAvailableCars(pickupDate, pickupTime, returnDate, returnTime);
            return data;
        }
        catch(error){
            return rejectWithValue(error.message);
        }
    }
);

const carSlice = createSlice({
    name: "cars",
    initialState,
    reducers: {
        resetCarStatus: (state) =>{
            state.error = null;
        },
        clearCurrentCar: (state) =>{
            state.currentCar = null;
        }
    },
    extraReducers: (builder) => {
        builder
        //טעינץ רשימת הרכבים
        .addCase(fetchAllCars.pending, (state) =>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllCars.fulfilled, (state,action) => {
            state.loading = false;
            state.allCars = action.payload;
        })
        .addCase(fetchAllCars.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //טעינת רכב לפי id
        .addCase(fetchCarById.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.currentCar = null;
        })
        .addCase(fetchCarById.fulfilled, (state, action) => {
            state.loading = false;
            state.currentCar = action.payload;
        })
        .addCase(fetchCarById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //הוספת רכב
        .addCase(addNewCar.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addNewCar.fulfilled, (state, action) => {
            state.loading = false;
            state.allCars.push(action.payload);
        })
        .addCase(addNewCar.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //עדכון פרטי רכב
        .addCase(updateCar.pending, (state)=> {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateCar.fulfilled, (state, action) => {
            state.loading = false;

            const updatedCar = action.payload;
            const index = state.allCars.findIndex(c=> c._id ===updatedCar._id);
            if(index !== -1)
                state.allCars[index] = updatedCar;
            //אם הרכב הנוכחי הוא זה שמתעדכן 
            if (state.currentCar && state.currentCar._id === updatedCar._id) {
                state.currentCar = updatedCar;
            }
        })
        .addCase(updateCar.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //מחיקת רכב
        .addCase(removeCar.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(removeCar.fulfilled, (state, action) => {
            state.loading = false;
            const deletedId = action.payload.id; 
            state.allCars = state.allCars.filter(c => c._id !== deletedId);
        })
        .addCase(removeCar.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchAvailableCars.pending, (state, action) => {
            state.loading = true;
            state.error = null;
            state.availableCars = [];
        })
        .addCase(fetchAvailableCars.fulfilled, (state, action) => {
            state.loading = false;
            state.availableCars = action.payload;
        })
        .addCase(fetchAvailableCars.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.availableCars = [];
        })
    }
})

export const { resetCarStatus, clearCurrentCar } = carSlice.actions;
export default carSlice.reducer;





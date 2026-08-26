

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addRental,getRentalById, updateRental, deleteRental, getAllRentals, getMyRentals, cancelRental, extendRental, completeRental} from "../../api/rentalsApi.js";

const initialState = {
    rentalsList:[],
    myRentals: [],
    currentRental: null,
    loading: false,
    error: null,
};

export const fetchAllRentals = createAsyncThunk(
    'rentals/getAll',
    async(_, {rejectWithValue}) => {
        try{
            const data = await getAllRentals();
            return data;
        }
        catch(error){
            return rejectWithValue(error.message);
        }  
    }
);

export const addNewRental = createAsyncThunk(
    'rentals/addRental',
    async(rentalData, {rejectWithValue}) => {
        try{
            const NewRental = await addRental(rentalData);
            return NewRental;
        } 
        catch(error){
            return rejectWithValue(error.message);
        }
    }
);

export const fetchRentalById = createAsyncThunk(
    'rentals/getById',
    async(id, {rejectWithValue}) => {
        try{
            const data = await getRentalById(id);
            return data;
        } catch(error){
            return rejectWithValue(error.message);
        }   
    }
);

export const fetchMyRentals = createAsyncThunk(
    'rentals/fetchMyRentals',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getMyRentals();
            return data;
        } 
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateExistingRental = createAsyncThunk(
    'rentals/updateRental',
    async({id, updatedFields}, {rejectWithValue}) => {
        try{
            console.log(updatedFields);
            const updatedRentalData = await updateRental(id, updatedFields);
            return updatedRentalData;
        }
        catch(error){
            return rejectWithValue(error.message);
        }
    }
);

export const removeRental = createAsyncThunk(
    'rentals/deleteRental',
    async (id, { rejectWithValue }) => {
        try {
            const data = await deleteRental(id);
            return data; 
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const cancelClientRental = createAsyncThunk(
    'rentals/cancelClientRental',
    async (id, { rejectWithValue }) => {
        try {
            const data = await cancelRental(id); 
            return data;
        } 
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const adminCompleteRental = createAsyncThunk(
    'rentals/adminCompleteRental',
    async (id, { rejectWithValue }) => {
        try {
            const data = await completeRental(id);
            return data.rental; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const extendRentalTime = createAsyncThunk(
    'rentals/extendRental',
    async ({ rentalId, newReturnDate }, { rejectWithValue }) => {
        try {
            const data = await extendRental(rentalId, newReturnDate);
            return data.rental; 
        } catch (err) {
            return rejectWithValue(err.message || 'שגיאה בהארכת ההשכרה');
        }
    }
);

const rentalSlice = createSlice({
    name: "rentals",
    initialState,
    reducers: {
        resetRentalStatus: (state) => {
            state.error = null;
       }
    },

    extraReducers: (builder) => {
        builder
        //טעינת רשימת ההשכרות
        .addCase(fetchAllRentals.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllRentals.fulfilled, (state, action) => {
            state.loading = false;
            state.rentalsList = action.payload;
        })
        .addCase(fetchAllRentals.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //טעינת השכרה לפי מזהה
        .addCase(fetchRentalById.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.currentRental = null;
        })
        .addCase(fetchRentalById.fulfilled, (state, action) => {
            state.loading = false;
            state.currentRental = action.payload; 
        })
        .addCase(fetchRentalById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //שליפת ההשכרות שלי
        .addCase(fetchMyRentals.pending, (state) => {
                state.loading = true;
                state.error = null;
        })
        .addCase(fetchMyRentals.fulfilled, (state, action) => {
                state.loading = false;
                state.myRentals = action.payload; 
        })
        .addCase(fetchMyRentals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; 
        })
        //הוספת השכרה: 
        .addCase(addNewRental.pending, (state) => {
            state.loading = true;
        })
        .addCase(addNewRental.fulfilled, (state, action) => {
            state.loading = false;
            state.rentalsList.push(action.payload);
        })
        .addCase(addNewRental.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //עדכון פרטי השכרה
        .addCase(updateExistingRental.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateExistingRental.fulfilled, (state, action) => {
            state.loading = false;

            const updatedRental = action.payload;
            const index = state.rentalsList.findIndex(rental=> 
                rental._id === updatedRental._id
            )
            if(index !==-1)
                state.rentalsList[index] = updatedRental;
            //אם ההשכרה הנוכחית היא זו שצריכה להתעדכן
            if (state.currentRental && state.currentRental._id === updatedRental._id) {
                state.currentRental = updatedRental;
    }
        })
        .addCase(updateExistingRental.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //מחיקת פרטי השכרה
        .addCase(removeRental.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(removeRental.fulfilled, (state, action) => {
            state.loading = false;
            const deletedId = action.payload.id;
            state.rentalsList = state.rentalsList.filter(r=>r._id !== deletedId);
        })
        .addCase(removeRental.rejected, (state, action) =>{
            state.loading= false;
            state.error = action.payload;
        })
        // ביטול השכרה על ידי לקוח
        .addCase(cancelClientRental.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(cancelClientRental.fulfilled, (state, action) => {
            state.loading = false;
            
            const cancelledId = action.payload.id;
            const index = state.myRentals.findIndex(r => r._id === cancelledId);
            if (index !== -1) 
                state.myRentals[index].status = 'cancelled';
            
        })
        .addCase(cancelClientRental.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //סיום השכרה ע''י מנהל 
        .addCase(adminCompleteRental.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(adminCompleteRental.fulfilled, (state, action) => {
            state.loading = false;
            
            const completedRental = action.payload;

            const listIndex = state.rentalsList.findIndex(r => r._id === completedRental._id);
            if (listIndex !== -1) 
                state.rentalsList[listIndex] = completedRental;

            const myIndex = state.myRentals.findIndex(r => r._id === completedRental._id);
            if (myIndex !== -1) 
                state.myRentals[myIndex] = completedRental;
            

            if (state.currentRental && state.currentRental._id === completedRental._id) 
                state.currentRental = completedRental;
            
        })
        .addCase(adminCompleteRental.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //הארכת תקופת ההשכרה
        .addCase(extendRentalTime.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(extendRentalTime.fulfilled, (state, action) => {
            state.loading = false;
            const updatedRental = action.payload; 

            const index = state.rentalsList.findIndex(r => r._id === updatedRental._id);
            if (index !== -1) 
                state.rentalsList[index] = updatedRental;

            const myIndex = state.myRentals.findIndex(r => r._id === updatedRental._id);
            if (myIndex !== -1) 
                state.myRentals[myIndex] = updatedRental;
            
            if (state.currentRental && state.currentRental._id === updatedRental._id) 
                state.currentRental = updatedRental;
                            
        })
        .addCase(extendRentalTime.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
        });
    },
    
    
})

export const {resetRentalStatus} = rentalSlice.actions;
export default rentalSlice.reducer; 
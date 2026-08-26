import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {  getCurrentUser, login, register, updateProfile } from "../../api/authApi";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async(credentials, {rejectWithValue})=>{
        try{
            const data = await login(credentials);
            if(data.token)
                localStorage.setItem("token", data.token);
            return data;
        }
        catch(error){
            return rejectWithValue(error.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async(userData, {rejectWithValue}) => {
        try{
            const data = await register(userData);
            if(data.token)
                localStorage.setItem("token", data.token);
            return data;
        }
        catch(error){
            return rejectWithValue(error.message);
        }
    }
);

export const currentUser = createAsyncThunk(
    'auth/me',
    async(_, {rejectWithValue}) => {
        try{
            const data = await getCurrentUser();
            return data;
        }
        catch(error){
            return rejectWithValue(error.message);
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateProfile',
    async (updateData, { rejectWithValue }) => {
        try {
            const data = await updateProfile(updateData);
            return data; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        logout: (state) => {
            state.user = null,
            state.isAuthenticated = false,
            state.error = null,
            localStorage.removeItem("token");
        },

        setInitialUser :(state, action) => {
            state.user = action.payload;
            state.isAuthenticated = action.payload ? true : false;
        }
    },
    extraReducers: (builder) =>{
        builder
        .addCase(loginUser.pending, (state, action) =>{
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(registerUser.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        })
        .addCase(registerUser.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(currentUser.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(currentUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        })
        //טוקן שגוי- או שאין טוקן כי המשתמש נכנס פעם ראשונה. לכן אין התייחסות לשגיאה
        .addCase(currentUser.rejected, (state, action)=> {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
        })
        //עדכון פרופיל
        .addCase(updateUserProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateUserProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
        })
        .addCase(updateUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });;
    }
});

export const { logout, setInitialUser } = authSlice.actions;
export default authSlice.reducer;
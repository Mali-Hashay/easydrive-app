import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { addCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../../api/categoriesApi"


const initialState ={
    categories: [],
    currentCategory: null,
    loading: false,
    error: null,
}

export const fetchAllCategories = createAsyncThunk(
    'categories/getAll',
    async(_, {rejectWithValue}) => {
        try{
            const data = await getAllCategories();
            return data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCategoryById = createAsyncThunk(
    'categories/getById',
    async(id, {rejectWithValue}) => {
        try{
            const data = await getCategoryById(id);
            return data;
        }
        catch(error)
        {
            return rejectWithValue(error.message);
        }
    }
);

export const addNewCategory = createAsyncThunk(
    'categories/addCategory',
    async (categoryData, { rejectWithValue }) => {
        try {
            const newCategory = await addCategory(categoryData);
            return newCategory;
        } 
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateCategoryDetails = createAsyncThunk(
    'categories/updateCategory',
    async({ id, updatedFields }, { rejectWithValue }) =>{
        try{
            const data = await updateCategory(id, updatedFields);
            return data;
        }
        catch(error){
            return rejectWithValue(error.message);
        }
    }
);

export const removeCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (id, { rejectWithValue }) => {
        try {
            const deletedData = await deleteCategory(id); 
            return deletedData; 
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers:{
        resetCategoryStatus: (state) => {
            state.error = null;
        },
        clearCurrentCategory: (state) => {
            state.currentCategory =null;
        }
    },
    extraReducers: (builder) => {
        builder
        //טעינת כל הקטגוריות
        .addCase(fetchAllCategories.pending, (state) =>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllCategories.fulfilled, (state,action) => {
            state.loading = false;
            state.categories = action.payload;
        })
        .addCase(fetchAllCategories.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.payload;
        })
        // טעינת קטגוריה לפי מזהה
        .addCase(fetchCategoryById.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.currentCategory = null;
        })
        .addCase(fetchCategoryById.fulfilled, (state, action) => {
            state.loading = false;
            state.currentCategory = action.payload; 
        })
        .addCase(fetchCategoryById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        // הוספת קטגוריה חדשה
        .addCase(addNewCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addNewCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.categories.push(action.payload);
        })
        .addCase(addNewCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        // עדכון קטגוריה קיימת
        .addCase(updateCategoryDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateCategoryDetails.fulfilled, (state, action) => {
            state.loading = false;
            
            const updatedCategory = action.payload;
            const index = state.categories.findIndex(c=> c._id === updatedCategory._id);
            if(index !== -1) {
                state.categories[index] = updatedCategory;;
            }
            if(state.currentCategory && state.currentCategory._id === updatedCategory._id)
                state.currentCategory = updatedCategory;
        })
        .addCase(updateCategoryDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //מחיקת קטגוריה
        .addCase(removeCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(removeCategory.fulfilled , (state, action) => {
             state.loading = false;
             
             const deletedId = action.payload.id;
             state.categories = state.categories.filter(c => c._id !== deletedId);
        })
        .addCase(removeCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export const {resetCategoryStatus, clearCurrentCategory} = categorySlice.actions;
export default categorySlice.reducer;
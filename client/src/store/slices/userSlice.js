import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUsers, addUser, updateUser, deleteUser } from '../../api/usersApi';

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const data =  await getAllUsers();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'שגיאה שטעינת משתמשים');
        }
    }
);

export const addNewUser = createAsyncThunk(
    'users/addNewUser',
    async (userData, { rejectWithValue }) => {
        try {
            const data =  await addUser(userData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'שגיאה בהוספת משתמש');
        }
    }
);


export const updateUserDetails = createAsyncThunk(
    'users/updateUserDetails',
    async ({ userId, updatedFields }, { rejectWithValue }) => {
        try {
            const data = await updateUser(userId, { updatedFields });
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'שגיאה בעדכון משתמש');
        }
    }
);

export const removeUser = createAsyncThunk(
    'users/removeUser',
    async (userId, { rejectWithValue }) => {
        try {
            const data = await deleteUser(userId);
            return data; 
        } catch (error) {
            return rejectWithValue(error.message || 'שגיאה במחיקת משתמש');
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            //שליפת כל השמשתמשים
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload || [];
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // הוספת משתמש
            .addCase(addNewUser.fulfilled, (state, action) => {
                state.users.push(action.payload); 
            })

            // עדכון פרטי משתמש
            .addCase(updateUserDetails.fulfilled, (state, action) => {
                const index = state.users.findIndex(u => u._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })

            //מחיקת משתמש
            .addCase(removeUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u._id !== action.payload);
            });
    },
});

export default userSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUsers, addUser, updateUser, deleteUser } from '../../api/usersApi';

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getAllUsers();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'שגיאה בטעינת משתמשים');
        }
    }
);

export const addNewUser = createAsyncThunk(
    'users/addNewUser',
    async (userData, { rejectWithValue }) => {
        try {
            const data = await addUser(userData);
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
            const data = await updateUser(userId, updatedFields);
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
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // שליפת כל המשתמשים
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
            .addCase(addNewUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNewUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(addNewUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // עדכון פרטי משתמש
            .addCase(updateUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload.user;
                const index = state.users.findIndex(u => u._id === updatedUser._id);
                if (index !== -1) {
                    state.users[index] = updatedUser;
                }
            })
            .addCase(updateUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //מחיקה רכה-עדכון סטטוס
            .addCase(removeUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                state.loading = false;
                const deletedUserId = action.payload._id 
      
                const user = state.users.find(u => u._id === deletedUserId);
                if (user) {
                    user.status = 'inactive';
                }
            })
            .addCase(removeUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
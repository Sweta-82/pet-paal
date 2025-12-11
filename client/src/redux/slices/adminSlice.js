import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/admin/users', { withCredentials: true });
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, { rejectWithValue }) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Artificial delay for UX
        await axios.delete(`/api/admin/users/${id}`, { withCredentials: true });
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const fetchAdminPets = createAsyncThunk('admin/fetchPets', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/admin/pets', { withCredentials: true });
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const deletePetAdmin = createAsyncThunk('admin/deletePet', async (id, { rejectWithValue }) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Artificial delay for UX
        await axios.delete(`/api/admin/pets/${id}`, { withCredentials: true });
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        pets: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete User
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user._id !== action.payload);
            })
            // Fetch Pets
            .addCase(fetchAdminPets.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAdminPets.fulfilled, (state, action) => {
                state.loading = false;
                state.pets = action.payload;
            })
            .addCase(fetchAdminPets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Pet
            .addCase(deletePetAdmin.fulfilled, (state, action) => {
                state.pets = state.pets.filter((pet) => pet._id !== action.payload);
            });
    },
});

export default adminSlice.reducer;

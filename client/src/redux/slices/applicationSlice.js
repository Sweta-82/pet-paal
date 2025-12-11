import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    applications: [],
    loading: false,
    error: null,
    success: false,
};

export const createApplication = createAsyncThunk('applications/create', async (applicationData, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        };
        await new Promise(resolve => setTimeout(resolve, 2000)); // Artificial delay for UX
        const { data } = await axios.post('/api/applications', applicationData, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

export const fetchMyApplications = createAsyncThunk('applications/fetchMy', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/applications/my', { withCredentials: true });
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

export const fetchShelterApplications = createAsyncThunk('applications/fetchShelter', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/applications/shelter', { withCredentials: true });
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

export const updateApplicationStatus = createAsyncThunk('applications/updateStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        };
        await new Promise(resolve => setTimeout(resolve, 2000)); // Artificial delay for UX
        const { data } = await axios.put(`/api/applications/${id}/status`, { status }, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

const applicationSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {
        resetSuccess: (state) => {
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createApplication.pending, (state) => {
                state.loading = true;
            })
            .addCase(createApplication.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(createApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMyApplications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload;
            })
            .addCase(fetchMyApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchShelterApplications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchShelterApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload;
            })
            .addCase(fetchShelterApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateApplicationStatus.fulfilled, (state, action) => {
                const index = state.applications.findIndex((app) => app._id === action.payload._id);
                if (index !== -1) {
                    state.applications[index] = action.payload;
                }
            });
    },
});

export const { resetSuccess } = applicationSlice.actions;
export default applicationSlice.reducer;

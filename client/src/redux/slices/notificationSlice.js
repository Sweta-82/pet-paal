import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/notifications', { withCredentials: true });
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const markNotificationAsRead = createAsyncThunk('notifications/markRead', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`/api/notifications/${id}/read`, {}, { withCredentials: true });
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        loading: false,
        error: null,
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const index = state.notifications.findIndex((n) => n._id === action.payload._id);
                if (index !== -1) {
                    state.notifications[index] = action.payload;
                }
            });
    },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

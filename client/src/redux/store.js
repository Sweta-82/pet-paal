import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import petReducer from './slices/petSlice';
import applicationReducer from './slices/applicationSlice';
import adminReducer from './slices/adminSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        pets: petReducer,
        applications: applicationReducer,
        admin: adminReducer,
        notifications: notificationReducer,
    },
});

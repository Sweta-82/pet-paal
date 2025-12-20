import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    pets: [],
    pet: null,
    loading: false,
    error: null,
    page: 1,
    pages: 1,
};

export const fetchPets = createAsyncThunk('pets/fetchPets', async ({ keyword = '', pageNumber = '', category = '', age = '', breed = '', location = '' } = {}, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/pets?keyword=${keyword}&pageNumber=${pageNumber}&category=${category}&age=${age}&breed=${breed}&location=${location}`);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

export const fetchPetDetails = createAsyncThunk('pets/fetchPetDetails', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/pets/${id}`);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

export const createPet = createAsyncThunk('pets/createPet', async (petData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = {
            headers: {
                // When sending FormData, axios automatically sets the 'Content-Type' to 'multipart/form-data'
                // and includes the correct boundary. Explicitly setting it can sometimes cause issues.
                // We only need to ensure the Authorization header is present if required by the backend
                // and that cookies are sent for session management.
                Authorization: `Bearer ${userInfo.token}`, // Note: We are using cookie based auth, but if we needed token header it would go here. Since we use cookies, axios handles it if credentials: true is set globally or per request.
                // However, our backend middleware checks req.cookies.jwt.
                // Let's ensure axios sends cookies.
            },
            withCredentials: true,
        };
        await new Promise(resolve => setTimeout(resolve, 2000)); // Artificial delay for UX
        const { data } = await axios.post('/api/pets', petData, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

export const updatePet = createAsyncThunk('pets/updatePet', async ({ id, petData }, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
            withCredentials: true,
        };
        await new Promise(resolve => setTimeout(resolve, 2000)); // Artificial delay for UX
        const { data } = await axios.put(`/api/pets/${id}`, petData, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

export const deletePet = createAsyncThunk('pets/deletePet', async (id, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
            withCredentials: true,
        };
        await new Promise(resolve => setTimeout(resolve, 2000)); // Artificial delay for UX
        await axios.delete(`/api/pets/${id}`, config);
        return id;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

export const fetchShelterPets = createAsyncThunk('pets/fetchShelterPets', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/pets/my-pets', { withCredentials: true });
        return data; // Should be an array of pets
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

const petSlice = createSlice({
    name: 'pets',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPets.pending, (state) => {
                state.loading = true;
                state.pets = [];
            })
            .addCase(fetchPets.fulfilled, (state, action) => {
                state.loading = false;
                state.pets = action.payload.pets;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
            })
            .addCase(fetchPets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPetDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPetDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.pet = action.payload;
            })
            .addCase(fetchPetDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createPet.fulfilled, (state, action) => {
                state.pets.push(action.payload);
                state.loading = false;
            })
            .addCase(createPet.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updatePet.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePet.fulfilled, (state, action) => {
                state.loading = false;
                state.pet = action.payload;
                state.pets = state.pets.map((p) => (p._id === action.payload._id ? action.payload : p));
            })
            .addCase(updatePet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deletePet.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePet.fulfilled, (state, action) => {
                state.loading = false;
                state.pets = state.pets.filter((p) => p._id !== action.payload);
            })
            .addCase(deletePet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchShelterPets.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchShelterPets.fulfilled, (state, action) => {
                state.loading = false;
                state.pets = action.payload;
            })
            .addCase(fetchShelterPets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default petSlice.reducer;

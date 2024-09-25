import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SchoolResponse, School, SchoolState } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uri } from "@/utils/uri";

// school registration
export const addSchool = createAsyncThunk<SchoolResponse, School>(
  "school/add",
  async (school, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${uri}/api/v1/add/school`, school, {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// school list
export const listSchool = createAsyncThunk<SchoolResponse, void>(
  "school/list",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${uri}/api/v1/list/schools`);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// school list by id
export const listSchoolById = createAsyncThunk<SchoolResponse, School>(
  "school/list/id",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${uri}/api/v1/list/schools/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState: SchoolState = {
  schools: [],

  loading: false,
  error: null,
};

const schoolSlice = createSlice({
  name: "schools",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // create school states
      .addCase(addSchool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSchool.fulfilled, (state, action) => {
        state.loading = false;
        state.schools = action.payload.data || [];
      })
      .addCase(addSchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // list school states
      .addCase(listSchool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listSchool.fulfilled, (state, action) => {
        state.loading = false;
        state.schools = action.payload.data || [];
      })
      .addCase(listSchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // list school by id states
      .addCase(listSchoolById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listSchoolById.fulfilled, (state, action) => {
        state.loading = false;
        state.schools = action.payload.data || [];
      })
      .addCase(listSchoolById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default schoolSlice.reducer;

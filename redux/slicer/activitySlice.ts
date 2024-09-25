import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Activity, ActivityResponse, ActivityState } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uri } from "@/utils/uri";

// create activity
export const createActivity = createAsyncThunk<ActivityResponse, Activity>(
  "activity/create-activity",
  async (
    { id, device, hardware, description, color, icon },
    { rejectWithValue }
  ) => {
    try {
      const payload = {
        device: device,
        hardware: hardware,
        description: description,
        color: color,
        icon: icon,
      };
      const response = await axios.post(
        `${uri}/api/v10/create/device-history/${id}`,
        payload
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.message);
    }
  }
);

// get activity by user id
export const getActivityByUserId = createAsyncThunk<
  ActivityResponse,
  { id: number }
>("activity/by-user", async ({ id }, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${uri}/api/v10/device-history/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.message);
  }
});

// delete activity by user id
export const deleteActivityByUserId = createAsyncThunk<
  ActivityResponse,
  { id: number }
>("activity/delete/by-user", async ({ id }, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.delete(
      `${uri}/api/v10/delete/device-history/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.log(error);

    return rejectWithValue(error.response?.message);
  }
});

const initialState: ActivityState = {
  activities: [],
  loading: false,
  error: null,
};

const ActivitySlice = createSlice({
  name: "activities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // create activity states
      .addCase(createActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.data || [];
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // list activity by user id states
      .addCase(getActivityByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActivityByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.data || [];
      })
      .addCase(getActivityByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // delete activity by user id states
      .addCase(deleteActivityByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteActivityByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.data || [];
      })
      .addCase(deleteActivityByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default ActivitySlice.reducer;

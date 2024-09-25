import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AttendanceResponse, AttendanceState } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uri } from "@/utils/uri";

export const getAttendancesDetails = createAsyncThunk<
  AttendanceResponse,
  { id: number; studentId: number; month: string; year: string }
>(
  "attendance/details",
  async ({ id, studentId, month, year }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${uri}/api/v4/attendances/details`, {
        params: {
          id: id,
          studentId: studentId,
          month: month,
          year: year,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.message);
    }
  }
);

const initialState: AttendanceState = {
  attendances: [],
  loading: false,
  error: null,
};

const AttendanceSlice = createSlice({
  name: "attendances",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get attendances details state
      .addCase(getAttendancesDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendancesDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.attendances = action.payload.data || [];
      })
      .addCase(getAttendancesDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default AttendanceSlice.reducer;

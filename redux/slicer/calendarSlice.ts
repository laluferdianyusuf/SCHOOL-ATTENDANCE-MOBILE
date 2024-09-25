import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CalendarState, CalendarResponse, Calendar } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uri } from "@/utils/uri";

// create calendar
export const createCalendar = createAsyncThunk<CalendarResponse, Calendar>(
  "course/create-course",
  async ({ id, date, description }, { rejectWithValue }) => {
    try {
      const payload = {
        date: date,
        description: description,
      };

      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `${uri}/api/v9/create-calendar/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.message);
    }
  }
);

// update calendar
export const updateCalendar = createAsyncThunk<CalendarResponse, Calendar>(
  "course/update-course",
  async ({ id, date, description, schoolId }, { rejectWithValue }) => {
    try {
      const payload = {
        date: date,
        description: description,
      };

      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `${uri}/api/v9/update-calendar`,
        payload,
        {
          params: {
            id: id,
            schoolId: schoolId,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.message);
    }
  }
);

// delete calendar by id
export const deleteCalendar = createAsyncThunk<CalendarResponse, Calendar>(
  "delete/calendar",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.delete(
        `${uri}/api/v9/delete-calendar/:${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.message);
    }
  }
);

// get calendar by school id
export const getCalendarBySchoolId = createAsyncThunk<
  CalendarResponse,
  { id: number; month: string; year: number }
>("calendar/by-school", async ({ id, month, year }, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(
      `${uri}/api/v9/query/get-calendar/school`,
      {
        params: {
          id: id,
          month: month,
          year: year,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.message);
  }
});

const initialState: CalendarState = {
  calendars: [],
  loading: false,
  error: null,
};

const CalendarSlice = createSlice({
  name: "calendars",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // create calendar states
      .addCase(createCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCalendar.fulfilled, (state, action) => {
        state.loading = false;
        state.calendars = action.payload.data || [];
      })
      .addCase(createCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // update calendar states
      .addCase(updateCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCalendar.fulfilled, (state, action) => {
        state.loading = false;
        state.calendars = action.payload.data || [];
      })
      .addCase(updateCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // delete calendar states
      .addCase(deleteCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCalendar.fulfilled, (state, action) => {
        state.loading = false;
        state.calendars = action.payload.data || [];
      })
      .addCase(deleteCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // list calendar by school id states
      .addCase(getCalendarBySchoolId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCalendarBySchoolId.fulfilled, (state, action) => {
        state.loading = false;
        state.calendars = action.payload.data || [];
      })
      .addCase(getCalendarBySchoolId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default CalendarSlice.reducer;

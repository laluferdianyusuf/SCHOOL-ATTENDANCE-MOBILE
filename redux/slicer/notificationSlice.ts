import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  Notification,
  NotificationResponse,
  NotificationState,
} from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uri } from "@/utils/uri";

// get notification by school id
export const getNotificationBySchoolId = createAsyncThunk<
  NotificationResponse,
  Notification
>(
  "notification/by-school",
  async ({ schoolId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${uri}/api/v6/notifications/user-school/${schoolId}/${userId}`
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.message);
    }
  }
);

// get notification by id
export const getNotificationById = createAsyncThunk<
  NotificationResponse,
  Notification
>("notification/by-id", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${uri}/api/v6/notifications/${id}`);

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.message);
  }
});

// open notification
export const openNotification = createAsyncThunk<
  NotificationResponse,
  Notification
>("open/notification", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${uri}/api/v6/notification/open/${id}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.message);
  }
});

// open all notifications
export const openAllNotifications = createAsyncThunk<
  NotificationResponse,
  Notification
>(
  "open/all-notification",
  async ({ userId, schoolId, isOpened }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${uri}/api/v6/notifications/opened`,
        {},
        {
          params: {
            userId: userId,
            schoolId: schoolId,
            isOpened: isOpened,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.message);
    }
  }
);

// delete notification
export const deleteNotification = createAsyncThunk<
  NotificationResponse,
  Notification
>("delete/notification", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await axios.delete(
      `${uri}/api/v6/notification/delete/${id}`
    );

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response);
  }
});

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

const NotificationSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get notification by school id states
      .addCase(getNotificationBySchoolId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotificationBySchoolId.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data || [];
      })
      .addCase(getNotificationBySchoolId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // list news by id states
      .addCase(getNotificationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotificationById.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data || [];
      })
      .addCase(getNotificationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // open notification
      .addCase(openNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(openNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data || [];
      })
      .addCase(openNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // open all notification
      .addCase(openAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(openAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data || [];
      })
      .addCase(openAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // delete notifications
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data || [];
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default NotificationSlice.reducer;

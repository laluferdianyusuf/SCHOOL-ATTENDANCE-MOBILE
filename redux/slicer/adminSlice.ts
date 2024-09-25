import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AdminResponse, Admin, AuthState } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uri } from "@/utils/uri";

// Admin registration
export const adminRegister = createAsyncThunk<AdminResponse, Admin>(
  "admin/register",
  async (admin, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${uri}/api/v7/register`, admin);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

//
export const parentRegister = createAsyncThunk<AdminResponse, Admin>(
  "parent/register",
  async (parent, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${uri}/api/v7/register/parent`,
        parent
      );

      return response.data;
    } catch (error: any) {
      console.log(error);

      return rejectWithValue(error.response?.data);
    }
  }
);

// Admin login
export const adminLogin = createAsyncThunk<AdminResponse, Admin>(
  "admin/login",
  async (admin, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${uri}/api/v7/login`, admin);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Parent login
export const parentLogin = createAsyncThunk<AdminResponse, Admin>(
  "parent/login",
  async (parent, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${uri}/api/v7/login/parent`, parent);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Get current user
export const currentUser = createAsyncThunk<AdminResponse, void>(
  "admin/current",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(`${uri}/api/v7/current/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// log out
export const logout = createAsyncThunk<void, void>(
  "admin/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem("token");
    } catch (error: any) {
      return rejectWithValue("Failed to log out");
    }
  }
);

// Change password
export const changePassword = createAsyncThunk<
  AdminResponse,
  {
    id: number;
    password: string;
    currentPassword: string;
    reTypePassword: string;
    device: string;
    hardware: string;
  }
>(
  "user/change-password",
  async (
    { id, password, currentPassword, reTypePassword, device, hardware },
    { rejectWithValue }
  ) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `${uri}/api/v7/update/change-password/${id}`,
        {
          currentPassword: currentPassword,
          password: password,
          reTypePassword: reTypePassword,
          device: device,
          hardware: hardware,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Update Account
export const updateAccount = createAsyncThunk<
  AdminResponse,
  {
    id: number;
    birthday: string;
    address: string;
    phoneNumber: string;
    device: string;
    hardware: string;
  }
>(
  "user/update-account",
  async (
    { id, birthday, address, phoneNumber, device, hardware },
    { rejectWithValue }
  ) => {
    try {
      const payload = {
        birthday: birthday,
        address: address,
        phoneNumber: phoneNumber,

        device: device,
        hardware: hardware,
      };
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `${uri}/api/v7/update/account/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState: AuthState = {
  admin: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    updateProfileField: (
      state,
      action: PayloadAction<{ field: keyof Admin; value: string }>
    ) => {
      (state as any)[action.payload.field] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      // Registration states
      .addCase(adminRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.data;
      })
      .addCase(adminRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Registration parent states
      .addCase(parentRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(parentRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.data;
      })
      .addCase(parentRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login states
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.data;
        state.token = action.payload.token;
        if (state.token) {
          AsyncStorage.setItem("token", state.token).catch((error) =>
            console.error("Error saving token:", error)
          );
        }
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login parent states
      .addCase(parentLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(parentLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.data;
        state.token = action.payload.token;
        if (state.token) {
          AsyncStorage.setItem("token", state.token).catch((error) =>
            console.error("Error saving token:", error)
          );
        }
      })
      .addCase(parentLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Current user states
      .addCase(currentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(currentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.data;
      })
      .addCase(currentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // logout states
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.admin = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("Logout error:", action.payload);
      })

      // change password states
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.data;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("change error:", action.payload);
      })

      // update account states
      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.data;
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("change error:", action.payload);
      });
  },
});

export const { updateProfileField } = authSlice.actions;
export default authSlice.reducer;

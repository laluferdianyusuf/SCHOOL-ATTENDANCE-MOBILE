import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Teacher, TeacherResponse, TeacherState } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uri } from "@/utils/uri";

// teacher registration
export const addTeacher = createAsyncThunk<TeacherResponse, Teacher>(
  "add/teacher",
  async (
    { name, address, born, gender, religion, nip, schoolId },
    { rejectWithValue }
  ) => {
    try {
      const payload = {
        name,
        address,
        born,
        gender,
        religion,
        nip,
      };
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `${uri}/api/v3/add/teacher/${schoolId}`,
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

// get teacher list by school
export const getTeachersBySchoolId = createAsyncThunk<TeacherResponse, number>(
  "get/teacher-school",
  async (schoolId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${uri}/api/v3/list/teachers/${schoolId}`,
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

// update teacher
export const updateTeacher = createAsyncThunk<
  TeacherResponse,
  { id: string; teacher: Teacher }
>("student/update", async ({ id, teacher }, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.put(
      `${uri}/api/v3/update/teacher/${id}`,
      teacher,
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
});

// delete teacher
export const deleteTeacher = createAsyncThunk<TeacherResponse, string | number>(
  "student/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.delete(
        `${uri}/api/v3/delete/teacher/${id}`,
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

export const getTeacherById = createAsyncThunk<TeacherResponse, string>(
  "student/getById",
  async (id, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${uri}/api/v3/list/teachers/${id}`, {
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

const initialState: TeacherState = {
  teachers: [],
  loading: false,
  error: null,
};

const teacherSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add teacher states
      .addCase(addTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers.push(action.payload.data[0]);
      })
      .addCase(addTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get teachers states
      .addCase(getTeachersBySchoolId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeachersBySchoolId.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload.data;
      })
      .addCase(getTeachersBySchoolId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update teacher states
      .addCase(updateTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        state.loading = false;
        const updateTeacher = action.payload.data[0];
        state.teachers = state.teachers.map((teacher) =>
          teacher.id === updateTeacher.id ? updateTeacher : teacher
        );
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete teacher states
      .addCase(deleteTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.loading = false;
        const deleteTeacher = action.payload.data[0].id;
        state.teachers = state.teachers.filter(
          (teacher) => teacher.id !== deleteTeacher
        );
      })
      .addCase(deleteTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get teacher by id states
      .addCase(getTeacherById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeacherById.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload.data;
      })
      .addCase(getTeacherById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default teacherSlice.reducer;

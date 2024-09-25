import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Student, StudentResponse, StudentState } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uri } from "@/utils/uri";

// student registration
export const addStudent = createAsyncThunk<
  StudentResponse,
  { name: string; classroom: string; schoolId: string }
>("student/add", async ({ name, classroom, schoolId }, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.post(
      `${uri}/api/v2/add/student/${schoolId}`,
      {
        name,
        classroom,
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
});

// get student list
export const getStudentsBySchoolId = createAsyncThunk<
  StudentResponse,
  { id: number }
>("student/get", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${uri}/api/v2/list/students/${id}`);
    return response.data;
  } catch (error: any) {
    console.log(error);

    return rejectWithValue(error.response?.data);
  }
});

// update student
export const updateStudent = createAsyncThunk<
  StudentResponse,
  { id: string; student: Student }
>("student/update", async ({ id, student }, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.put(
      `${uri}/api/v2/update/student/${id}`,
      student,
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

// delete student
export const deleteStudent = createAsyncThunk<StudentResponse, Student>(
  "student/delete",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.delete(
        `${uri}/api/v2/delete/student/${id}`,
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

export const getStudentById = createAsyncThunk<Student, { id: string }>(
  "student/getById",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${uri}/api/v2/get/student/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState: StudentState = {
  students: [],
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add student states
      .addCase(addStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.push(action.payload.data[0]);
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get students states
      .addCase(getStudentsBySchoolId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentsBySchoolId.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.data;
      })
      .addCase(getStudentsBySchoolId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update student states
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        const updatedStudent = action.payload.data[0];
        state.students = state.students.map((student) =>
          student.id === updatedStudent.id ? updatedStudent : student
        );
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete student states
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        const deletedStudentId = action.payload.data[0].id;
        state.students = state.students.filter(
          (student) => student.id !== deletedStudentId
        );
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get student by id states
      .addCase(getStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.students = [action.payload];
      })
      .addCase(getStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default studentSlice.reducer;

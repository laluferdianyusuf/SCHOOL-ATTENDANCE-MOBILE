import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CourseResponse, Course, CourseState } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uri } from "@/utils/uri";

// create course
export const createCourse = createAsyncThunk<CourseResponse, Course>(
  "course/create-course",
  async ({ id, courseName, description, courseCode }, { rejectWithValue }) => {
    try {
      const coursePayload = {
        courseName: courseName,
        description: description,
        courseCode: courseCode,
      };

      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `${uri}/api/v8/create-course/${id}`,
        coursePayload,
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

// get course by school
export const getCourseBySchool = createAsyncThunk<CourseResponse, Course>(
  "course/by-school",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${uri}/api/v8/get-course/schoolId/${id}`,
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

// get course by school student
export const getCourseBySchoolStudent = createAsyncThunk<
  CourseResponse,
  Course
>(
  "course/by-school-student",
  async ({ schoolId, studentId }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${uri}/api/v8/get-course/student-school`,
        {
          params: {
            schoolId: schoolId,
            studentId: studentId,
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
  }
);

const initialState: CourseState = {
  courses: [],
  loading: false,
  error: null,
};

const CourseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // create course states
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.data || [];
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // list course by school states
      .addCase(getCourseBySchool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCourseBySchool.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.data || [];
      })
      .addCase(getCourseBySchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // list course by school and student states
      .addCase(getCourseBySchoolStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCourseBySchoolStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.data || [];
      })
      .addCase(getCourseBySchoolStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default CourseSlice.reducer;

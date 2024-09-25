import { configureStore } from "@reduxjs/toolkit";
import AdminSlice from "@/redux/slicer/adminSlice";
import SchoolSlice from "@/redux/slicer/schoolSlice";
import StudentSlice from "@/redux/slicer/studentSlice";
import TeacherSlice from "@/redux/slicer/teacherSlice";
import NewsSlice from "@/redux/slicer/newsSlice";
import AttendanceSlice from "@/redux/slicer/attendanceSlice";
import NotificationSlice from "@/redux/slicer/notificationSlice";
import CourseSlice from "@/redux/slicer/courseSlice";
import CalendarSlice from "@/redux/slicer/calendarSlice";
import ActivitySlice from "@/redux/slicer/activitySlice";

export const store = configureStore({
  reducer: {
    auth: AdminSlice,
    school: SchoolSlice,
    student: StudentSlice,
    teacher: TeacherSlice,
    news: NewsSlice,
    notification: NotificationSlice,
    attendance: AttendanceSlice,
    course: CourseSlice,
    calendar: CalendarSlice,
    activity: ActivitySlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface MenuItemProps {
  id: string;
  label: string;
  icon: string;
  route?: string;
}

export interface RootStackParamList {
  index: undefined;
  explore: undefined;
  settings: undefined;
  news: undefined;
  help: undefined;
  about: undefined;
  [id: string]: undefined;
}

// category
export interface Category {
  id: string;
  name: string;
  desc: string;
  icon: string;
  primary: string;
  color: string;
  uri:
    | "/(category)/teacher"
    | "/(category)/student"
    | "/(category)/attendance"
    | "/(category)/calendar";
}

// admin
export interface Admin {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  birthday?: string;
  address?: string;
  phoneNumber?: string;
  schoolId?: string | number;
  studentId?: string | number;
  role?: string;
  expoToken?: string;
  device?: string;
  hardware?: string;
  "phone number"?: string;
}

export interface AuthState extends Admin {
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface AdminResponse {
  data: Admin;
  token: string;
  status: boolean;
  message: string;
}

// schools
export interface School {
  id: number;
  name: string;
  address: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolState {
  schools: School[];
  loading: boolean;
  error: string | null;
}
export interface SchoolResponse {
  data: School[];
}

// student
export interface Student extends Attendance {
  id?: string | number;
  name: string;
  classroom: string;
  parentName?: string;
  job?: string;
  relationship?: string;
  parentPhone?: string;
  schoolId?: number | string;
  attendances?: Attendance;
}

export interface StudentState {
  students: Student[];
  loading: boolean;
  error: string | null;
}

export interface StudentResponse {
  status: string;
  status_code: number;
  message: string;
  data: Student[];
}

// teacher
export interface Teacher {
  id?: string;
  name: string;
  address: string;
  born: string;
  gender?: string;
  religion?: string;
  nip?: string;
  schoolId?: number | string;
}

export interface TeacherState {
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
}

export interface TeacherResponse {
  status: string;
  status_code: number;
  message: string;
  data: Teacher[];
}

// News
export interface News {
  id?: number;
  title?: string;
  description?: string;
  image?: {
    uri?: string;
    name?: string;
    type: string;
  };
  category?: string;
  schoolId?: string | number;
  createdAt?: string;
}

export interface NewsState {
  news: News[];
  loading: boolean;
  error: string | null;
}
export interface NewsResponse {
  data: News[];
}

// notifications
export interface Notification {
  id?: number;
  userId?: number;
  description?: string;
  schoolId?: string | number;
  studentId?: string | number;
  attendanceId?: string | number;
  createdAt?: string;
  student?: {
    name?: string;
  };
  attendance?: {
    createdAt?: string;
  };
  isOpened?: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}
export interface NotificationResponse {
  data: Notification[];
}

// attendances
export interface Attendance {
  id?: string | number;
  present?: string;
  timestamp?: string;
  studentId?: string | number;
  schoolId?: string | number;
  createdAt?: string;
  student?: {
    name?: string;
    classroom?: string;
  };
}

export interface AttendanceState {
  attendances: Attendance[];
  loading: boolean;
  error: string | null;
}
export interface AttendanceResponse {
  data: Attendance[];
}

// courses
export interface Course {
  id?: number;
  courseName?: string;
  description?: string;
  courseCode?: string;
  schoolId?: string | number;
  userId?: string | number;
  studentId?: string | number;
}

export interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
}
export interface CourseResponse {
  data: Course[];
}

// calendars
export interface Calendar {
  id?: number;
  date?: string;
  description?: string;
  schoolId?: string | number;
}

export interface CalendarState {
  calendars: Calendar[];
  loading: boolean;
  error: string | null;
}
export interface CalendarResponse {
  data: Calendar[];
}

// Activity
export interface Activity {
  id?: number;
  device?: string;
  hardware?: string;
  timestamp?: string;
  description?: string;
  color?: string;
  icon?: string;
  userId?: number | string;
}

export interface ActivityState {
  activities: Activity[];
  loading: boolean;
  error: string | null;
}
export interface ActivityResponse {
  data: Activity[];
}

import Button from "@/components/Button";
import Loading from "@/components/Loading";
import RenderEmpty from "@/components/RenderEmpty";
import { currentUser } from "@/redux/slicer/adminSlice";
import { getCourseBySchoolStudent } from "@/redux/slicer/courseSlice";
import { getStudentById } from "@/redux/slicer/studentSlice";
import { AppDispatch } from "@/redux/store";
import { Admin, Course, Student } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { useDispatch } from "react-redux";

export const CourseScreen = () => {
  const { colors, dark } = useTheme();
  const dispatch: AppDispatch = useDispatch();
  const [user, setUser] = useState<Admin>();
  const [student, setStudent] = useState<Student | null>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await dispatch(currentUser()).unwrap();
      setUser(response.data);
    } catch (error) {
      setLoading(false);
      setRefreshing(false);
      console.error(error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const fetchCourse = async () => {
    if (!student) return;
    setLoading(true);
    try {
      const response = await dispatch(
        getCourseBySchoolStudent({
          schoolId: Number(student.schoolId),
          studentId: Number(student.id),
        })
      ).unwrap();
      setCourses(response.data);
    } catch (error) {
      setRefreshing(false);
      setLoading(false);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const fetchStudent = async () => {
    if (!user?.studentId) return;
    setLoading(true);
    try {
      const response = await dispatch(
        getStudentById({ id: String(user.studentId) })
      ).unwrap();
      setStudent(response);
    } catch (error) {
      setRefreshing(false);
      setLoading(false);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.studentId) {
      fetchStudent();
    }
  }, [user]);

  useEffect(() => {
    if (student?.schoolId && student?.id) {
      fetchCourse();
    }
  }, [student]);

  const handleAddCourse = () => {
    console.log("Add course button pressed");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUser();
    fetchStudent();
    fetchCourse();
  };
  const backgroundColor = dark ? "#041f1b" : "#c5e0dd";
  const tintColor = dark ? "#0D9485" : "#0D9485";

  return (
    <View className="pt-16 pb-6 px-6 mb-5 flex-1">
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              <View className="border border-custom-green-opacity-1 rounded-2xl p-3 w-full mt-4 flex-row gap-4 relative mb-3">
                <View className="bg-custom-green-opacity-1 w-14 rounded-2xl items-center h-14 justify-center">
                  <Text
                    className="text-xl text-custom-green-2 uppercase"
                    style={{ fontFamily: "Kanit" }}
                  >
                    {student?.name.charAt(0)}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <View>
                    <Text
                      className="capitalize"
                      style={{ fontFamily: "Kanit", color: colors.text }}
                    >
                      {student?.name}
                    </Text>
                    <Text
                      className="text-xs lowercase"
                      style={{ fontFamily: "Kanit", color: colors.text }}
                    >
                      {student?.classroom}
                    </Text>
                  </View>
                </View>
                <View className="absolute" style={{ bottom: 5, right: 10 }}>
                  <Text
                    className="text-custom-green-opacity-1"
                    style={{ fontFamily: "Kanit" }}
                  >
                    {student?.parentName || "no parent assigned"}
                  </Text>
                </View>
              </View>
            </>
          }
          data={courses}
          renderItem={({ item }) => (
            <>
              {courses.length > 0 ? (
                <View className="p-3 flex-row justify-between items-center">
                  <View>
                    <Text
                      className="text-lg"
                      style={{ fontFamily: "Kanit", color: colors.text }}
                    >
                      {item.courseName}
                    </Text>
                    <Text
                      className="text-xs text-gray-500"
                      style={{ fontFamily: "Kanit", color: colors.text }}
                    >
                      {item.description || "No description available"}
                    </Text>
                  </View>
                  <View className="w-20">
                    <Text
                      className="text-sm mt-2"
                      style={{ fontFamily: "Kanit", color: colors.text }}
                    >
                      Code: {item.courseCode || "N/A"}
                    </Text>
                    <Text
                      className="text-sm mt-1"
                      style={{ fontFamily: "Kanit", color: colors.text }}
                    >
                      Id: {item.id || "N/A"}
                    </Text>
                  </View>
                </View>
              ) : (
                !loading && (
                  <RenderEmpty
                    descriptions="No courses available"
                    icon="book-outline"
                  />
                )
              )}
            </>
          )}
          keyExtractor={(item) => String(item.id)}
          ListFooterComponent={
            <View className="mt-4">
              <Button
                handle={handleAddCourse}
                style={`bg-custom-green-1 p-5 rounded-2xl justify-center items-center flex-row gap-3`}
              >
                <Text style={{ fontFamily: "Kanit", color: colors.text }}>
                  add course
                </Text>
                <Ionicons name="book" color={colors.text} size={20} />
              </Button>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#0D9485"]}
              tintColor={tintColor}
              progressBackgroundColor={backgroundColor}
            />
          }
        />
      )}
    </View>
  );
};

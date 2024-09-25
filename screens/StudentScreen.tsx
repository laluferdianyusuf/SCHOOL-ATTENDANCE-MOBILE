import { FlatList, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@react-navigation/native";
import SearchBar from "@/components/SearchBar";
import { RefreshControl } from "react-native-gesture-handler";
import RenderParticipant from "@/components/RenderParticipant";
import Filter from "@/components/Filter";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getStudentsBySchoolId } from "@/redux/slicer/studentSlice";
import { Student } from "@/types/types";
import RenderEmpty from "@/components/RenderEmpty";
import BackButton from "@/components/BackButton";

export const StudentScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const [students, setStudents] = useState<Student[]>([]);
  const { userSchoolId } = useLocalSearchParams();
  const { dark } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [displayedData, setDisplayedData] = useState<Student[]>([]);

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    setIsLoading(true);
    try {
      const response = await dispatch(
        getStudentsBySchoolId({ id: Number(userSchoolId) })
      ).unwrap();
      setStudents(response.data);
      setDisplayedData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const backgroundColor = dark ? "#041f1b" : "#c5e0dd";
  const tintColor = dark ? "#0D9485" : "#0D9485";

  const handleSearch = (query: string) => {
    setIsLoading(true);
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(query.toLowerCase())
    );
    setDisplayedData(filtered);
    setIsLoading(false);
  };

  const handleFilter = (filter: Student | null) => {
    setIsLoading(true);
    if (filter) {
      const filtered = students.filter((student) =>
        filter.classroom ? student.classroom === filter.classroom : true
      );
      setDisplayedData(filtered);
    } else {
      setDisplayedData(students);
    }
    setIsLoading(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStudent();
  };

  return (
    <View className="pt-16 flex-1 px-6">
      <BackButton />
      <View className="flex-1">
        <View className="flex-row gap-2">
          <SearchBar placeholder="Search Student" onSearch={handleSearch} />
          <Filter
            onFilter={handleFilter}
            icon="school-outline"
            isLoading={isLoading}
          />
        </View>
        <View className="flex-row items-center gap-4 justify-center mb-2">
          <View className="h-[1px] bg-custom-green-opacity-1 flex-1" />
          <Text
            className="text-custom-green-opacity-1"
            style={{ fontFamily: "Kanit" }}
          >
            students
          </Text>
          <View className="h-[1px] bg-custom-green-opacity-1 flex-1" />
        </View>
        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={displayedData}
            renderItem={({ item }) => (
              <RenderParticipant
                onPress={() =>
                  router.push({
                    pathname: "/(main)/details",
                    params: {
                      studentId: item.id,
                      student: JSON.stringify(item),
                    },
                  })
                }
                student={item}
              />
            )}
            ListEmptyComponent={
              <RenderEmpty
                descriptions="no students available"
                icon="school-outline"
              />
            }
            keyExtractor={(item) => item.id!}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flex: 1 }}
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
    </View>
  );
};

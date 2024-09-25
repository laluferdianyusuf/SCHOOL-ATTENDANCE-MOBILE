import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@react-navigation/native";
import SearchBar from "@/components/SearchBar";
import { RefreshControl } from "react-native-gesture-handler";
import RenderParticipant from "@/components/RenderParticipant";
import Filter from "@/components/Filter";
import Loading from "@/components/Loading";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getTeachersBySchoolId } from "@/redux/slicer/teacherSlice";
import { Teacher } from "@/types/types";
import RenderEmpty from "@/components/RenderEmpty";
import BackButton from "@/components/BackButton";

export const TeacherScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const { userSchoolId } = useLocalSearchParams();
  const { dark } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [displayedData, setDisplayedData] = useState<Teacher[]>([]);

  useEffect(() => {
    fetchTeacher();
  }, []);

  const fetchTeacher = async () => {
    setIsLoading(true);
    try {
      const response = await dispatch(
        getTeachersBySchoolId(Number(userSchoolId))
      ).unwrap();

      setTeachers(response.data);
      setDisplayedData(response.data);
      setRefreshing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const backgroundColor = dark ? "#041f1b" : "#c5e0dd";
  const tintColor = dark ? "#0D9485" : "#0D9485";

  const handleSearch = (query: string) => {
    setIsLoading(true);
    const filtered = teachers.filter((teacher) =>
      teacher.name.toLowerCase().includes(query.toLowerCase())
    );
    setDisplayedData(filtered);
    setIsLoading(false);
  };

  const handleFilter = (filter: Teacher | null) => {
    setIsLoading(true);
    if (filter) {
      const filtered = teachers.filter(
        (teacher) =>
          (filter.address ? teacher.address === filter.address : true) &&
          (filter.nip ? teacher.nip === filter.nip : true)
      );
      setDisplayedData(filtered);
    } else {
      setDisplayedData(teachers);
    }
    setIsLoading(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTeacher();
  };

  return (
    <View className="pt-16 flex-1 px-6">
      <BackButton />
      <View className="flex-1">
        <View className="flex-row gap-2">
          <SearchBar placeholder="Search Teacher" onSearch={handleSearch} />
          <Filter
            onFilter={handleFilter}
            icon="people-outline"
            isLoading={isLoading}
          />
        </View>
        <View className="flex-row items-center gap-4 justify-center mb-2">
          <View className="h-[1px] bg-custom-green-opacity-1 flex-1" />
          <Text
            className="text-custom-green-opacity-1"
            style={{ fontFamily: "Kanit" }}
          >
            teachers
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
                      teacherId: item.id,
                      teacher: JSON.stringify(item),
                    },
                  })
                }
                teacher={item}
              />
            )}
            keyExtractor={(item) => item.id!}
            ListEmptyComponent={
              <RenderEmpty
                descriptions="no teachers available"
                icon="people-outline"
              />
            }
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

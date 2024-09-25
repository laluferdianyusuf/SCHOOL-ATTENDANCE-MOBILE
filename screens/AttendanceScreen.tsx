import React, { useState, useEffect } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getAttendancesDetails } from "@/redux/slicer/attendanceSlice";
import RenderEmpty from "@/components/RenderEmpty";
import Loading from "@/components/Loading";
import RenderAttendances from "@/components/RenderAttendances";
import Modals from "@/components/Modal";
import BackButton from "@/components/BackButton";

export const AttendanceScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const { colors, dark } = useTheme();
  const { userSchoolId, userStudentId } = useLocalSearchParams();
  const { attendances } = useSelector((state: RootState) => state.attendance);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    `${new Date().toLocaleString("default", {
      month: "long",
    })} ${new Date().getFullYear()}`
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [month, year] = selectedDate.split(" ");
  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      await dispatch(
        getAttendancesDetails({
          id: Number(userSchoolId),
          studentId: Number(userStudentId),
          month: month,
          year: year,
        })
      ).unwrap();
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAttendance();
  };

  const handleDateSelect = (month: string) => {
    const currentYear = new Date().getFullYear();
    setSelectedDate(`${month} ${currentYear}`);
    setIsModalVisible(false);
  };

  const backgroundColor = dark ? "#041f1b" : "#c5e0dd";
  const tintColor = dark ? "#0D9485" : "#0D9485";

  return (
    <View className="flex-1 pt-16 px-6">
      <View className="flex-row justify-between">
        <View className="flex-row items-center justify-center gap-3">
          <BackButton />
          <Text
            className="capitalize"
            style={{ fontFamily: "Kanit", color: colors.text }}
          >
            attendances
          </Text>
        </View>
        <Pressable
          className={`${
            dark ? "bg-custom-green-dark" : "bg-custom-green-light"
          } py-3 px-6 rounded-xl`}
          onPress={() => setIsModalVisible(true)}
        >
          <Text
            style={{
              fontFamily: "Kanit",
              color: colors.text,
            }}
          >
            {selectedDate}
          </Text>
        </Pressable>
      </View>
      <View className="flex-row items-center gap-4 justify-center mb-3">
        <View className="h-[1px] bg-custom-green-opacity-1 flex-1" />
        <Text
          className="text-custom-green-opacity-1"
          style={{ fontFamily: "Kanit" }}
        >
          attendances
        </Text>
        <View className="h-[1px] bg-custom-green-opacity-1 flex-1" />
      </View>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={attendances}
          renderItem={({ item, index }) => (
            <View>
              <RenderAttendances
                item={item}
                index={index}
                totalItems={attendances.length}
              />
            </View>
          )}
          ListEmptyComponent={
            <RenderEmpty
              descriptions={`no attendances at ${month} ${year}`}
              icon="finger-print-outline"
            />
          }
          keyExtractor={(item) => item.id!.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
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

      <Modals
        isModalVisible={isModalVisible}
        months={months}
        onBackDrop={() => setIsModalVisible(false)}
        onPress={handleDateSelect}
      />
    </View>
  );
};

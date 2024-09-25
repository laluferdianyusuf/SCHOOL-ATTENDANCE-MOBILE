import React, { useState, useEffect } from "react";
import { Pressable, Text, View, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@react-navigation/native";
import Modals from "@/components/Modal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Calendar } from "@/types/types";
import { getCalendarBySchoolId } from "@/redux/slicer/calendarSlice";
import { formatDate } from "@/utils/FormatTimeAtt";
import Loading from "@/components/Loading";
import BackButton from "@/components/BackButton";

interface DateObject {
  date: number;
  inCurrentMonth: boolean;
  dayOfWeek: number;
  month: number;
  year: number;
}

export const CalendarScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const { colors, dark } = useTheme();
  const { userSchoolId, user } = useLocalSearchParams();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [dates, setDates] = useState<DateObject[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const parsedUser = typeof user === "string" ? JSON.parse(user) : user;

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
  useEffect(() => {
    fetchDataCalendar();
  }, [selectedMonth]);

  const fetchDataCalendar = () => {
    const currentYear = new Date().getFullYear();
    setIsLoading(true);
    try {
      dispatch(
        getCalendarBySchoolId({
          id: Number(userSchoolId),
          month: months[selectedMonth],
          year: currentYear,
        })
      )
        .unwrap()
        .then((res) => setCalendars(res.data));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = months.indexOf(months[selectedMonth]);
    const firstDayOfMonth = new Date(
      currentYear,
      currentMonthIndex,
      1
    ).getDay();
    const lastDateOfMonth = new Date(
      currentYear,
      currentMonthIndex + 1,
      0
    ).getDate();
    const lastDateOfPreviousMonth = new Date(
      currentYear,
      currentMonthIndex,
      0
    ).getDate();

    let tempDates: DateObject[] = [];

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const dayOfWeek = (7 + (firstDayOfMonth - 1 - i)) % 7;
      tempDates.push({
        date: lastDateOfPreviousMonth - i,
        inCurrentMonth: false,
        dayOfWeek: dayOfWeek,
        month: currentMonthIndex - 1,
        year: currentYear,
      });
    }

    for (let date = 1; date <= lastDateOfMonth; date++) {
      const dayOfWeek = (firstDayOfMonth + date - 1) % 7;
      tempDates.push({
        date: date,
        inCurrentMonth: true,
        dayOfWeek: dayOfWeek,
        month: currentMonthIndex,
        year: currentYear,
      });
    }

    const remainingSlots = 7 - (tempDates.length % 7);
    if (remainingSlots < 7) {
      for (let i = 1; i <= remainingSlots; i++) {
        const dayOfWeek = tempDates.length % 7;
        tempDates.push({
          date: i,
          inCurrentMonth: false,
          dayOfWeek: dayOfWeek,
          month: currentMonthIndex + 1,
          year: currentYear,
        });
      }
    }

    setDates(tempDates);
  }, [selectedMonth]);

  const handleDateSelect = (month: string) => {
    const monthIndex = months.indexOf(month);
    if (monthIndex !== -1) {
      setSelectedMonth(monthIndex);
      setIsModalVisible(false);
    }
  };

  return (
    <View className="pt-16 flex-1 px-6">
      <View className="flex-row justify-between items-center">
        <BackButton />

        <Pressable
          className={`${
            dark ? "bg-custom-green-dark" : "bg-custom-green-light"
          } py-3 px-6 rounded-xl my-4`}
          onPress={() => setIsModalVisible(true)}
        >
          <Text
            style={{
              fontFamily: "Kanit",
              color: colors.text,
            }}
          >
            {months[selectedMonth]} {new Date().getFullYear()}
          </Text>
        </Pressable>
      </View>

      <Text
        className="text-center text-xl my-4"
        style={{ fontFamily: "Kanit", color: colors.text }}
      >
        Academic Calendar
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <View className="flex-row flex-wrap justify-between mb-3">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => (
                  <Text
                    className="w-[14%] text-center font-bold"
                    key={index}
                    style={{
                      fontFamily: "Kanit",
                      color: index === 0 ? "red" : colors.text,
                    }}
                  >
                    {day}
                  </Text>
                )
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {dates.map((dateObj, index) => {
                const isEventDate = calendars.some((cal) => {
                  if (!cal.date) return false;
                  const eventDate = new Date(cal.date);
                  return (
                    eventDate.getDate() === dateObj.date &&
                    eventDate.getMonth() === dateObj.month &&
                    eventDate.getFullYear() === dateObj.year
                  );
                });
                return (
                  <View
                    className={`border ${
                      dark
                        ? dateObj.inCurrentMonth
                          ? isEventDate
                            ? "border-custom-green-1"
                            : "border-custom-green-dark"
                          : "border-transparent"
                        : `${
                            dateObj.inCurrentMonth
                              ? isEventDate
                                ? "border-custom-green-1"
                                : "border-custom-green-light"
                              : "border-transparent"
                          }`
                    } w-[14%] aspect-square items-center justify-center my-1 rounded-md`}
                    key={index}
                  >
                    <Text
                      style={{
                        color: isEventDate
                          ? "rgb(20 184 166)"
                          : dateObj.dayOfWeek === 0
                          ? "red"
                          : colors.text,
                        fontFamily: "Kanit",
                        opacity: dateObj.inCurrentMonth ? 1 : 0.3,
                      }}
                    >
                      {dateObj.date}
                    </Text>
                  </View>
                );
              })}
              <View className="mt-5 w-full">
                <View className="flex-row justify-between items-center">
                  <Text
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: "Kanit",
                      color: colors.text,
                    }}
                  >
                    Description
                  </Text>
                  {parsedUser.role === "admin" &&
                    parsedUser.role === "superadmin" && (
                      <Pressable onPress={() => console.log("event pressed")}>
                        <Text
                          className="text-custom-green-2"
                          style={{
                            fontFamily: "Kanit",
                          }}
                        >
                          add events
                        </Text>
                      </Pressable>
                    )}
                </View>

                {Array.isArray(calendars) && calendars.length > 0 ? (
                  calendars.map((cal, index) => (
                    <View
                      key={index}
                      className="pt-4 flex-row gap-3 items-center"
                    >
                      <View className="border border-custom-green-1 w-10 h-10 items-center justify-center rounded-lg">
                        <Text
                          style={{
                            fontFamily: "Kanit",
                            color: "rgb(20 184 166)",
                          }}
                        >
                          {formatDate(cal.date).split(" ")[1]}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            fontFamily: "Kanit",
                            color: colors.text,
                          }}
                        >
                          {formatDate(cal.date)}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Kanit",
                            color: colors.text,
                          }}
                        >
                          {cal.description}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="pt-4">
                    <Text
                      style={{
                        fontFamily: "Kanit",
                        color: colors.text,
                      }}
                    >
                      No Events this month
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <Modals
        isModalVisible={isModalVisible}
        months={months}
        onBackDrop={() => setIsModalVisible(false)}
        onPress={handleDateSelect}
      />
    </View>
  );
};

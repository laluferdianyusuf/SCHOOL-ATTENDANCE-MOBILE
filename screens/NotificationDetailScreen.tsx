import { View, Text, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { Notification } from "@/types/types";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import formatDateTime from "@/utils/formatDateTime";

interface NotificationDetailScreenProps {
  id: number;
  notification: Notification;
}

export const NotificationDetailScreen: React.FC<
  NotificationDetailScreenProps
> = ({ id, notification }) => {
  const { colors, dark } = useTheme();

  const { dateFormatted, timeFormatted } = formatDateTime(
    notification?.attendance?.createdAt || ""
  );

  return (
    <>
      <Pressable
        onPress={() => router.back()}
        className="absolute z-50 p-1 rounded-md"
        style={{ top: 50, left: 20, backgroundColor: colors.background }}
      >
        <Ionicons name="arrow-back" color="rgb(13 148 133)" size={25} />
      </Pressable>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#c5e0dd", dark: "#041f1b" }}
        headerImage={
          <Ionicons
            size={270}
            name="notifications-outline"
            style={{
              color: "#0D9485",
              bottom: -50,
              left: -40,
              position: "absolute",
              opacity: 0.5,
            }}
          />
        }
      >
        <View className="">
          <View>
            <View className="flex-row justify-between items-center">
              <Text
                className=" font-bold text-lg pb-2"
                style={{ fontFamily: "Kanit", color: colors.text }}
              >
                Attendance
              </Text>

              <View className="flex-row gap-2">
                <Text
                  className=" font-bold text-xs text-custom-green-2 pb-2"
                  style={{ fontFamily: "Kanit" }}
                >
                  {dateFormatted}
                </Text>
                <Text
                  className=" font-bold text-xs text-custom-green-2 pb-2"
                  style={{ fontFamily: "Kanit" }}
                >
                  {timeFormatted}
                </Text>
              </View>
            </View>
            <View className="flex-row gap-3 justify-center items-center mb-4">
              <View className="h-[1px] bg-custom-green-2 flex-1 opacity-35" />
              <Text
                className="opacity-35 text-custom-green-2"
                style={{ fontFamily: "Kanit" }}
              >
                notifications
              </Text>
              <View className="h-[1px] bg-custom-green-2 flex-1 opacity-35" />
            </View>
          </View>
          <Text
            className="text-justify"
            style={{ fontFamily: "Kanit", color: colors.text }}
          >
            {notification?.description}
          </Text>
        </View>
      </ParallaxScrollView>
    </>
  );
};

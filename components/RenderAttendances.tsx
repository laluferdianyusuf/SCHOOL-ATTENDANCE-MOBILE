import { View, Text } from "react-native";
import React from "react";
import { Attendance } from "@/types/types";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { formatDate, formatTime } from "@/utils/FormatTimeAtt";

interface RenderAttendancesProps {
  item: Attendance;
  index?: number;
  totalItems?: number;
}

export default function RenderAttendances({
  item,
  index,
  totalItems,
}: RenderAttendancesProps) {
  const { colors, dark } = useTheme();

  return (
    <View className="flex-row gap-4 items-center">
      <View
        className={`w-7 h-7 ${
          dark ? "bg-custom-green-dark" : "bg-custom-green-light"
        } rounded-full items-center justify-center border`}
        style={{
          borderColor: dark ? "rgb(4 31 27)" : "rgb(197 224 221)",
        }}
      >
        <View className="bg-custom-green-2 rounded-full h-6 w-6 items-center justify-center">
          <Ionicons name="checkmark-sharp" size={15} color={"white"} />
        </View>
        {index! < totalItems! - 1 && (
          <View
            className="absolute left-1/2 h-[40px] w-[2px] top-[32px] border-dashed border-[1px] opacity-50"
            style={{
              borderColor: colors.text,
              transform: [{ translateX: -1 }],
            }}
          />
        )}
      </View>
      <View
        className={`p-4 rounded-xl mb-3 flex-1 flex-row justify-between items-center ${
          dark ? "bg-custom-green-dark" : "bg-custom-green-light"
        }`}
      >
        <View>
          <View className="flex-row items-center gap-2">
            <Text
              className="text-base capitalize font-bold"
              style={{ color: colors.text, fontFamily: "Kanit" }}
            >
              {item?.student?.name || "Unknown Student"}
            </Text>
            <View className="border border-custom-green-1 px-1 rounded-md items-center justify-center">
              <Text
                className="text-xs opacity-70"
                style={{ color: colors.text, fontFamily: "Kanit" }}
              >
                {item?.present || ""}
              </Text>
            </View>
          </View>
          <Text
            className="opacity-50"
            style={{ color: colors.text, fontFamily: "Kanit" }}
          >
            {formatDate(item?.createdAt)}
          </Text>
        </View>
        <View>
          <Text style={{ color: colors.text, fontFamily: "Kanit" }}>
            {formatTime(item?.timestamp)}
          </Text>
        </View>
      </View>
    </View>
  );
}

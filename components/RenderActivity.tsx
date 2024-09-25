import { View, Text } from "react-native";
import React from "react";
import { Activity } from "@/types/types";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { format, isToday, formatDistanceToNow } from "date-fns";

interface RenderActivityProps {
  item: Activity;
  index?: number;
  totalItems?: number;
}

export default function RenderActivity({
  item,
  index,
  totalItems,
}: RenderActivityProps) {
  const { colors, dark } = useTheme();

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);

    if (isToday(date)) {
      return format(date, "h:mm a");
    } else {
      let distance = formatDistanceToNow(date, {
        addSuffix: true,
        includeSeconds: false,
      });

      distance = distance.replace("about ", "");

      return distance;
    }
  };

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
        <View
          style={{ backgroundColor: item.color }}
          className={`rounded-full h-6 w-6 items-center justify-center bg-[${item.color}] `}
        >
          <Ionicons name={item.icon as any} size={15} color={"white"} />
        </View>
        {index! < totalItems! - 1 && (
          <View
            className="absolute left-1/2 h-[40px] w-[2px] top-[32px] border-[1px] opacity-50"
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
          <View className="flex-row gap-2">
            <Text
              className="text-base capitalize font-bold"
              style={{ color: colors.text, fontFamily: "Kanit" }}
            >
              {item?.device}
            </Text>
            <View className="rounded-lg justify-end">
              <Text
                className="text-slate-500 text-sm"
                style={{ color: colors.text, fontFamily: "Kanit" }}
              >
                {formatDate(item?.timestamp!)}
              </Text>
            </View>
            <View className="border border-slate-500 px-2 rounded-lg">
              <Text style={{ color: colors.text, fontFamily: "Kanit" }}>
                {item?.hardware}
              </Text>
            </View>
          </View>
          <Text
            className="opacity-50"
            style={{ color: colors.text, fontFamily: "Kanit" }}
          >
            {item?.description || "Unknown Descriptions"}
          </Text>
        </View>
      </View>
    </View>
  );
}

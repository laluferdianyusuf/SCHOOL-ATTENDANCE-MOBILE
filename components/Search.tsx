import { View, Text, Pressable } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Search() {
  const { colors } = useTheme();
  return (
    <Pressable onPress={() => router.push("/course")} className="opacity-60">
      <View
        className="flex-row items-center rounded-2xl p-4 mt-4"
        style={{ backgroundColor: colors.background }}
      >
        <MaterialCommunityIcons name="magnify" size={20} color={colors.text} />
        <View className="h-[60%] bg-custom-green-2 ml-1" style={{ width: 1 }} />
        <Text
          className="ml-2"
          style={{ color: colors.text, fontFamily: "Kanit" }}
        >
          What do you want to learn
        </Text>
      </View>
    </Pressable>
  );
}

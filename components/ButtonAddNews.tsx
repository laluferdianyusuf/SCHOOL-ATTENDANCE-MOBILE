import { View, Text, Pressable, Dimensions } from "react-native";
import React, { ReactNode } from "react";
import { router } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

interface ButtonAddNewsProps {
  children: ReactNode;
}
export default function ButtonAddNews({ children }: ButtonAddNewsProps) {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get("window").width;
  return (
    <Pressable
      className=" flex-1 rounded-xl border justify-center items-center p-5 border-custom-green-1 border-dashed h-72"
      onPress={() => router.push("/(news)/news")}
      style={{ width: screenWidth * 0.9 }}
    >
      <Ionicons name="newspaper-outline" color={colors.text} size={80} />
      {children}
    </Pressable>
  );
}

import { View, Text, Pressable } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import BackButton from "@/components/BackButton";
//
export const HelpSupportScreen = () => {
  const { colors } = useTheme();
  return (
    <View className="pt-16 px-6 flex-1">
      <BackButton />
      <Text style={{ fontFamily: "Kanit", color: colors.text }}>
        HelpSupportScreen
      </Text>
    </View>
  );
};

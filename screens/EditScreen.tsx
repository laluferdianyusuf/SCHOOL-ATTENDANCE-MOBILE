import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import BackButton from "@/components/BackButton";
import { router, useLocalSearchParams } from "expo-router";

export const EditScreen = () => {
  const { colors } = useTheme();
  const { field, value } = useLocalSearchParams();
  const [newValue, setNewValue] = useState(value as string);

  const saveChanges = () => {
    router.back({
      params: {
        updatedField: field,
        updatedValue: newValue,
      },
    });
  };

  return (
    <View className="pt-16 px-6 flex-1">
      <View className="flex-row gap-3 items-center">
        <BackButton />
        <Text
          className="capitalize"
          style={{ fontFamily: "Kanit", color: colors.text }}
        >
          Edit {field}
        </Text>
      </View>
    </View>
  );
};

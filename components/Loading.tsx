import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

export default function Loading() {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#0D9485" />
      <Text
        className="text-custom-green-2"
        style={{
          fontFamily: "Kanit",
        }}
      >
        Loading
      </Text>
    </View>
  );
}
